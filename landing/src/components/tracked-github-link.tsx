"use client";

import type { ComponentProps } from "react";
import { trackGitHubClick, type GitHubClickSource } from "@/lib/analytics";

export const GITHUB_REPO_URL = "https://github.com/Aitaouss/StackForge";

type TrackedGitHubLinkProps = Omit<ComponentProps<"a">, "href"> & {
  source: GitHubClickSource;
  href?: string;
};

export function TrackedGitHubLink({
  source,
  href = GITHUB_REPO_URL,
  onClick,
  ...props
}: TrackedGitHubLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        trackGitHubClick(source);
        onClick?.(event);
      }}
      {...props}
    />
  );
}
