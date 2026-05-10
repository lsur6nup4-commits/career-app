import { create } from "zustand";
import { persist } from "zustand/middleware";

type BookmarkState = {
  bookmarks: string[];
  notes: Record<string, string>;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  setNote: (id: string, content: string) => void;
  removeNote: (id: string) => void;
  removeBookmark: (id: string) => void;
};

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      notes: {},
      toggle: (id) => {
        const { bookmarks } = get();
        if (bookmarks.includes(id)) {
          set({ bookmarks: bookmarks.filter((x) => x !== id) });
        } else {
          set({ bookmarks: [...bookmarks, id] });
        }
      },
      has: (id) => get().bookmarks.includes(id),
      setNote: (id, content) =>
        set({ notes: { ...get().notes, [id]: content } }),
      removeNote: (id) => {
        const { notes } = get();
        const next = { ...notes };
        delete next[id];
        set({ notes: next });
      },
      removeBookmark: (id) => {
        set({ bookmarks: get().bookmarks.filter((x) => x !== id) });
      },
    }),
    { name: "bookmarks_v1" },
  ),
);
