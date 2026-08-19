import type { Snippet, SnippetFormData } from "./store/types";

export function normalizeTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function createSnippetFromForm(data: SnippetFormData): Snippet {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: data.title.trim(),
    description: data.description.trim(),
    language: data.language.trim(),
    code: data.code.trim(),
    tags: normalizeTags(data.tags),
    favorite: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateSnippetFromForm(
  snippet: Snippet,
  data: SnippetFormData,
): Snippet {
  return {
    ...snippet,
    title: data.title.trim(),
    description: data.description.trim(),
    language: data.language.trim(),
    code: data.code.trim(),
    tags: normalizeTags(data.tags),
    updatedAt: new Date().toISOString(),
  };
}

export function validateSnippetForm(data: SnippetFormData): string | null {
  if (!data.title.trim()) {
    return "El título es obligatorio.";
  }

  if (!data.language.trim()) {
    return "El lenguaje es obligatorio.";
  }

  if (!data.code.trim()) {
    return "El código es obligatorio.";
  }

  return null;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
