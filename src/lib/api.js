import wretch from "wretch";
export const api = wretch().url("/api");
export const electrs = wretch().url("/electrs");
export const amp = wretch().url("/amp");
