import { Send } from "lucide-react";
import { Button } from "./../../components/ui/button";
import { Input } from "./../../components/ui/input";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get("message") as string;

    if (input.trim()) {
      onSendMessage(input);
      e.currentTarget.reset();
    }
  };

  return (
    <footer className="border-t border-gray-600 bg-gray-800 p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          name="message"
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
          className="flex-1 bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-purple-500 focus:ring-purple-500"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white gap-2"
        >
          <Send size={18} />
        </Button>
      </form>
    </footer>
  );
}
