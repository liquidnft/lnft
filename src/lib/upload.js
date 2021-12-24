import { get } from "svelte/store";
import { token } from "$lib/store";

export const supportedTypes = ["jpg", "png", "gif", "mp4"];

export const upload = async (file, progress) => {
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
    ajax.setRequestHeader("Authorization", `Bearer ${get(token)}`);
    ajax.send(formData);
  });
};
