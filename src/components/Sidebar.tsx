import { Plus, MessageSquare, Settings, LogOut } from "lucide-react";
import { Button } from "./../../components/ui/button";

interface ConversationItem {
  id: string;
  title: string;
  date: string;
}

const MOCK_CONVERSATIONS: ConversationItem[] = [
  { id: "1", title: "Machine Learning Basics", date: "Hoje" },
  { id: "2", title: "Python Web Development", date: "Ontem" },
  { id: "3", title: "React Best Practices", date: "Há 2 dias" },
  { id: "4", title: "TypeScript Advanced", date: "Há 3 dias" },
  { id: "5", title: "Database Design", date: "Há 1 semana" },
];

interface SidebarProps {
  onNewChat?: () => void;
  activeConversationId?: string;
}

export function Sidebar({
  onNewChat,
  activeConversationId = "1",
}: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-screen">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-700">
        <Button
          onClick={onNewChat}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <Plus size={18} />
          Novo Chat
        </Button>
      </div>

      {/* Conversations List */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 px-2 font-semibold">
            Histórico
          </p>
          {MOCK_CONVERSATIONS.map((conv) => (
            <button
              key={conv.id}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm gap-2 flex items-start ${
                activeConversationId === conv.id
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <MessageSquare size={14} className="mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate">{conv.title}</p>
                <p className="text-xs opacity-75">{conv.date}</p>
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-gray-700 p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 gap-2"
        >
          <Settings size={18} />
          Configurações
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 gap-2"
        >
          <LogOut size={18} />
          Sair
        </Button>
      </div>
    </aside>
  );
}
