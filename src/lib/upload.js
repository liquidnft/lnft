import { get } from "svelte/store";
import { token } from "$lib/store";

export default async (file, progress) => {
  let url = `/api/storage/o/public/${file.name}`;
  let formData = new FormData();

  formData.append("file", file);

  let ajax = new XMLHttpRequest();
  ajax.upload.addEventListener("progress", progress, false);
  ajax.open("POST", url);
  ajax.setRequestHeader("Authorization", `Bearer ${get(token)}`);
  ajax.send(formData);
};
