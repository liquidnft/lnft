import { get } from "svelte/store";
import { token } from "$lib/store";
import {UPLOAD_DESTINATION} from "$lib/utils";

export default async (file, progress, destination = UPLOAD_DESTINATION.IPFS) => {
  let url = "/api/upload";
  let formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    let ajax = new XMLHttpRequest();
    ajax.addEventListener("load", () => {
      if (ajax.readyState === ajax.DONE) {
        if (ajax.status === 200) resolve(ajax.response);
        else reject(new Error(`Upload failed: ${ajax.response}`));
      }
    });
    ajax.upload.addEventListener("progress", progress, false);
    ajax.open("POST", url);
    
    if(destination) {
      if([UPLOAD_DESTINATION.IPFS, UPLOAD_DESTINATION.STORAGE].indexOf(destination) !== -1) {
        ajax.setRequestHeader("X-DESTINATION", destination);
      } else {
        throw new Error(`Upload destination has a wrong value - "${destination}"`);
      }
    }
    
    ajax.setRequestHeader("Authorization", `Bearer ${get(token)}`);
    ajax.send(formData);
  });
};
