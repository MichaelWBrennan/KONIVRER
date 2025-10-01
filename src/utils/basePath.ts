function ensureTrailingSlash(input: string): string {
  if (!input) return "/";
  return input.endsWith("/") ? input : input + "/";
}

export function getBasePath(): string {
  try {
    const fromEnv = (import.meta as any)?.env?.BASE_URL as string | undefined;
    if (typeof fromEnv === "string" && fromEnv.length > 0) {
      return ensureTrailingSlash(fromEnv);
    }
  } catch {}

  try {
    const manifest = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
    if (manifest?.href) {
      const url = new URL(manifest.href, window.location.href);
      const path = url.pathname.replace(/manifest\.json$/, "");
      if (path) return ensureTrailingSlash(path);
    }
  } catch {}

  try {
    const controller = (navigator as any)?.serviceWorker?.controller;
    const scriptUrl: string | undefined = controller?.scriptURL ?? controller?.scriptUrl;
    if (scriptUrl) {
      const url = new URL(scriptUrl);
      const path = url.pathname.replace(/sw\.js$/, "");
      if (path) return ensureTrailingSlash(path);
    }
  } catch {}

  return "/";
}

export function withBase(path: string): string {
  const base = getBasePath();
  const trimmed = (path || "").replace(/^\/+/, "");
  return base + trimmed;
}

