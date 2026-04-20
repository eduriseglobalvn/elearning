export function isTauriRuntime() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean("__TAURI_INTERNALS__" in window || "__TAURI__" in window);
}

export function shouldUseHashRouter() {
  if (typeof window === "undefined") {
    return false;
  }

  const protocol = window.location.protocol;
  return isTauriRuntime() || protocol === "tauri:" || protocol === "file:";
}

export function getApiBase() {
  return import.meta.env.VITE_API_BASE ?? "http://localhost:8080/api/v1";
}

declare global {
  interface Window {
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: unknown;
  }
}
