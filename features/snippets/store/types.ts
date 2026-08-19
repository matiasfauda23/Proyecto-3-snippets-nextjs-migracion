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

// como se describe el estado de los filtros del listado
export type FilterState = {
  query: string;
  language: string;
  tag: string;
  onlyFavorites: boolean;
};
