import { writable, derived } from "svelte/store";
import { beforeUpdate } from "svelte";

export const location = writable({
  current: undefined,
  previous: undefined,
});

export const routeHasChanged = derived(location, ($l) => {
  if (!$l.previous || !$l.current) return true;

  if ($l.previous.pathname !== $l.current.pathname) return true;

  return false;
});

export function trackLocation() {
  beforeUpdate(() => {
    if (typeof window !== "undefined") {
      location.update((l) => {
        return {
          previous: l.current,
          current: { ...window.location },
        };
      });
    }
  });
}
