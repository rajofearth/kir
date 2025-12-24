"use client"

import * as React from "react"
import { cn } from '@/lib/utils'
import { PromptForm } from './prompt-form'
import { ModelSelector } from './model-selector'
import { ChatMessage } from './chat-message'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ChatCircleIcon, SpinnerIcon } from "@phosphor-icons/react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"

import { DEFAULT_CHAT_MODEL_ID, type ChatModelId } from "@/lib/ai/chat-models"

interface ChatInterfaceProps {
  className?: string
}

type ChatUIMessage = UIMessage & { role: "user" | "assistant" }

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [selectedModel, setSelectedModel] =
    React.useState<ChatModelId>(DEFAULT_CHAT_MODEL_ID)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = React.useCallback(
    (content: string) => {
      if (!content.trim()) return
      if (status !== "ready") return

      sendMessage(
        { text: content.trim() },
        {
          body: {
            model: selectedModel,
          },
        }
      )
    },
    [sendMessage, selectedModel, status]
  )

  const visibleMessages = React.useMemo(() => {
    return messages.filter(
      (m): m is ChatUIMessage => m.role === "user" || m.role === "assistant"
    )
  }, [messages])

  const lastMessage = visibleMessages.at(-1)
  const showLoader =
    (status === "submitted" || status === "streaming") &&
    (lastMessage?.role === "user" ||
      (lastMessage?.role === "assistant" && lastMessage.parts.length === 0))

  const getMessageText = (message: ChatUIMessage) => {
    return message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("")
  }

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-background",
        className
      )}
    >
      {/* Header */}
      <header className="border-b border-border px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <h1 className="text-lg font-semibold">yunejo</h1>
          <ModelSelector value={selectedModel} onValueChange={setSelectedModel} />
        </div>
        {error && (
          <div className="mx-auto mt-2 max-w-3xl text-sm text-destructive">
            {error.message}
          </div>
        )}
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-3xl">
          {visibleMessages.length === 0 ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center px-4 py-12 text-center">
              <div className="mb-4 text-muted-foreground">
                <ChatCircleIcon className="mx-auto size-12" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">Start a conversation</h2>
              <p className="text-muted-foreground text-sm">
                Send a message to begin chatting
              </p>
            </div>
          ) : (
            <div className="py-4">
              {visibleMessages.map((message) => {
                const content = getMessageText(message)
                if (!content) return null
                return (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={content}
                  />
                )
              })}
              {showLoader && (
                <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground">
                  <SpinnerIcon className="size-4 animate-spin" />
                  <span className="text-xs">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background">
        <Separator />
        <div className="mx-auto max-w-3xl px-4 py-4">
          <PromptForm
            onSend={handleSendMessage}
            disabled={status !== "ready"}
          />
        </div>
      </div>
    </div>
  )
}

