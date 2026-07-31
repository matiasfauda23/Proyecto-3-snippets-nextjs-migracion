"use client";

import { useEffect, useRef, useState } from "react";
import { useMounted } from "@/hooks/useMounted";
import { useFilteredSnippets } from "../hooks/useFilteredSnippets";
import { useSnippetsStore } from "../store/store";
import type { Snippet } from "../store/types";
import { copyToClipboard } from "../utils";
import { SearchBar } from "./SearchBar";
import { SnippetCodeDisplay } from "./SnippetCodeDisplay";
import { SnippetFilters } from "./SnippetFilters";
import { SnippetForm } from "./SnippetForm";

const COPY_FEEDBACK_DURATION_MS = 2000;

export function SnippetList() {
  const mounted = useMounted();

  const deleteSnippet = useSnippetsStore((state) => state.deleteSnippet);
  const toggleFavorite = useSnippetsStore((state) => state.toggleFavorite);

  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    filtered,
    filters,
    availableLanguages,
    availableTags,
    setLanguage,
    setTag,
    toggleOnlyFavorites,
    setQuery,
    resetFilters,
  } = useFilteredSnippets();

  const hasActiveFilters = Boolean(
    filters.query || filters.language || filters.tag || filters.onlyFavorites,
  );

  async function handleCopy(snippet: Snippet) {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    const success = await copyToClipboard(snippet.code);

    if (!success) {
      return;
    }

    setCopiedSnippetId(snippet.id);

    timeoutRef.current = setTimeout(() => {
      setCopiedSnippetId((currentId) => (currentId === snippet.id ? null : currentId));
    }, COPY_FEEDBACK_DURATION_MS);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!mounted) {
    return (
      <section className="snippets-section">
        <h2>Snippets guardados</h2>
        <p>Cargando snippets…</p>
      </section>
    );
  }

  return (
    <section className="snippets-section">
      <h2>Snippets guardados</h2>

      <SearchBar query={filters.query} onQueryChange={setQuery} />

      <SnippetFilters
        filters={filters}
        availableLanguages={availableLanguages}
        availableTags={availableTags}
        onLanguageChange={setLanguage}
        onTagChange={setTag}
        onToggleFavorites={toggleOnlyFavorites}
        onReset={resetFilters}
      />

      {filtered.length === 0 ? (
        <p>
          {hasActiveFilters
            ? "No hay snippets que coincidan con la búsqueda."
            : "Todavía no hay snippets guardados."}
        </p>
      ) : (
        <ul className="snippets-list">
          {filtered.map((snippet) => {
            const isEditing = snippet.id === editingSnippetId;
            return (
              <li className="snippet-card" key={snippet.id}>
                <article>
                  {isEditing ? (
                    <>
                      <h3>Editando: {snippet.title}</h3>
                      <SnippetForm
                        key={snippet.id}
                        snippetToEdit={snippet}
                        onFinishEditingAction={() => setEditingSnippetId(null)}
                      />
                      <button
                        type="button"
                        onClick={() => setEditingSnippetId(null)}
                      >
                        Cancelar edición
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="snippet-card-header">
                        <h3>{snippet.title}</h3>
                        <p>{snippet.favorite ? "Favorito" : "No favorito"}</p>
                      </div>
                      <p>{snippet.description}</p>
                      <p>Lenguaje: {snippet.language}</p>
                      <SnippetCodeDisplay
                        code={snippet.code}
                        language={snippet.language}
                      />
                      {snippet.tags.length > 0 && (
                        <p>Etiquetas: {snippet.tags.join(", ")}</p>
                      )}
                      <div className="snippet-actions">
                        <button
                          type="button"
                          onClick={() => handleCopy(snippet)}
                          className={
                            copiedSnippetId === snippet.id ? "copied" : ""
                          }
                        >
                          {copiedSnippetId === snippet.id
                            ? "¡Copiado!"
                            : "Copiar"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingSnippetId(snippet.id)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(snippet.id)}
                        >
                          {snippet.favorite
                            ? "Quitar favorito"
                            : "Marcar favorito"}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSnippet(snippet.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
