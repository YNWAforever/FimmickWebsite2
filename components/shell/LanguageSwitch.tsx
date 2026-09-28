"use client";

import { usePathname, useRouter } from "next/navigation";
import { safeQueryForLocaleSwitch } from "@/lib/safe-query";

export type LanguageOption = { code: "en" | "zh-hant" | "zh-hans"; label: string; short: string; lang: string; current: boolean };

/** Swap the locale segment, keep the equivalent page, carry only safe context. */
function targetPath(pathname: string, code: LanguageOption["code"]) {
  const rest = pathname.replace(/^\/(en|zh-hant|zh-hans)(?=\/|$)/, "") || "";
  return `/${code}${rest}`;
}

export function LanguageSwitch({ options, label }: { options: LanguageOption[]; label: string }) {
  const pathname = usePathname() || "/en";
  const router = useRouter();
  return (
    <span className="lang-switch" role="group" aria-label={label}>
      {options.map((option) =>
        option.current ? (
          <span key={option.code} aria-current="true" lang={option.lang} title={option.label}>
            {option.short}
            <span className="sr-only"> {option.label}</span>
          </span>
        ) : (
          <a
            key={option.code}
            href={targetPath(pathname, option.code)}
            hrefLang={option.lang}
            lang={option.lang}
            title={option.label}
            onClick={(event) => {
              const query = safeQueryForLocaleSwitch(window.location.search);
              if (query) {
                event.preventDefault();
                router.push(`${targetPath(pathname, option.code)}${query}${window.location.hash}`);
              }
            }}
          >
            {option.short}
            <span className="sr-only"> {option.label}</span>
          </a>
        ),
      )}
    </span>
  );
}
