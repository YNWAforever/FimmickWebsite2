"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore, type MouseEvent } from "react";
import { safeQueryForLocaleSwitch } from "@/lib/safe-query";

export type LanguageOption = { code: "en" | "zh-hant" | "zh-hans"; label: string; short: string; lang: string; current: boolean };

/** Swap the locale segment, keep the equivalent page, carry only safe context. */
function targetPath(pathname: string, code: LanguageOption["code"]) {
  const rest = pathname.replace(/^\/(en|zh-hant|zh-hans)(?=\/|$)/, "") || "";
  return `/${code}${rest}`;
}

/** The safe part of the query plus the hash, kept in step with the address (award pass 2, Phase 9). */
const subscribe = (notify: () => void) => {
  window.addEventListener("hashchange", notify);
  window.addEventListener("popstate", notify);
  window.addEventListener("searchchange", notify);
  return () => {
    window.removeEventListener("hashchange", notify);
    window.removeEventListener("popstate", notify);
    window.removeEventListener("searchchange", notify);
  };
};
const readSuffix = () => `${safeQueryForLocaleSwitch(window.location.search)}${window.location.hash}`;

export function LanguageSwitch({ options, label }: { options: LanguageOption[]; label: string }) {
  const pathname = usePathname() || "/en";
  const router = useRouter();
  // The server renders the bare path; once mounted the href carries the safe query and the hash, so a
  // new-tab or copied link is the same page as a plain click.
  const suffix = useSyncExternalStore(subscribe, readSuffix, () => "");
  return (
    <span className="lang-switch" role="group" aria-label={label}>
      {options.map((option) => {
        if (option.current) {
          return (
            <span key={option.code} aria-current="true" lang={option.lang} title={option.label}>
              {option.short}
              <span className="sr-only"> {option.label}</span>
            </span>
          );
        }
        const href = `${targetPath(pathname, option.code)}${suffix}`;
        // Read the address again whenever the link is about to be used (a client navigation can change
        // the query or hash without re-rendering the header), so every route to it gets the live page.
        const live = () => `${targetPath(pathname, option.code)}${readSuffix()}`;
        const refresh = (event: { currentTarget: HTMLAnchorElement }) => event.currentTarget.setAttribute("href", live());
        // Only a plain primary click navigates in place; modified clicks (new tab, new window, download)
        // and other buttons keep the browser’s own behaviour.
        const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
          event.preventDefault();
          router.push(live());
        };
        return (
          <a key={option.code} href={href} hrefLang={option.lang} lang={option.lang} title={option.label} onPointerDown={refresh} onFocus={refresh} onClick={onClick}>
            {option.short}
            <span className="sr-only"> {option.label}</span>
          </a>
        );
      })}
    </span>
  );
}
