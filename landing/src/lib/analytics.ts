"use client";

import { sendGAEvent } from "@next/third-parties/google";

export type NpmClickSource = "navbar" | "hero" | "footer";
export type GitHubClickSource = "navbar" | "footer" | "hero";

export function trackNpmClick(source: NpmClickSource) {
  sendGAEvent("event", "click_npm", { link_source: source });
}

export function trackGitHubClick(source: GitHubClickSource) {
  sendGAEvent("event", "click_github", { link_source: source });
}
