import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Sidebar } from "./Sidebar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Olá! Sou o Jarvis, seu assistente de IA. Como posso ajudá-lo hoje?",
    timestamp: "10:30",
  },
  {
    id: "2",
    role: "user",
    content: "Oi! Você pode me explicar como funciona machine learning?",
    timestamp: "10:31",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Claro! Machine Learning é um ramo da Inteligência Artificial que permite aos sistemas aprender com dados sem serem explicitamente programados. Os algoritmos identificam padrões nos dados e melhoram seu desempenho com o tempo.",
    timestamp: "10:32",
  },
  {
    id: "4",
    role: "user",
    content: "E quais são os principais tipos de ML?",
    timestamp: "10:33",
  },
  {
    id: "5",
    role: "assistant",
    content:
      "Os principais tipos são:\n\n1. **Supervisionado**: O modelo aprende com dados rotulados\n2. **Não supervisionado**: O modelo encontra padrões em dados não rotulados\n3. **Reforço**: O modelo aprende através de recompensas e punições",
    timestamp: "10:34",
  },
];

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Entendi sua pergunta: "${content}". Isso é uma resposta simulada. Para uma implementação real, você conectaria a um serviço de IA.`,
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#283039]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 shadow-lg">
          <nav className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">
              J
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Jarvis</h1>
              <p className="text-gray-400 text-sm">Assistente de IA</p>
            </div>
          </nav>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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
            <article className="flex justify-start mb-4">
              <section className="bg-gray-700 text-gray-100 rounded-lg rounded-bl-none px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </section>
            </article>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
