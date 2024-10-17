// Taken from https://github.com/sergiodxa/remix-utils/blob/main/src/react/use-hydrated.ts#L25

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
