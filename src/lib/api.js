import wretch from "wretch";
export const api = wretch().url("/api");
export const liquid = wretch().url("/liquid");
export const electrs = wretch().url("/electrs");
