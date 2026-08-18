import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Snippet } from "./types";

type SnippetsStore = {
  snippets: Snippet[];
  addSnippet: (snippet: Snippet) => void;
  updateSnippet: (id: string, updatedSnippet: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

const updateById = (
  snippets: Snippet[],
  id: string,
  update: (snippet: Snippet) => Snippet,
): Snippet[] =>
  snippets.map((snippet) => (snippet.id === id ? update(snippet) : snippet));

export const useSnippetsStore = create<SnippetsStore>()(
  persist(
    (set) => ({
      snippets: [],

      addSnippet: (snippet) =>
        set((state) => ({
          snippets: [...state.snippets, snippet],
        })),

      updateSnippet: (id, updatedSnippet) =>
        set((state) => ({
          snippets: updateById(state.snippets, id, (snippet) => ({
            ...snippet,
            ...updatedSnippet,
            updatedAt: new Date().toISOString(),
          })),
        })),

      deleteSnippet: (id) =>
        set((state) => ({
          snippets: state.snippets.filter((snippet) => snippet.id !== id),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          snippets: updateById(state.snippets, id, (snippet) => ({
            ...snippet,
            favorite: !snippet.favorite,
          })),
        })),
    }),
    {
      name: "snippets-storage",
    },
  ),
);
