type SnippetCodeDisplayProps = {
  code: string;
  language: string;
};

export function SnippetCodeDisplay({ code, language }: SnippetCodeDisplayProps) {
  return (
    <pre>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
