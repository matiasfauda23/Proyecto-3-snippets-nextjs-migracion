"use client";

import { useState, type ChangeEvent, type SubmitEvent } from "react";

export function SnippetForm() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: migrar acá la lógica de creación del proyecto Vite
    console.log({ title, code });
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleCodeChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setCode(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={handleTitleChange}
        placeholder="Título"
      />
      <textarea
        value={code}
        onChange={handleCodeChange}
        placeholder="Código"
      />
      <button type="submit">Guardar</button>
    </form>
  );
}
