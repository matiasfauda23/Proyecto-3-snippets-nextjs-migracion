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
    <div className="search-bar">
      <label htmlFor="snippet-search" className="search-bar__label">
        Buscar snippets
      </label>
      <div className="search-bar__input-wrapper">
        <input
          id="snippet-search"
          type="search"
          className="search-bar__input"
          placeholder="Buscar por título, descripción, código o etiqueta..."
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={() => onQueryChange("")}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
