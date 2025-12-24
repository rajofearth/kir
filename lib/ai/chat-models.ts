export const CHAT_MODEL_IDS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
] as const

export type ChatModelId = (typeof CHAT_MODEL_IDS)[number]

export const DEFAULT_CHAT_MODEL_ID: ChatModelId = "openai/gpt-oss-120b"

export const CHAT_MODELS: ReadonlyArray<{ id: ChatModelId; label: string }> = [
  { id: "openai/gpt-oss-120b", label: "openai/gpt-oss-120b" },
  { id: "openai/gpt-oss-20b", label: "openai/gpt-oss-20b" },
]


