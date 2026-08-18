"use client";

import type { ChangeEvent } from "react";
import type { Filters } from "../hooks/useFilteredSnippets";

type SnippetFiltersProps = {
  filters: Filters;
  availableLanguages: string[];
  availableTags: string[];
  onLanguageChange: (language: string) => void;
  onTagChange: (tag: string) => void;
  onToggleFavorites: () => void;
  onReset: () => void;
};

export function SnippetFilters({
  filters,
  availableLanguages,
  availableTags,
  onLanguageChange,
  onTagChange,
  onToggleFavorites,
  onReset,
}: SnippetFiltersProps) {
  function handleLanguageChange(event: ChangeEvent<HTMLSelectElement>) {
    onLanguageChange(event.target.value);
  }

  function handleTagChange(event: ChangeEvent<HTMLSelectElement>) {
    onTagChange(event.target.value);
  }

  return (
    <div className="snippet-filters">
      <select
        value={filters.language}
        onChange={handleLanguageChange}
        aria-label="Filtrar por lenguaje"
      >
        <option value="">Todos los lenguajes</option>
        {availableLanguages.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>

      <select
        value={filters.tag}
        onChange={handleTagChange}
        aria-label="Filtrar por etiqueta"
      >
        <option value="">Todas las etiquetas</option>
        {availableTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <label>
        <input
          type="checkbox"
          checked={filters.onlyFavorites}
          onChange={onToggleFavorites}
        />
        Solo favoritos
      </label>

      <button type="button" onClick={onReset}>
        Limpiar filtros
      </button>
    </div>
  );
}
