import { create } from "zustand";
import { persist } from "zustand/middleware";

export const COMPARE_MAX = 3;

type CompareState = {
  items: string[];
  add: (id: string) => boolean;
  remove: (id: string) => void;
  toggle: (id: string) => boolean;
  clear: () => void;
  has: (id: string) => boolean;
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (id) => {
        const { items } = get();
        if (items.includes(id)) return true;
        if (items.length >= COMPARE_MAX) return false;
        set({ items: [...items, id] });
        return true;
      },
      remove: (id) => set({ items: get().items.filter((x) => x !== id) }),
      toggle: (id) => {
        const { items } = get();
        if (items.includes(id)) {
          set({ items: items.filter((x) => x !== id) });
          return true;
        }
        if (items.length >= COMPARE_MAX) return false;
        set({ items: [...items, id] });
        return true;
      },
      clear: () => set({ items: [] }),
      has: (id) => get().items.includes(id),
    }),
    { name: "compare_v1" },
  ),
);
