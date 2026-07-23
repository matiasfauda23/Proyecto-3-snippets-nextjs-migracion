"use client";

import { useState, type FormEvent } from "react";

export function SnippetForm() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: migrar acá la lógica de creación del proyecto Vite
    console.log({ title, code });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
      />
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Código"
      />
      <button type="submit">Guardar</button>
    </form>
  );
}
