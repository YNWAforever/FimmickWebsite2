"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & { href: string };

/**
 * A link that prefetches its page on intent — the pointer arriving over it (a touch included) or
 * keyboard focus — instead of when it scrolls into view (award pass 2, 8.2.2). For navigation and
 * dense link lists, where on-sight prefetching fetched dozens of pages nobody opened.
 */
export function HoverPrefetchLink({ href, onPointerEnter, onFocus, ...rest }: Props) {
  const router = useRouter();
  return (
    <Link
      {...rest}
      href={href}
      prefetch={false}
      onPointerEnter={(e) => {
        router.prefetch(href);
        onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        router.prefetch(href);
        onFocus?.(e);
      }}
    />
  );
}
