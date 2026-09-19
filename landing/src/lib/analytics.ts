"use client";

import { sendGAEvent } from "@next/third-parties/google";

export type NpmClickSource = "navbar" | "hero" | "footer";

export function trackNpmClick(source: NpmClickSource) {
  sendGAEvent("event", "click_npm", { link_source: source });
}
