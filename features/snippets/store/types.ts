export type Snippet = {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SnippetFormData = {
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string;
};
