"use client";

import { useMemo, useState } from "react";
import { useSnippetsStore } from "../store/store";

export type Filters = {
  query: string;
  language: string;
  tag: string;
  onlyFavorites: boolean;
};

export function useFilteredSnippets() {
  const snippets = useSnippetsStore((state) => state.snippets);

  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [tag, setTag] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filters: Filters = { query, language, tag, onlyFavorites };

  const availableLanguages = useMemo(
    () =>
      [
        ...new Set(snippets.map((snippet) => snippet.language).filter(Boolean)),
      ].sort((a, b) => a.localeCompare(b, "es")),
    [snippets],
  );

  const availableTags = useMemo(
    () =>
      [
        ...new Set(snippets.flatMap((snippet) => snippet.tags).filter(Boolean)),
      ].sort((a, b) => a.localeCompare(b, "es")),
    [snippets],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return snippets.filter((snippet) => {
      if (onlyFavorites && !snippet.favorite) return false;
      if (language && snippet.language !== language) return false;
      if (tag && !snippet.tags.includes(tag)) return false;

      if (normalizedQuery) {
        const haystack =
          `${snippet.title} ${snippet.description} ${snippet.code}`.toLowerCase();
        const matchesText = haystack.includes(normalizedQuery);
        const matchesTags = snippet.tags.some((snippetTag) =>
          snippetTag.toLowerCase().includes(normalizedQuery),
        );

        if (!matchesText && !matchesTags) return false;
      }

      return true;
    });
  }, [snippets, query, language, tag, onlyFavorites]);

  function toggleOnlyFavorites() {
    setOnlyFavorites((prev) => !prev);
  }

  function resetFilters() {
    setQuery("");
    setLanguage("");
    setTag("");
    setOnlyFavorites(false);
  }

  return {
    filtered,
    filters,
    availableLanguages,
    availableTags,
    setLanguage,
    setTag,
    toggleOnlyFavorites,
    setQuery,
    resetFilters,
  };
}
