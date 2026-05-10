"use client";

import { useEffect, useState } from "react";

/**
 * Returns true after the first client render.
 * Use to gate rendering of values that come from persisted client stores
 * (zustand-persist, localStorage, etc.) so that the SSR/CSR HTML matches.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
