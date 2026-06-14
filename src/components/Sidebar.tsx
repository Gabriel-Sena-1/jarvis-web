import { useEffect, useState } from "react";
import {
  FileText,
  Calendar,
  Loader2,
  Plus,
  Check,
  X,
  MessageSquare,
  Trash2,
  PenSquare,
} from "lucide-react";
import {
  listFiles,
  listAgenda,
  createAgenda,
  concluirAgenda,
  deleteAgenda,
  listChats,
  deleteChatById,
} from "../services/api";
import type {
  FileInfo,
  AgendaItem,
  AgendaCreateRequest,
  Chat,
} from "../services/api";

const EMPTY_FORM: AgendaCreateRequest = {
  nome: "",
  data: "",
  horario: "",
  descricao: "",
};

interface SidebarProps {
  filesRefreshKey?: number;
  currentChatId?: number | null;
  chatsRefreshKey?: number;
  onSelectChat?: (chatId: number) => void;
  onNewChat?: () => void;
}

export function Sidebar({
  filesRefreshKey = 0,
  currentChatId = null,
  chatsRefreshKey = 0,
  onSelectChat,
  onNewChat,
}: SidebarProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingAgenda, setLoadingAgenda] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AgendaCreateRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadAgenda = () =>
    listAgenda()
      .then(setAgenda)
      .catch(() => setAgenda([]))
      .finally(() => setLoadingAgenda(false));

  const loadChats = () => {
    setLoadingChats(true);
    listChats()
      .then(setChats)
      .catch(() => setChats([]))
      .finally(() => setLoadingChats(false));
  };

  useEffect(() => {
    setLoadingFiles(true);
    listFiles()
      .then((res) => setFiles(res.items))
      .catch(() => setFiles([]))
      .finally(() => setLoadingFiles(false));
  }, [filesRefreshKey]);

  useEffect(() => {
    loadAgenda();
  }, []);

  useEffect(() => {
    loadChats();
  }, [chatsRefreshKey]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.data || !form.horario) return;
    setSaving(true);
    try {
      await createAgenda(form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setLoadingAgenda(true);
      await loadAgenda();
    } finally {
      setSaving(false);
    }
  };

  const handleConcluir = async (id: number) => {
    await concluirAgenda(id);
    setAgenda((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, finished_at: new Date().toISOString() } : it,
      ),
    );
  };

  const handleDelete = async (id: number) => {
    await deleteAgenda(id);
    setAgenda((prev) => prev.filter((it) => it.id !== id));
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: number) => {
    e.stopPropagation();
    await deleteChatById(chatId);
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (currentChatId === chatId) {
      onNewChat?.();
    }
  };

  return (
    <aside className="w-64 h-screen bg-[#020617] border-r border-slate-800 flex flex-col py-5 overflow-hidden">
      <div className="px-4 mb-5 flex items-center justify-between">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-600 to-violet-700 flex items-center justify-center text-lg font-bold shadow-lg text-white">
          J
        </div>
        <button
          onClick={onNewChat}
          title="Nova conversa"
          className="text-slate-500 hover:text-fuchsia-400 transition-colors p-1 rounded-lg hover:bg-slate-900"
        >
          <PenSquare size={15} />
        </button>
      </div>

      <div className="flex flex-col gap-6 flex-1 overflow-y-auto px-4">

        {/* CONVERSAS */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={13} className="text-fuchsia-400" />
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
              Conversas
            </span>
          </div>

          {loadingChats ? (
            <div className="flex items-center gap-2 px-2 py-1 text-slate-500 text-xs">
              <Loader2 size={12} className="animate-spin" />
              <span>Carregando...</span>
            </div>
          ) : chats.length === 0 ? (
            <p className="text-xs text-slate-600 px-2">Nenhuma conversa</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {chats.map((chat) => {
                const isActive = chat.id === currentChatId;
                return (
                  <li
                    key={chat.id}
                    onClick={() => onSelectChat?.(chat.id)}
                    className={`group flex items-center justify-between gap-1 px-3 py-2 rounded-lg border text-xs cursor-pointer transition-all ${
                      isActive
                        ? "bg-fuchsia-600/20 border-fuchsia-600/40 text-fuchsia-300"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80"
                    }`}
                  >
                    <span className="truncate flex-1">{chat.title}</span>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      title="Excluir conversa"
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all flex-shrink-0"
                    >
                      <Trash2 size={11} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* DOCUMENTOS */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={13} className="text-fuchsia-400" />
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
              Documentos
            </span>
          </div>

          {loadingFiles ? (
            <div className="flex items-center gap-2 px-2 py-1 text-slate-500 text-xs">
              <Loader2 size={12} className="animate-spin" />
              <span>Carregando...</span>
            </div>
          ) : files.length === 0 ? (
            <p className="text-xs text-slate-600 px-2">Nenhum documento</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {files.map((f) => (
                <li
                  key={f.filename}
                  title={f.filename}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 truncate"
                >
                  {f.filename}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* AGENDA */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-fuchsia-400" />
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
                Agenda
              </span>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              title="Novo compromisso"
              className="text-slate-500 hover:text-fuchsia-400 transition"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Formulário de criação */}
          {showForm && (
            <form
              onSubmit={handleCreate}
              className="flex flex-col gap-1.5 mb-3"
            >
              <input
                required
                placeholder="Nome"
                value={form.nome}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nome: e.target.value }))
                }
                className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-none focus:border-fuchsia-600"
              />
              <input
                required
                type="date"
                value={form.data}
                onChange={(e) =>
                  setForm((f) => ({ ...f, data: e.target.value }))
                }
                className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-fuchsia-600"
              />
              <input
                required
                type="time"
                value={form.horario}
                onChange={(e) =>
                  setForm((f) => ({ ...f, horario: e.target.value }))
                }
                className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-fuchsia-600"
              />
              <input
                placeholder="Descrição (opcional)"
                value={form.descricao}
                onChange={(e) =>
                  setForm((f) => ({ ...f, descricao: e.target.value }))
                }
                className="w-full px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-none focus:border-fuchsia-600"
              />
              <div className="flex gap-1.5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-medium transition disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(EMPTY_FORM);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {loadingAgenda ? (
            <div className="flex items-center gap-2 px-2 py-1 text-slate-500 text-xs">
              <Loader2 size={12} className="animate-spin" />
              <span>Carregando...</span>
            </div>
          ) : agenda.length === 0 ? (
            <p className="text-xs text-slate-600 px-2">Nenhum compromisso</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {agenda.map((item) => (
                <li
                  key={item.id}
                  className={`px-3 py-2 rounded-lg border text-xs ${
                    item.finished_at
                      ? "bg-slate-900/50 border-slate-800/50 text-slate-500"
                      : "bg-slate-900 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${item.finished_at ? "line-through" : ""}`}
                      >
                        {item.nome}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {item.data} às {item.horario}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {!item.finished_at && (
                        <button
                          onClick={() => handleConcluir(item.id)}
                          title="Concluir"
                          className="text-slate-500 hover:text-green-400 transition"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Remover"
                        className="text-slate-500 hover:text-red-400 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </aside>
  );
}
