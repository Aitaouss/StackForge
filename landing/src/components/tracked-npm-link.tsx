"use client";

import type { ComponentProps } from "react";
import { trackNpmClick, type NpmClickSource } from "@/lib/analytics";

export const NPM_PACKAGE_URL = "https://www.npmjs.com/package/create-stackforge-app";

type TrackedNpmLinkProps = Omit<ComponentProps<"a">, "href"> & {
  source: NpmClickSource;
  href?: string;
};

export function TrackedNpmLink({
  source,
  href = NPM_PACKAGE_URL,
  onClick,
  ...props
}: TrackedNpmLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        trackNpmClick(source);
        onClick?.(event);
      }}
      {...props}
    />
  );
}
