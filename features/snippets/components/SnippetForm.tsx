"use client";

import { useState, type SubmitEvent } from "react";
import { useSnippetsStore } from "../store/store";
import type { Snippet, SnippetFormData } from "../store/types";
import {
  createSnippetFromForm,
  updateSnippetFromForm,
  validateSnippetForm,
} from "../utils";

type SnippetFormProps = {
  snippetToEdit?: Snippet;
  onFinishEditingAction?: () => void;
};

const initialFormData: SnippetFormData = {
  title: "",
  description: "",
  language: "",
  code: "",
  tags: "",
};

function getInitialFormData(snippet?: Snippet): SnippetFormData {
  if (!snippet) {
    return initialFormData;
  }

  return {
    title: snippet.title,
    description: snippet.description,
    language: snippet.language,
    code: snippet.code,
    tags: snippet.tags.join(", "),
  };
}

export function SnippetForm({
  snippetToEdit,
  onFinishEditingAction,
}: SnippetFormProps) {
  const addSnippet = useSnippetsStore((state) => state.addSnippet);
  const updateSnippet = useSnippetsStore((state) => state.updateSnippet);

  const [formData, setFormData] = useState<SnippetFormData>(
    getInitialFormData(snippetToEdit),
  );
  const [error, setError] = useState<string | null>(null);

  const isEditing = snippetToEdit !== undefined;

  function updateField(field: keyof SnippetFormData, value: string) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateSnippetForm(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    if (snippetToEdit) {
      updateSnippet(
        snippetToEdit.id,
        updateSnippetFromForm(snippetToEdit, formData),
      );
      onFinishEditingAction?.();
      return;
    }

    addSnippet(createSnippetFromForm(formData));
    setFormData(initialFormData);
  }

  return (
    <form className="snippet-form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span>Título</span>
        <input
          type="text"
          required
          placeholder="Ej: Hook para manejar formularios"
          value={formData.title}
          onChange={(event) => updateField("title", event.target.value)}
        />
      </label>

      <label className="form-field">
        <span>Lenguaje</span>
        <input
          type="text"
          required
          placeholder="Ej: TypeScript"
          value={formData.language}
          onChange={(event) => updateField("language", event.target.value)}
        />
      </label>

      <label className="form-field">
        <span>Descripción</span>
        <textarea
          placeholder="Explicá brevemente para qué sirve este snippet"
          value={formData.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
      </label>

      <label className="form-field">
        <span>Código</span>
        <textarea
          required
          placeholder="Pegá acá el código del snippet"
          value={formData.code}
          onChange={(event) => updateField("code", event.target.value)}
        />
      </label>

      <label className="form-field">
        <span>Etiquetas separadas por coma</span>
        <input
          type="text"
          placeholder="Ej: react, hooks, formularios"
          value={formData.tags}
          onChange={(event) => updateField("tags", event.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit">
        {isEditing ? "Guardar cambios" : "Guardar snippet"}
      </button>
    </form>
  );
}
