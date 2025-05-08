"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Alert } from "@/app/components/ui/Alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Loader2, Wand2, UploadCloud, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { useQuestoesStore, type Questao, type AlternativaQuestao } from "@/app/stores/questoesStore";
import { useAuth } from "@/app/context/AuthContext";

interface QuestaoLLM {
  questao: string;
  alternativas: string[];
  correta: string;
  disciplina: string;
  topico: string;
}

interface GeradorQuestoesLLMProps {
  concursoId: string;
}

export function GeradorQuestoesLLM({ concursoId }: GeradorQuestoesLLMProps) {
  const { user } = useAuth();
  const { importarQuestoes: importarQuestoesStore, fetchQuestoes } = useQuestoesStore();

  const [disciplina, setDisciplina] = useState("");
  const [topico, setTopico] = useState("");
  const [quantidade, setQuantidade] = useState(3);
  const [resumo, setResumo] = useState("");
  const [questoesGeradasLLM, setQuestoesGeradasLLM] = useState<QuestaoLLM[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [llmPerformance, setLlmPerformance] = useState<{ duration: number; prompt: string; rawResponse: any } | null>(null);
  const [dificuldade, setDificuldade] = useState<"facil" | "medio" | "dificil">("facil");

  const buscarResumo = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setResumo(`Resumo simulado para ${disciplina} - ${topico}: principais conceitos, legislação e interpretação de textos.`);
      setSuccessMessage("Resumo obtido via MCP (simulado).");
    } catch (err) {
      setError("Erro ao buscar resumo via MCP.");
    } finally {
      setIsLoading(false);
    }
  };

  const gerarQuestoes = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    setQuestoesGeradasLLM([]);
    setLlmPerformance(null);
    const start = performance.now();
    let prompt = "";
    let rawResponse = null;

    try {
      const tokensPorDificuldade = { facil: 2000, medio: 5000, dificil: 8000 };
      let instrucaoDificuldade = "";
      if (dificuldade === "facil") instrucaoDificuldade = "As questões devem ser diretas, sem exigir raciocínio complexo. Use até 2000 tokens.";
      else if (dificuldade === "medio") instrucaoDificuldade = "As questões devem exigir reflexão moderada, com enunciados mais elaborados. Use até 5000 tokens e invista mais recursos computacionais para garantir qualidade e profundidade.";
      else instrucaoDificuldade = "As questões devem ser desafiadoras, exigindo análise crítica e interpretação profunda. Use até 8000 tokens e utilize o máximo de recursos computacionais para garantir questões complexas e bem fundamentadas.";
      
      prompt = `Gere ${quantidade} questões objetivas de múltipla escolha, cada uma com 4 alternativas e apenas uma correta, no formato JSON abaixo. Use apenas o contexto fornecido. Nível de dificuldade: ${dificuldade.toUpperCase()}. ${instrucaoDificuldade}\n\n{\n  "questao": "Enunciado da questão",\n  "alternativas": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],\n  "correta": "Letra da alternativa correta (A, B, C ou D)",\n  "disciplina": "${disciplina}",\n  "topico": "${topico || ""}"\n}\n\nContexto:\n${resumo}`.trim();

      const response = await fetch("/api/gerar-questao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disciplina,
          topico,
          resumo,
          quantidade,
          dificuldade,
          max_tokens: tokensPorDificuldade[dificuldade],
        }),
      });
      rawResponse = await response.clone().json(); 
      if (!response.ok) {
        throw new Error(rawResponse.error || "Erro ao gerar questões.");
      }
      setQuestoesGeradasLLM(rawResponse.questoes || []);
      setSuccessMessage("Questões geradas com sucesso!");
      setLlmPerformance({ duration: performance.now() - start, prompt, rawResponse });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido ao gerar questões.");
      setLlmPerformance(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportarQuestoes = async () => {
    setError(null);
    setSuccessMessage(null);
    if (!user) {
      setError("Usuário não autenticado.");
      return;
    }
    if (!questoesGeradasLLM.length) {
      setError("Nenhuma questão para importar.");
      return;
    }
    setIsLoading(true);
    try {
      const questoesFormatadasParaStore: Array<Omit<Questao, "id" | "user_id" | "created_at" | "updated_at"> & { concurso_id?: string }> = questoesGeradasLLM.map(q => {
        let idAlternativaCorreta = "";
        const alternativas: AlternativaQuestao[] = q.alternativas.map((texto, idx) => {
          const letra = String.fromCharCode(65 + idx);
          const idAlternativa = crypto.randomUUID();
          const ehCorreta = letra === q.correta;
          if (ehCorreta) {
            idAlternativaCorreta = idAlternativa;
          }
          return {
            id: idAlternativa,
            texto,
            correta: ehCorreta,
          };
        });

        if (!idAlternativaCorreta && alternativas.length > 0) {
            console.warn(`Letra correta "${q.correta}" não encontrada para questão "${q.questao}". Marcando a primeira como correta por padrão.`);
            alternativas[0].correta = true;
            idAlternativaCorreta = alternativas[0].id;
        }

        return {
          enunciado: q.questao,
          alternativas,
          resposta_correta_id: idAlternativaCorreta,
          disciplina: q.disciplina,
          topico: q.topico,
          concurso_id: concursoId,
          nivel_dificuldade: dificuldade,
        };
      });

      await importarQuestoesStore(questoesFormatadasParaStore);
      await fetchQuestoes(user.id, concursoId);
      setSuccessMessage("Questões importadas com sucesso para o concurso!");
      setQuestoesGeradasLLM([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao importar questões.");
      console.error("Erro ao importar questões:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="h-5 w-5 mr-2 text-primary" />
          Gerador de Questões (LLM + MCP)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Disciplina"
          value={disciplina}
          onChange={(e) => setDisciplina(e.target.value)}
          placeholder="Ex: Direito Constitucional"
          disabled={isLoading}
        />
        <Input
          label="Tópico Específico"
          value={topico}
          onChange={(e) => setTopico(e.target.value)}
          placeholder="Ex: Controle de Constitucionalidade"
          disabled={isLoading}
        />
        <div>
          <label htmlFor="dificuldade-llm" className="block text-sm font-medium text-muted-foreground mb-1">Nível de Dificuldade</label>
          <select
            id="dificuldade-llm"
            value={dificuldade}
            onChange={(e) => setDificuldade(e.target.value as "facil" | "medio" | "dificil")}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-ring bg-background text-foreground text-sm mb-2"
          >
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>
        <Input
          label="Quantidade de Questões (1-5)"
          type="number"
          value={quantidade}
          min={1}
          max={5}
          onChange={(e) => setQuantidade(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
          disabled={isLoading}
        />
        <div className="flex gap-2 items-end">
          <Textarea
            label="Resumo/Contexto (Opcional - pode ser preenchido via MCP)"
            value={resumo}
            onChange={(e) => setResumo(e.target.value)}
            rows={3}
            disabled={isLoading}
            placeholder="Cole aqui um resumo sobre o tópico ou use o botão ao lado para buscar via MCP."
          />
          <Button onClick={buscarResumo} disabled={isLoading || !disciplina || !topico} variant="outline" size="sm" className="self-end h-10">
            <Search className="h-4 w-4 mr-1" />
            Buscar (MCP)
          </Button>
        </div>
        <Button onClick={gerarQuestoes} disabled={isLoading || !disciplina || !quantidade} className="w-full">
          {isLoading && questoesGeradasLLM.length === 0 ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
          Gerar Questões
        </Button>

        {error && (
          <Alert variant="error" title="Erro">
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" title="Sucesso" className="bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300">
            {successMessage}
          </Alert>
        )}

        {questoesGeradasLLM.length > 0 && (
          <div className="mt-6 space-y-3 pt-4 border-t border-border">
            <h4 className="font-medium text-foreground">Questões Geradas:</h4>
            {questoesGeradasLLM.map((q, i) => (
              <Card key={i} className="p-3 bg-muted/50">
                <div className="mb-2 font-semibold text-sm text-foreground">{i + 1}. {q.questao}</div>
                <ol className="list-[upper-alpha] ml-5 space-y-1 text-sm">
                  {q.alternativas.map((alt, idx) => (
                    <li key={idx} className={q.correta === String.fromCharCode(65 + idx) ? "font-semibold text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                      {alt}
                    </li>
                  ))}
                </ol>
                <div className="mt-2 text-xs text-muted-foreground">
                  Disciplina: {q.disciplina} | Tópico: {q.topico}
                </div>
              </Card>
            ))}
            <Button onClick={handleImportarQuestoes} variant="default" className="w-full mt-3" disabled={isLoading || questoesGeradasLLM.length === 0}>
              {isLoading && questoesGeradasLLM.length > 0 ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UploadCloud className="h-4 w-4 mr-2" />}
              Importar {questoesGeradasLLM.length} Questões para o Concurso
            </Button>
            {llmPerformance && (
              <details className="mt-4 text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">Detalhes da Geração (LLM)</summary>
                <div className="mt-1 p-2 border border-border rounded bg-background">
                  <div><b>Tempo de resposta LLM:</b> {llmPerformance.duration.toFixed(0)}ms</div>
                  <details className="mt-1">
                    <summary className="cursor-pointer hover:text-foreground">Prompt usado</summary>
                    <pre className="whitespace-pre-wrap text-xs p-1 bg-muted rounded max-h-40 overflow-auto">{llmPerformance.prompt}</pre>
                  </details>
                  <details className="mt-1">
                    <summary className="cursor-pointer hover:text-foreground">Resposta bruta da LLM</summary>
                    <pre className="whitespace-pre-wrap text-xs p-1 bg-muted rounded max-h-40 overflow-auto">{JSON.stringify(llmPerformance.rawResponse, null, 2)}</pre>
                  </details>
                </div>
              </details>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

