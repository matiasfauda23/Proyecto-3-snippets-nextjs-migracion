import { SnippetForm } from "@/components/SnippetForm";
import { SnippetList } from "@/components/SnippetList";

export default function SnippetsPage() {
  return (
    <main>
      <h1>Biblioteca de Snippets</h1>
      <p>Acá vamos a crear, listar, editar y eliminar snippets.</p>

      <section>
        <h2>Crear snippet</h2>
        <SnippetForm />
      </section>

      <SnippetList />
    </main>
  );
}
