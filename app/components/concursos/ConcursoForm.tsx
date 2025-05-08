"use client";

import React, { useState, useEffect } from "react"; // Adicionado useEffect
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Modal } from "@/app/components/ui/Modal";
import { Plus, X, Loader2 } from "lucide-react"; // Adicionado Loader2
import { useConcursosStore, type Concurso, type ConteudoProgramatico } from "@/app/stores/concursosStore";
import { useAuth } from "@/app/context/AuthContext";

interface ConcursoFormProps {
  isOpen: boolean;
  onClose: () => void;
  concursoParaEditar?: Concurso | null; // Permitir null para resetar
}

export function ConcursoForm({ isOpen, onClose, concursoParaEditar }: ConcursoFormProps) {
  const { user } = useAuth();
  const { adicionarConcurso, atualizarConcurso, fetchConcursos } = useConcursosStore();
  
  const initialState = {
    titulo: "",
    organizadora: "",
    dataInscricao: "",
    dataProva: "",
    edital: "", // Inicializado como string vazia
    status: "planejado" as Concurso["status"],
    conteudoProgramatico: [] as ConteudoProgramatico[],
    user_id: user?.id || undefined
  };

  const [formData, setFormData] = useState<Omit<Concurso, "id" | "created_at" | "updated_at">>(initialState);
  const [novaDisciplina, setNovaDisciplina] = useState("");
  const [novoTopico, setNovoTopico] = useState("");
  const [disciplinaSelecionadaParaTopico, setDisciplinaSelecionadaParaTopico] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingExtracao, setLoadingExtracao] = useState(false);
  const [extracaoErro, setExtracaoErro] = useState<string | null>(null);
  const [extracaoSucesso, setExtracaoSucesso] = useState<string | null>(null);

  useEffect(() => {
    if (concursoParaEditar) {
      setFormData({
        titulo: concursoParaEditar.titulo || "",
        organizadora: concursoParaEditar.organizadora || "",
        dataInscricao: concursoParaEditar.dataInscricao?.split("T")[0] || "", 
        dataProva: concursoParaEditar.dataProva?.split("T")[0] || "", 
        edital: concursoParaEditar.edital || "", // Garante que seja string
        status: concursoParaEditar.status || "planejado",
        conteudoProgramatico: concursoParaEditar.conteudoProgramatico || [],
        user_id: concursoParaEditar.user_id || user?.id
      });
    } else {
      setFormData({...initialState, user_id: user?.id});
    }
  }, [concursoParaEditar, user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        alert("Você precisa estar logado para realizar esta ação.");
        return;
    }
    setLoading(true);
    try {
      const dadosParaSalvar = { ...formData, user_id: user.id }; 
      if (concursoParaEditar && concursoParaEditar.id) {
        await atualizarConcurso(concursoParaEditar.id, dadosParaSalvar);
      } else {
        await adicionarConcurso(dadosParaSalvar);
      }
      await fetchConcursos(user.id); 
      onClose();
    } catch (error) {
      console.error("Erro ao salvar concurso:", error);
      alert("Ocorreu um erro ao salvar o concurso. Tente novamente.");
    }
    setLoading(false);
  };

  const adicionarDisciplinaLocal = () => {
    if (!novaDisciplina.trim()) return;
    setFormData((prev) => ({
      ...prev,
      conteudoProgramatico: [
        ...(prev.conteudoProgramatico || []),
        {
          disciplina: novaDisciplina,
          topicos: [],
          progresso: 0,
        },
      ],
    }));
    setNovaDisciplina("");
  };

  const adicionarTopicoLocal = () => {
    if (!novoTopico.trim() || !disciplinaSelecionadaParaTopico) return;
    setFormData((prev) => ({
      ...prev,
      conteudoProgramatico: (prev.conteudoProgramatico || []).map((d) =>
        d.disciplina === disciplinaSelecionadaParaTopico
          ? { ...d, topicos: [...(d.topicos || []), novoTopico] }
          : d
      ),
    }));
    setNovoTopico("");
  };

  const removerDisciplinaLocal = (disciplinaARemover: string) => {
    setFormData((prev) => ({
      ...prev,
      conteudoProgramatico: (prev.conteudoProgramatico || []).filter(
        (d) => d.disciplina !== disciplinaARemover
      ),
    }));
  };

  const removerTopicoLocal = (disciplinaDaQualRemover: string, topicoARemover: string) => {
    setFormData((prev) => ({
      ...prev,
      conteudoProgramatico: (prev.conteudoProgramatico || []).map((d) =>
        d.disciplina === disciplinaDaQualRemover
          ? { ...d, topicos: (d.topicos || []).filter((t) => t !== topicoARemover) }
          : d
      ),
    }));
  };
  
  const handleExtrairEdital = async () => {
    if (!formData.edital) return;
    setLoadingExtracao(true);
    setExtracaoErro(null);
    setExtracaoSucesso(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const dadosExtraidosMock = {
        titulo: formData.titulo || "Concurso Extraído (Mock)",
        organizadora: formData.organizadora || "Banca Extraída (Mock)",
        dataInscricao: formData.dataInscricao || "2025-07-01",
        dataProva: formData.dataProva || "2025-09-15",
        conteudoProgramatico: formData.conteudoProgramatico.length > 0 ? formData.conteudoProgramatico : [
          { disciplina: "Conhecimentos Gerais (Extraído)", topicos: ["Atualidades", "Ética"], progresso: 0 },
          { disciplina: "Conhecimentos Específicos (Extraído)", topicos: ["Legislação X", "Técnica Y"], progresso: 0 }
        ]
      };
      setFormData(prev => ({
        ...prev,
        ...dadosExtraidosMock,
        edital: prev.edital || "" // Garante que edital não seja null após extração
      }));
      setExtracaoSucesso("Dados extraídos e preenchidos (simulação)!");
    } catch (err) {
      setExtracaoErro("Erro ao simular extração do edital.");
    } finally {
      setLoadingExtracao(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={concursoParaEditar ? "Editar Concurso" : "Novo Concurso"}
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-3">
        <Input
          label="Título"
          value={formData.titulo}
          onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
          placeholder="Ex: Analista Administrativo - TRT"
          required
          disabled={loading}
        />
        <Input
          label="Organizadora"
          value={formData.organizadora}
          onChange={(e) => setFormData((prev) => ({ ...prev, organizadora: e.target.value }))}
          placeholder="Ex: CESPE, FGV"
          required
          disabled={loading}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Data de Inscrição"
            type="date"
            value={formData.dataInscricao}
            onChange={(e) => setFormData((prev) => ({ ...prev, dataInscricao: e.target.value }))}
            required
            disabled={loading}
          />
          <Input
            label="Data da Prova"
            type="date"
            value={formData.dataProva}
            onChange={(e) => setFormData((prev) => ({ ...prev, dataProva: e.target.value }))}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Link do Edital (opcional)</label>
          <div className="flex gap-2 items-start">
            <Input
              type="url"
              value={formData.edital || ""} // Garante que o valor nunca seja null
              onChange={(e) => setFormData((prev) => ({ ...prev, edital: e.target.value }))}
              placeholder="https://..."
              className="flex-grow"
              disabled={loading || loadingExtracao}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleExtrairEdital}
              disabled={!formData.edital || loadingExtracao || loading}
              className="whitespace-nowrap h-10 mt-0"
            >
              {loadingExtracao ? <Loader2 className="animate-spin mr-2"/> : null}
              {loadingExtracao ? "Extraindo..." : "Extrair Dados (Simulado)"}
            </Button>
          </div>
          {extracaoErro && <p className="text-xs text-red-600 mt-1">{extracaoErro}</p>}
          {extracaoSucesso && <p className="text-xs text-green-600 mt-1">{extracaoSucesso}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as Concurso["status"] }))}
            className="w-full border border-border rounded-md p-2 bg-background text-foreground focus:ring-primary focus:border-primary"
            disabled={loading}
          >
            <option value="planejado">Planejado</option>
            <option value="inscrito">Inscrito</option>
            <option value="estudando">Estudando</option>
            <option value="realizado">Realizado</option>
            <option value="aguardando_resultado">Aguardando Resultado</option>
            <option value="aprovado">Aprovado</option>
            <option value="reprovado">Reprovado</option>
          </select>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2 text-foreground">Conteúdo Programático</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={novaDisciplina}
                onChange={(e) => setNovaDisciplina(e.target.value)}
                placeholder="Nova disciplina..."
                className="flex-grow"
                disabled={loading}
              />
              <Button type="button" onClick={adicionarDisciplinaLocal} disabled={loading || !novaDisciplina.trim()} size="icon" className="flex-shrink-0">
                <Plus size={18} />
              </Button>
            </div>
            {(formData.conteudoProgramatico || []).map((d, i) => (
              <div key={i} className="border border-border rounded-lg p-3 bg-muted/50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-foreground">{d.disciplina}</h4>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removerDisciplinaLocal(d.disciplina)} disabled={loading} className="text-destructive hover:text-destructive/80 h-7 w-7">
                    <X size={16} />
                  </Button>
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={disciplinaSelecionadaParaTopico === d.disciplina ? novoTopico : ""}
                    onChange={(e) => {
                      setDisciplinaSelecionadaParaTopico(d.disciplina);
                      setNovoTopico(e.target.value);
                    }}
                    placeholder="Novo tópico para esta disciplina..."
                    className="text-sm flex-grow"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    onClick={adicionarTopicoLocal}
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0 h-9 w-9 mt-0"
                    disabled={loading || disciplinaSelecionadaParaTopico !== d.disciplina || !novoTopico.trim()}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <ul className="space-y-1 pl-2">
                  {(d.topicos || []).map((topico, j) => (
                    <li key={j} className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>- {topico}</span>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removerTopicoLocal(d.disciplina, topico)} disabled={loading} className="text-destructive hover:text-destructive/80 h-6 w-6">
                        <X size={14} />
                      </Button>
                    </li>
                  ))}
                  {(d.topicos || []).length === 0 && <p className="text-xs text-muted-foreground italic">Nenhum tópico adicionado.</p>}
                </ul>
              </div>
            ))}
            {(formData.conteudoProgramatico || []).length === 0 && <p className="text-sm text-muted-foreground italic">Nenhuma disciplina adicionada.</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || !formData.titulo || !formData.organizadora || !formData.dataInscricao || !formData.dataProva}>
            {loading ? <Loader2 className="animate-spin mr-2"/> : null}
            {concursoParaEditar ? "Salvar Alterações" : "Adicionar Concurso"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

