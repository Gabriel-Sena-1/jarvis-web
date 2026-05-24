import { Send, Paperclip } from "lucide-react";
import { Button } from "./../../components/ui/button";
import { Input } from "./../../components/ui/input";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onUploadFile?: (file: File) => void;
  isLoading?: boolean;
}

export function ChatInput({
  onSendMessage,
  onUploadFile,
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onUploadFile?.(files[0]);
      e.currentTarget.value = "";
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-[#0f172a] p-6 shadow-lg">
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
          <Input
            name="message"
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500 border-0 focus:ring-0 text-white"
          />
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
