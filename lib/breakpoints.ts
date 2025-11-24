export function getBreakpoint(name: string): string {
  if (typeof window === "undefined") return ""; // SSR safe fallback

  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--breakpoint-${name}`)
    .trim();
}
