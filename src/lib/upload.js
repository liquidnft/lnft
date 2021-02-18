import { get } from "svelte/store";
import { token } from "$lib/store";

export default async (file, progress) => {
  let url = "/api/upload";
  let formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    let ajax = new XMLHttpRequest();
    ajax.addEventListener("load", () => {
      if (ajax.readyState === ajax.DONE) {
        if (ajax.status === 200) {
          resolve(ajax.response);
        }
      }
    });
    ajax.upload.addEventListener("progress", progress, false);
    ajax.open("POST", url);
    ajax.setRequestHeader('Content-Type', file.type);
    ajax.setRequestHeader("Authorization", `Bearer ${get(token)}`);
    ajax.send(formData);
  });
};
