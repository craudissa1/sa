"use client";

import { useState, useMemo, useEffect } from "react"; // Adicionado useEffect
import { useAutoconhecimentoStore, NotaAutoconhecimento } from "@/app/stores/autoconhecimentoStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/Card"; // Assumindo que Card.tsx exporta estes
import { Badge } from "@/app/components/ui/Badge";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { Search, Edit, Trash2, Image as ImageIcon, Loader2, PlusCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

type ListaNotasProps = {
  secaoAtual: "quem-sou" | "meus-porques" | "meus-padroes";
  onSelectNota: (id: string) => void;
  onAddNewNota: () => void; // Para abrir o editor para uma nova nota
};

export function ListaNotas({ secaoAtual, onSelectNota, onAddNewNota }: ListaNotasProps) {
  const { user } = useAuth();
  const { notas, removerNota, modoRefugio, fetchNotasAutoconhecimento } = useAutoconhecimentoStore();
  const [termoBusca, setTermoBusca] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && notas.length === 0) {
        setLoading(true);
        fetchNotasAutoconhecimento(user.id).finally(() => setLoading(false));
    }
  }, [user, notas, fetchNotasAutoconhecimento]);

  const notasSecao = useMemo(() => {
    const notasDaSecao = notas.filter((nota) => nota.secao === secaoAtual);
    if (!termoBusca.trim()) {
      return notasDaSecao.sort((a, b) => new Date(b.updated_at || b.created_at!).getTime() - new Date(a.updated_at || a.created_at!).getTime());
    }
    const termoLower = termoBusca.toLowerCase();
    return notasDaSecao
      .filter(
        (nota) =>
          nota.titulo.toLowerCase().includes(termoLower) ||
          nota.conteudo.toLowerCase().includes(termoLower) ||
          (nota.tags && nota.tags.some((tag) => tag.toLowerCase().includes(termoLower)))
      )
      .sort((a, b) => new Date(b.updated_at || b.created_at!).getTime() - new Date(a.updated_at || a.created_at!).getTime());
  }, [notas, secaoAtual, termoBusca]);

  const handleRemoverNota = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja excluir esta nota?")) {
      setLoading(true);
      try {
        await removerNota(id);
      } catch (error) {
        console.error("Erro ao remover nota:", error);
        // Adicionar feedback ao usuário
      }
      setLoading(false);
    }
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return "Data desconhecida";
    try {
        const data = new Date(dataString);
        return data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    } catch (e) {
        return "Data inválida";
    }
  };

  const interfaceSimplificada = modoRefugio;

  if (!user) {
    return <p className="text-center text-muted-foreground py-4">Faça login para ver suas notas.</p>;
  }
  
  if (loading && notas.length === 0) {
      return <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin" size={32}/></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Buscar notas..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="pl-10"
            aria-label="Buscar notas"
          />
        </div>
        <Button onClick={onAddNewNota} className="flex-shrink-0">
            <PlusCircle size={18} className="mr-2"/>
            Nova Nota
        </Button>
      </div>

      {notasSecao.length === 0 ? (
        <p className="text-center text-muted-foreground py-6">
          {termoBusca
            ? "Nenhuma nota encontrada para esta busca."
            : "Nenhuma nota registrada nesta seção ainda. Que tal criar uma?"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notasSecao.map((nota) => (
            <Card
              key={nota.id}
              className={`flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow duration-200 ${interfaceSimplificada ? "opacity-90 border-primary/50" : ""}`}
              onClick={() => onSelectNota(nota.id!)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{nota.titulo}</CardTitle>
                <CardDescription className="text-xs">
                  Atualizado em {formatarData(nota.updated_at || nota.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pb-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {nota.conteudo}
                </p>
                {!interfaceSimplificada && nota.tags && nota.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {nota.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {nota.tags.length > 3 && <Badge variant="outline" className="text-xs">+{nota.tags.length - 3}</Badge>}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-3 border-t">
                <div className="flex items-center text-xs text-muted-foreground">
                    {nota.imagemUrl && (
                        <ImageIcon size={14} className="mr-1.5 text-primary/70" />
                    )}
                </div>
                <div className="flex space-x-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectNota(nota.id!);
                        }}
                        aria-label="Editar nota"
                        >
                        <Edit size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleRemoverNota(nota.id!, e)}
                        aria-label="Excluir nota"
                        >
                        <Trash2 size={16} />
                    </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

