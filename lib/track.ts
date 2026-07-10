"use client";

import { track } from "@vercel/analytics";

/*
  trackTool — lightweight per-tool event tracking on top of the Vercel
  Analytics already wired into the site (see app/layout.tsx). Lets Meg see
  which free tools actually drive leads (opened → generated → copied/
  downloaded → emailed) in the Vercel Analytics dashboard. Best-effort: a
  blocked/absent analytics script should never break a tool.
*/
export type ToolEvent = "opened" | "generated" | "copied" | "downloaded" | "emailed";

export function trackTool(tool: string, event: ToolEvent) {
  try {
    track(`tool_${event}`, { tool });
  } catch {
    /* analytics best-effort — never block the tool on it */
  }
}
