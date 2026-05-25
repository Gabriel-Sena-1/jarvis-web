const BASE_URL = "http://localhost:8000/api";

export interface AskResponse {
  answer: string;
  chunks_usados?: number;
}

export interface FileUploadResponse {
  filename: string;
  size: number;
  message: string;
}

export interface FileInfo {
  filename: string;
  size: number;
  created_at: string;
}

export interface FileListResponse {
  total: number;
  items: FileInfo[];
}

export async function askQuestion(
  question: string,
  tool_call?: string,
): Promise<AskResponse> {
  const response = await fetch(`${BASE_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, tool_call: tool_call ?? null }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar pergunta: ${response.statusText}`);
  }

  return response.json();
}

export async function uploadFile(file: File): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/files/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Erro ao fazer upload: ${response.statusText}`);
  }

  return response.json();
}

export async function listFiles(): Promise<FileListResponse> {
  const response = await fetch(`${BASE_URL}/files`);

  if (!response.ok) {
    throw new Error(`Erro ao listar arquivos: ${response.statusText}`);
  }

  return response.json();
}

// ── Agenda ─────────────────────────────────────────────────────────────────

export interface AgendaItem {
  id: number;
  nome: string;
  data: string;
  horario: string;
  descricao?: string;
  finished_at?: string | null;
  criado_em?: string;
}

export interface AgendaCreateRequest {
  nome: string;
  data: string;
  horario: string;
  descricao?: string;
}

export async function listAgenda(data?: string): Promise<AgendaItem[]> {
  const url = new URL(`${BASE_URL}/agenda`);
  if (data) url.searchParams.set("data", data);

  const response = await fetch(url.toString());
  if (!response.ok)
    throw new Error(`Erro ao listar agenda: ${response.statusText}`);
  return response.json();
}

export async function createAgenda(
  body: AgendaCreateRequest,
): Promise<AgendaItem> {
  const response = await fetch(`${BASE_URL}/agenda`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok)
    throw new Error(`Erro ao criar compromisso: ${response.statusText}`);
  return response.json();
}

export async function concluirAgenda(id: number): Promise<AgendaItem> {
  const response = await fetch(`${BASE_URL}/agenda/${id}/concluir`, {
    method: "PATCH",
  });
  if (!response.ok)
    throw new Error(`Erro ao concluir compromisso: ${response.statusText}`);
  return response.json();
}

export async function deleteAgenda(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/agenda/${id}`, {
    method: "DELETE",
  });
  if (!response.ok)
    throw new Error(`Erro ao deletar compromisso: ${response.statusText}`);
}
