"use client";

import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useSnippetsStore } from "../store/store";
import type { Snippet } from "../store/types";

type SnippetFormProps = {
  snippetToEdit?: Snippet;
  onFinishEditing?: () => void;
};

export function SnippetForm({ snippetToEdit, onFinishEditing }: SnippetFormProps) {
  const addSnippet = useSnippetsStore((state) => state.addSnippet);
  const updateSnippet = useSnippetsStore((state) => state.updateSnippet);

  const [title, setTitle] = useState(snippetToEdit?.title ?? "");
  const [description, setDescription] = useState(snippetToEdit?.description ?? "");
  const [language, setLanguage] = useState(snippetToEdit?.language ?? "");
  const [code, setCode] = useState(snippetToEdit?.code ?? "");
  const [tags, setTags] = useState(snippetToEdit?.tags.join(", ") ?? "");

  const isEditing = snippetToEdit !== undefined;

  function resetForm() {
    setTitle("");
    setDescription("");
    setLanguage("");
    setCode("");
    setTags("");
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (isEditing) {
      updateSnippet(snippetToEdit.id, {
        title,
        description,
        language,
        code,
        tags: parsedTags,
      });
      onFinishEditing?.();
      return;
    }

    const now = new Date().toISOString();

    addSnippet({
      id: crypto.randomUUID(),
      title,
      description,
      language,
      code,
      tags: parsedTags,
      favorite: false,
      createdAt: now,
      updatedAt: now,
    });

    resetForm();
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>) {
    setDescription(event.target.value);
  }

  function handleLanguageChange(event: ChangeEvent<HTMLInputElement>) {
    setLanguage(event.target.value);
  }

  function handleCodeChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setCode(event.target.value);
  }

  function handleTagsChange(event: ChangeEvent<HTMLInputElement>) {
    setTags(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={handleTitleChange}
        placeholder="Título"
      />
      <input
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Descripción"
      />
      <input
        value={language}
        onChange={handleLanguageChange}
        placeholder="Lenguaje (ej: ts, js, python)"
      />
      <textarea
        value={code}
        onChange={handleCodeChange}
        placeholder="Código"
      />
      <input
        value={tags}
        onChange={handleTagsChange}
        placeholder="Etiquetas (separadas por coma)"
      />
      <button type="submit">
        {isEditing ? "Guardar cambios" : "Guardar"}
      </button>
    </form>
  );
}
