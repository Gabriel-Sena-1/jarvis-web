import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Sidebar } from "./Sidebar";
import { askQuestion, uploadFile, getChatMessages } from "../services/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const now = () =>
  new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const WELCOME_MESSAGE: Message = {
  id: "0",
  role: "assistant",
  content: "Olá! Sou o Jarvis, seu assistente de IA. Como posso ajudá-lo hoje?",
  timestamp: now(),
};

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [filesRefreshKey, setFilesRefreshKey] = useState(0);
  const [chatsRefreshKey, setChatsRefreshKey] = useState(0);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /** Inicia uma conversa completamente nova */
  const handleNewChat = useCallback(() => {
    setCurrentChatId(null);
    setMessages([WELCOME_MESSAGE]);
  }, []);

  /** Carrega mensagens de um chat existente ao clicar na sidebar */
  const handleSelectChat = useCallback(async (chatId: number) => {
    if (chatId === currentChatId) return;
    setLoadingHistory(true);
    setCurrentChatId(chatId);
    setMessages([]);
    try {
      const history = await getChatMessages(chatId);
      const converted: Message[] = history.map((m) => ({
        id: String(m.id),
        role: m.role,
        content: m.message,
        timestamp: now(),
      }));
      setMessages(converted.length > 0 ? converted : [WELCOME_MESSAGE]);
    } catch {
      setMessages([WELCOME_MESSAGE]);
    } finally {
      setLoadingHistory(false);
    }
  }, [currentChatId]);

  const handleSendMessage = async (content: string, toolCall?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: toolCall ? `/${toolCall} ${content}`.trim() : content,
      timestamp: now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await askQuestion(content, toolCall, currentChatId ?? undefined);

      // Sincroniza o chat_id retornado (útil quando é a primeira mensagem de um novo chat)
      if (data.chat_id != null && data.chat_id !== currentChatId) {
        setCurrentChatId(data.chat_id);
        setChatsRefreshKey((k) => k + 1);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setFilesRefreshKey((k) => k + 1);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Ocorreu um erro ao processar sua pergunta. Tente novamente.",
        timestamp: now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFile = async (file: File) => {
    setUploadStatus(`Enviando "${file.name}"...`);
    try {
      const data = await uploadFile(file);
      setUploadStatus(`Arquivo "${data.filename}" enviado com sucesso.`);
      setFilesRefreshKey((k) => k + 1);
    } catch {
      setUploadStatus(`Erro ao enviar o arquivo "${file.name}".`);
    } finally {
      setTimeout(() => setUploadStatus(null), 4000);
    }
  };

  return (
    <div className="flex h-screen bg-[#0b1120] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        filesRefreshKey={filesRefreshKey}
        chatsRefreshKey={chatsRefreshKey}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-[#111827] border-b border-slate-800 px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-600 to-violet-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                J
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">Jarvis AI</h1>
                <p className="text-slate-400 text-sm">
                  Assistente Acadêmico Inteligente
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-[#1e293b]">
          {loadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Carregando conversa...</span>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  id={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-700 flex items-center justify-center font-bold shadow-lg animate-pulse flex-shrink-0">
                    J
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-3xl px-6 py-5 shadow-xl">
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <span className="text-sm text-slate-400 ml-3">
                        Jarvis está analisando...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Upload status */}
        {uploadStatus && (
          <div className="px-8 py-2 text-xs text-fuchsia-400 bg-slate-900 border-t border-slate-800">
            {uploadStatus}
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onUploadFile={handleUploadFile}
          isLoading={isLoading || loadingHistory}
        />
      </div>
    </div>
  );
}
