"use client";

import { useSyncExternalStore } from "react";

/**
 * The address bar’s query string as React state, for the filter islands on static hubs (award pass 2,
 * 5.2 and 8.2.1). The server and hydration render with no query (the static page); the browser then
 * reads location.search. `pushSearch` changes the address without a server round trip.
 */
const EVENT = "searchchange";
const subscribe = (notify: () => void) => {
  window.addEventListener("popstate", notify);
  window.addEventListener(EVENT, notify);
  return () => {
    window.removeEventListener("popstate", notify);
    window.removeEventListener(EVENT, notify);
  };
};

export const useSearch = () => useSyncExternalStore(subscribe, () => window.location.search, () => "");

export function pushSearch(url: string) {
  window.history.pushState(null, "", url);
  window.dispatchEvent(new Event(EVENT));
}
