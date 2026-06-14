import { Send, Paperclip } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./../../components/ui/button";

const TOOLS: { name: string; description: string }[] = [
  { name: "consultar_agenda", description: "Consulta compromissos na agenda" },
  {
    name: "listar_tarefas",
    description: "Lista tarefas pendentes ou concluídas",
  },
  { name: "adicionar_tarefa", description: "Adiciona um novo compromisso" },
  {
    name: "concluir_tarefa",
    description: "Marca um compromisso como concluído",
  },
  {
    name: "buscar_material_rag",
    description: "Busca em documentos e materiais",
  },
  {
    name: "montar_plano_estudos",
    description: "Gera um plano de estudos com base nos materiais e agenda",
  },
  {
    name: "gerar_perguntas_recall",
    description: "Inicia uma sessão de Active Recall (5 perguntas)",
  },
  {
    name: "avaliar_resposta_recall",
    description: "Avalia sua resposta para a pergunta de Active Recall atual",
  },
  {
    name: "recomendar_revisao",
    description: "Recomenda tópicos para revisar com base nos seus erros",
  },
];

interface ChatInputProps {
  onSendMessage: (message: string, toolCall?: string) => void;
  onUploadFile?: (file: File) => void;
  isLoading?: boolean;
}

export function ChatInput({
  onSendMessage,
  onUploadFile,
  isLoading = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [activeTool, setActiveTool] = useState<string | undefined>(undefined);
  const [suggestions, setSuggestions] = useState<typeof TOOLS>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;

    // Se há tool ativa e o usuário apaga tudo, remove a tool
    if (activeTool && v === "") {
      setActiveTool(undefined);
      setValue("");
      return;
    }

    // Se não há tool ativa ainda, verifica se está digitando um comando
    if (!activeTool) {
      setValue(v);
      const slashMatch = v.match(/^\/(\w*)$/);
      if (slashMatch) {
        const partial = slashMatch[1].toLowerCase();
        setSuggestions(TOOLS.filter((t) => t.name.startsWith(partial)));
        setSelectedIndex(0);
      } else {
        setSuggestions([]);
      }
    } else {
      setValue(v);
    }
  };

  const applySuggestion = (toolName: string) => {
    setActiveTool(toolName);
    setValue("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (i) => (i - 1 + suggestions.length) % suggestions.length,
      );
    } else if (e.key === "Tab" || e.key === "Enter") {
      if (suggestions.length > 0) {
        e.preventDefault();
        applySuggestion(suggestions[selectedIndex].name);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed && !activeTool) return;

    onSendMessage(trimmed, activeTool);
    setValue("");
    setActiveTool(undefined);
    setSuggestions([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onUploadFile?.(files[0]);
      e.currentTarget.value = "";
    }
  };

  const dismissTool = () => {
    setActiveTool(undefined);
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <footer className="border-t border-slate-800 bg-[#0f172a] p-6 shadow-lg relative">
      {/* Autocomplete dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute bottom-full left-6 right-6 mb-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-10">
          {suggestions.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onMouseDown={() => applySuggestion(t.name)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition ${
                i === selectedIndex ? "bg-slate-700" : "hover:bg-slate-800"
              }`}
            >
              <span className="text-fuchsia-400 font-mono text-sm">
                /{t.name}
              </span>
              <span className="text-slate-400 text-xs">{t.description}</span>
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 shadow-lg">
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 transition cursor-pointer text-slate-300 hover:text-fuchsia-400"
            title="Adicionar arquivo"
          >
            <Paperclip size={18} />
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />
          </label>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            {activeTool && (
              <button
                type="button"
                onClick={dismissTool}
                className="shrink-0 flex items-center gap-1 text-xs font-mono bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-700 rounded-md px-2 py-0.5 hover:bg-fuchsia-900 transition"
                title="Remover tool"
              >
                /{activeTool} <span className="text-fuchsia-500">✕</span>
              </button>
            )}
            <input
              ref={inputRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={
                activeTool
                  ? "Digite a mensagem..."
                  : "Digite sua mensagem ou / para usar uma tool..."
              }
              disabled={isLoading}
              autoComplete="off"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500 text-white min-w-0"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-700 hover:opacity-90 transition font-medium shadow-lg text-white border-0 text-sm disabled:opacity-50"
          >
            <Send size={16} />
            <span>Enviar</span>
          </Button>
        </div>
      </form>
    </footer>
  );
}
