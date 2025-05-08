"use client";

import { useState, useRef, useEffect } from "react";
import { useAutoconhecimentoStore, NotaAutoconhecimento } from "@/app/stores/autoconhecimentoStore";
import { Button } from "@/app/components/ui/Button";
import { Textarea } from "@/app/components/ui/Textarea";
import { Input } from "@/app/components/ui/Input";
import { Badge } from "@/app/components/ui/Badge";
import { X, Image as ImageIcon, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

type EditorNotasProps = {
  id?: string;
  secaoAtual: "quem-sou" | "meus-porques" | "meus-padroes";
  onSave?: () => void;
  onCancel?: () => void; // Para fechar o editor se for um modal, por exemplo
};

export function EditorNotas({ id, secaoAtual, onSave, onCancel }: EditorNotasProps) {
  const { user } = useAuth();
  const {
    notas,
    adicionarNota,
    atualizarNota,
    modoRefugio,
    fetchNotasAutoconhecimento
  } = useAutoconhecimentoStore();

  const notaExistente = id ? notas.find((n) => n.id === id) : undefined;

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const [mostrarOpcaoImagem, setMostrarOpcaoImagem] = useState(false);
  const [loading, setLoading] = useState(false);

  const tagInputRef = useRef<HTMLInputElement>(null);

  const titulosSecoes = {
    "quem-sou": "Quem sou",
    "meus-porques": "Meus porquês",
    "meus-padroes": "Meus padrões",
  };

  useEffect(() => {
    if (user && notas.length === 0) {
        fetchNotasAutoconhecimento(user.id);
    }
  }, [user, notas, fetchNotasAutoconhecimento]);

  useEffect(() => {
    if (notaExistente) {
      setTitulo(notaExistente.titulo);
      setConteudo(notaExistente.conteudo);
      setTags(notaExistente.tags || []);
      setImagemUrl(notaExistente.imagemUrl || null);
    } else {
      // Reset para nova nota
      setTitulo("");
      setConteudo("");
      setTags([]);
      setImagemUrl(null);
    }
  }, [notaExistente, id]); // Adicionado id para resetar quando o id muda para undefined (nova nota)

  const handleAdicionarTagLocal = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const novaTag = tagInput.trim();
      setTags([...tags, novaTag]);
      setTagInput("");
      tagInputRef.current?.focus();
    }
  };

  const handleRemoverTagLocal = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAdicionarImagemLocal = () => {
    // A imagemUrl já está sendo atualizada pelo input
    // Apenas fechamos a UI de adicionar imagem
    setMostrarOpcaoImagem(false);
  };

  const handleRemoverImagemLocal = () => {
    setImagemUrl(null);
    setMostrarOpcaoImagem(false);
  };

  const handleSalvar = async () => {
    if (!user || !titulo.trim() || !conteudo.trim()) return;
    setLoading(true);

    const notaData: Partial<Omit<NotaAutoconhecimento, "id" | "user_id" | "created_at" | "updated_at">> = {
      titulo,
      conteudo,
      secao: secaoAtual,
      tags,
      imagemUrl: imagemUrl || null,
    };

    try {
      if (id && notaExistente) {
        await atualizarNota(id, notaData);
      } else {
        await adicionarNota(notaData as Omit<NotaAutoconhecimento, "id" | "user_id" | "created_at" | "updated_at">);
      }
      if (onSave) {
        onSave();
      }
      // Resetar campos para nova nota se não for edição ou se onSave não fechar o editor
      if (!id && !onSave) {
        setTitulo("");
        setConteudo("");
        setTags([]);
        setImagemUrl(null);
      }
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      // Adicionar feedback ao usuário aqui
    }
    setLoading(false);
  };

  const interfaceSimplificada = modoRefugio;

  if (!user) {
    return <p className="text-muted-foreground">Faça login para editar suas notas.</p>;
  }
  
  if (id && !notaExistente && notas.length > 0) {
    // Se um ID foi fornecido mas a nota não foi encontrada (e já tentamos buscar)
    return <p className="text-destructive">Nota não encontrada. Pode ter sido removida.</p>;
  }
  if (id && notas.length === 0 && !loading) {
      // Ainda carregando ou não encontrou
      return <div className="flex justify-center items-center p-4"><Loader2 className="animate-spin"/> Carregando nota...</div>
  }

  return (
    <div className={`space-y-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm ${interfaceSimplificada ? "opacity-90" : ""}`}>
      {loading && <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><Loader2 className="animate-spin text-white" size={48}/></div>}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-1">
          {id ? `Editando: ${notaExistente?.titulo || "Nota"}` : `Nova Nota em ${titulosSecoes[secaoAtual]}`}
        </h3>
        {interfaceSimplificada && (
            <p className="text-sm text-muted-foreground">Modo refúgio: interface simplificada.</p>
        )}
      </div>

      <Input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título da nota"
        className={`text-lg font-medium ${interfaceSimplificada ? "border-primary" : ""}`}
        aria-label="Título da nota"
        disabled={loading}
      />

      <Textarea
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        placeholder="O que você quer registrar?"
        className={`min-h-[200px] ${interfaceSimplificada ? "border-primary" : ""}`}
        aria-label="Conteúdo da nota"
        disabled={loading}
      />

      {!interfaceSimplificada && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Tags</label>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoverTagLocal(tag)}
                    className="ml-1.5 rounded-full p-0.5 text-primary/70 hover:text-primary hover:bg-primary/20 disabled:opacity-50"
                    aria-label={`Remover tag ${tag}`}
                    disabled={loading}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdicionarTagLocal();
                  }
                }}
                placeholder="Nova tag"
                className="text-sm flex-grow"
                aria-label="Adicionar nova tag"
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAdicionarTagLocal}
                aria-label="Adicionar tag"
                disabled={loading || !tagInput.trim()}
              >
                Adicionar Tag
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Âncora Visual (URL da Imagem)</label>
            {imagemUrl ? (
              <div className="relative group w-full max-w-md">
                <img
                  src={imagemUrl}
                  alt="Imagem âncora"
                  className="max-h-60 w-full object-contain rounded-md border bg-muted"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleRemoverImagemLocal}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                  aria-label="Remover imagem"
                  disabled={loading}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <>
                {mostrarOpcaoImagem ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={imagemUrl || ""}
                      onChange={(e) => setImagemUrl(e.target.value)}
                      placeholder="https://exemplo.com/imagem.png"
                      className="text-sm flex-1"
                      aria-label="URL da imagem âncora"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={handleAdicionarImagemLocal} // Apenas fecha a UI, o URL já está no estado
                      aria-label="Confirmar URL da imagem"
                      disabled={loading || !imagemUrl?.trim()}
                    >
                      Confirmar URL
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => { setMostrarOpcaoImagem(false); setImagemUrl(notaExistente?.imagemUrl || null); }} // Reseta se cancelar
                      aria-label="Cancelar"
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMostrarOpcaoImagem(true)}
                    className="flex items-center"
                    aria-label="Adicionar imagem âncora"
                    disabled={loading}
                  >
                    <ImageIcon size={16} className="mr-2" />
                    Adicionar Imagem (URL)
                  </Button>
                )}
              </>
            )}
          </div>
        </>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t mt-6">
        {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancelar
            </Button>
        )}
        <Button
          type="button"
          onClick={handleSalvar}
          className={`flex items-center ${interfaceSimplificada ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
          disabled={!titulo.trim() || !conteudo.trim() || loading}
          aria-label="Salvar nota"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={16}/> : <Save size={16} className="mr-2" />}
          {id ? "Salvar Alterações" : "Criar Nota"}
        </Button>
      </div>
    </div>
  );
}

