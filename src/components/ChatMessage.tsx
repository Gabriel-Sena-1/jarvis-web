interface ChatMessageProps {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <article
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <section
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
          isUser
            ? "bg-purple-600 text-white rounded-br-none"
            : "bg-gray-700 text-gray-100 rounded-bl-none"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        <time
          className={`text-xs mt-1 block ${isUser ? "text-purple-200" : "text-gray-400"}`}
        >
          {timestamp}
        </time>
      </section>
    </article>
  );
}
