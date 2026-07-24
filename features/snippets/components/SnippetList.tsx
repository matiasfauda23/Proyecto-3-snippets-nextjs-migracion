"use client";

import { useState } from "react";

type Snippet = {
  id: string;
  title: string;
  code: string;
};

export function SnippetList() {
  // TODO: migrar acá la lógica de listado/edición/eliminación
  const [snippets] = useState<Snippet[]>([]);

  if (snippets.length === 0) {
    return <p>No hay snippets todavía.</p>;
  }

  return (
    <ul>
      {snippets.map((snippet) => (
        <li key={snippet.id}>{snippet.title}</li>
      ))}
    </ul>
  );
}
