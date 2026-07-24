"use client";

import type { ChangeEvent } from "react";

type SearchBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onQueryChange(event.target.value);
  }

  return (
    <input
      type="search"
      value={query}
      onChange={handleChange}
      placeholder="Buscar snippets…"
      aria-label="Buscar snippets"
    />
  );
}
