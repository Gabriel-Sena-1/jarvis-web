import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-700 flex items-center justify-center font-bold shadow-lg flex-shrink-0 mr-4">
          J
        </div>
      )}
      <div
        className={`max-w-[70%] ${isUser ? "flex flex-col items-end" : "flex flex-col items-start"}`}
      >
        <div
          className={`px-6 py-5 rounded-3xl shadow-xl border ${
            isUser
              ? "bg-gradient-to-r from-fuchsia-600 to-violet-700 text-white rounded-br-none"
              : "bg-slate-800 text-slate-200 border-slate-700 rounded-bl-none"
          }`}
        >
          <div
            className="text-sm leading-6 prose prose-invert prose-sm max-w-none
              prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0
              prose-strong:text-white prose-code:text-fuchsia-300
              prose-code:bg-slate-700 prose-code:px-1 prose-code:rounded"
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
        <time
          className={`text-xs mt-2 ${isUser ? "text-slate-400" : "text-slate-500"}`}
        >
          {timestamp}
        </time>
      </div>
    </div>
  );
}
