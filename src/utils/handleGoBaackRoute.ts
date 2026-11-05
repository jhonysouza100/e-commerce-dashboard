import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function handleGoBackRoute(router: AppRouterInstance, fallback = "/") {
  if (typeof window !== "undefined") {
    const returnTo = new URLSearchParams(window.location.search).get("returnTo");
    if (returnTo?.startsWith("/")) {
      router.replace(returnTo);
      return;
    }

    router.replace(fallback);
  }
}