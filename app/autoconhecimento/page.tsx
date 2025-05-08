
"use client";

import { useState } from "react";
import { Anchor, PenSquare, X } from "lucide-react";
import { EditorNotas } from "../components/autoconhecimento/EditorNotas";
import { ListaNotas } from "../components/autoconhecimento/ListaNotas";
import { ModoRefugio } from "../components/autoconhecimento/ModoRefugio";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { Section } from "../components/ui/Section";
import { useAutoconhecimentoStore } from "../stores/autoconhecimentoStore";

export default function AutoconhecimentoPage() {
  const [abaSelecionada, setAbaSelecionada] = useState<"quem-sou" | "meus-porques" | "meus-padroes">("quem-sou");
  const [notaSelecionada, setNotaSelecionada] = useState<string | null>(null);
  const [criandoNota, setCriandoNota] = useState(false);

  const { modoRefugio } = useAutoconhecimentoStore();

  const tituloAbas = {
    "quem-sou": "Quem sou",
    "meus-porques": "Meus porquês",
    "meus-padroes": "Meus padrões",
  };

  const descricaoAbas = {
    "quem-sou": "Registre suas preferências, aversões e características pessoais estáveis",
    "meus-porques": "Documente motivações e valores fundamentais que guiam suas decisões",
    "meus-padroes": "Anote reações emocionais típicas e estratégias eficazes em momentos de crise",
  };

  const handleSelecionarNota = (id: string) => {
    setNotaSelecionada(id);
    setCriandoNota(false);
  };

  const handleCriarNota = () => {
    setNotaSelecionada(null);
    setCriandoNota(true);
  };

  const handleCancelar = () => {
    setNotaSelecionada(null);
    setCriandoNota(false);
  };

  const handleSalvarNota = () => {
    setNotaSelecionada(null);
    setCriandoNota(false);
    // Opcional: pode querer recarregar as notas ou a nota específica aqui se necessário
  };

  const interfaceSimplificada = modoRefugio;

  return (
    <Container>
      <div className="flex items-center mb-6">
        <Anchor className="h-7 w-7 text-primary mr-3" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-foreground">Notas de Autoconhecimento</h1>
      </div>

      <div className="flex border-b border-border mb-6 overflow-x-auto">
        {(Object.keys(tituloAbas) as Array<keyof typeof tituloAbas>).map((aba) => (
          <button
            key={aba}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap rounded-t-lg transition-colors ${
              abaSelecionada === aba
                ? "bg-primary/10 text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setAbaSelecionada(aba);
              setNotaSelecionada(null);
              setCriandoNota(false);
            }}
            aria-current={abaSelecionada === aba ? "page" : undefined}
          >
            {tituloAbas[aba]}
          </button>
        ))}
      </div>

      {!interfaceSimplificada && !notaSelecionada && !criandoNota && (
        <div className="mb-6 bg-muted/50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-primary mb-2">{tituloAbas[abaSelecionada]}</h2>
          <p className="text-muted-foreground">{descricaoAbas[abaSelecionada]}</p>
        </div>
      )}

      <Section
        title={interfaceSimplificada || notaSelecionada || criandoNota ? "" : tituloAbas[abaSelecionada]}
        className={`${interfaceSimplificada ? "bg-opacity-90" : ""} transition-opacity duration-300`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={notaSelecionada || criandoNota ? "hidden lg:block" : "block"}>
            {/* O botão de nova nota foi movido para dentro de ListaNotas, então não é mais necessário aqui 
                se ListaNotas tiver seu próprio botão interno para adicionar nova nota. 
                Se o botão em ListaNotas for apenas para a view mobile, pode precisar de lógica condicional aqui.
            */}
            <ListaNotas
              secaoAtual={abaSelecionada}
              onSelectNota={handleSelecionarNota}
              onAddNewNota={handleCriarNota} // Prop adicionada
            />
          </div>

          {(notaSelecionada || criandoNota) && (
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {criandoNota ? `Nova Nota em ${tituloAbas[abaSelecionada]}` : (notaSelecionada ? "Editar Nota" : "Nota")}
                </h3>
                <Button
                  variant="outline"
                  onClick={handleCancelar}
                  aria-label="Cancelar"
                >
                  <X size={16} className="mr-2" />
                  Cancelar
                </Button>
              </div>
              <EditorNotas
                id={notaSelecionada || undefined}
                secaoAtual={abaSelecionada}
                onSave={handleSalvarNota}
                onCancel={handleCancelar} // Passando onCancel para o editor também
              />
            </div>
          )}
        </div>
      </Section>

      <ModoRefugio />
    </Container>
  );
}

