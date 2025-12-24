import { groq } from "@ai-sdk/groq"
import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { z } from "zod"

import { CHAT_MODEL_IDS, DEFAULT_CHAT_MODEL_ID, type ChatModelId } from "@/lib/ai/chat-models"

export const maxDuration = 30

const chatRequestSchema = z.object({
  messages: z.array(z.unknown()),
  model: z.enum(CHAT_MODEL_IDS).optional(),
})

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response("Missing GROQ_API_KEY", { status: 500 })
  }

  const json = await req.json().catch(() => null)
  if (!json) {
    return new Response("Invalid JSON", { status: 400 })
  }

  const parsed = chatRequestSchema.safeParse(json)
  if (!parsed.success) {
    return new Response("Invalid request", { status: 400 })
  }

  const { messages, model } = parsed.data as {
    messages: UIMessage[]
    model?: ChatModelId
  }

  const modelId = model ?? DEFAULT_CHAT_MODEL_ID

  const result = streamText({
    model: groq(modelId),
    messages: await convertToModelMessages(messages),
    system: "You should address user's quearies directly be concise and smart. just like tony stark but in William Butcher's way",
  })

  return result.toUIMessageStreamResponse()
}


