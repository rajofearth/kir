"use client"

import * as React from "react"
import { cn } from '@/lib/utils'
import { PromptForm } from './prompt-form'
import { ModelSelector } from './model-selector'
import { ChatMessage } from './chat-message'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ChatCircleIcon, SpinnerIcon, ArrowDownIcon } from "@phosphor-icons/react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { Button } from '@/components/ui/button'

import { DEFAULT_CHAT_MODEL_ID, type ChatModelId } from "@/lib/ai/chat-models"

interface ChatInterfaceProps {
  className?: string
}

type ChatUIMessage = UIMessage & { role: "user" | "assistant" }

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [selectedModel, setSelectedModel] =
    React.useState<ChatModelId>(DEFAULT_CHAT_MODEL_ID)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const [showScrollToBottom, setShowScrollToBottom] = React.useState(false)

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })

  const scrollToBottom = React.useCallback(() => {
    // Keep scrolling confined to the messages viewport (not the whole page).
    // "auto" also avoids layout-jank while streaming tokens.
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }, [])

  const isStreaming = status === "submitted" || status === "streaming"

  // Auto-scroll on message changes
  React.useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Continuously scroll to bottom while streaming
  React.useEffect(() => {
    if (!isStreaming) return

    // Scroll immediately when streaming starts
    scrollToBottom()

    // Set up interval to continuously scroll during streaming
    const interval = setInterval(() => {
      scrollToBottom()
    }, 100) // Scroll every 100ms during streaming

    return () => {
      clearInterval(interval)
    }
  }, [isStreaming, scrollToBottom])

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

  // Detect if user is at bottom using IntersectionObserver
  React.useEffect(() => {
    // Find the ScrollArea viewport to use as root
    const findViewport = () => {
      const scrollArea = scrollAreaRef.current?.querySelector('[data-slot="scroll-area"]')
      return scrollArea?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null
    }

    const viewport = findViewport()
    const endElement = messagesEndRef.current

    if (!endElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting ?? false
        setShowScrollToBottom(!isVisible && visibleMessages.length > 0)
      },
      {
        root: viewport || null,
        rootMargin: "100px", // Show button when within 100px of bottom
        threshold: 0,
      }
    )

    // Small delay to ensure viewport is mounted
    const timeout = setTimeout(() => {
      const retryViewport = findViewport()
      if (retryViewport && endElement) {
        observer.observe(endElement)
      }
    }, 100)

    return () => {
      clearTimeout(timeout)
      if (endElement) {
        observer.unobserve(endElement)
      }
    }
  }, [messages, visibleMessages.length])

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

  const getPartType = (part: unknown): string | undefined => {
    if (!part || typeof part !== "object") return undefined
    if (!("type" in part)) return undefined
    const t = (part as { type?: unknown }).type
    return typeof t === "string" ? t : undefined
  }

  const getMetadataReasoning = (message: ChatUIMessage): string | undefined => {
    if (!message || typeof message !== "object") return undefined
    if (!("metadata" in message)) return undefined
    const metadata = (message as { metadata?: unknown }).metadata
    if (!metadata || typeof metadata !== "object") return undefined
    if (!("reasoning" in metadata)) return undefined
    const reasoning = (metadata as { reasoning?: unknown }).reasoning
    return typeof reasoning === "string" ? reasoning : undefined
  }

  const getReasoning = (message: ChatUIMessage) => {
    // Check for reasoning parts in the message
    // Reasoning can come as a part with type "reasoning" or in metadata
    const reasoningPart = message.parts.find(
      (part) => {
        const partType = getPartType(part)
        return partType === "reasoning" || partType === "thinking" || partType === "reasoning-text"
      }
    )
    
    if (reasoningPart) {
      // Handle different reasoning part structures
      if (typeof reasoningPart === "object" && reasoningPart !== null) {
        if ("text" in reasoningPart && typeof (reasoningPart as { text?: unknown }).text === "string") {
          return (reasoningPart as { text: string }).text
        }
        if (
          "content" in reasoningPart &&
          typeof (reasoningPart as { content?: unknown }).content === "string"
        ) {
          return (reasoningPart as { content: string }).content
        }
      }
      if (typeof reasoningPart === "string") {
        return reasoningPart
      }
    }
    
    // Also check metadata for reasoning
    const metadataReasoning = getMetadataReasoning(message)
    if (metadataReasoning) return metadataReasoning
    
    return undefined
  }

  return (
    <div
      className={cn(
        // Prevent the document/body from becoming scrollable; only the messages pane should scroll.
        "flex h-dvh flex-col bg-background overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <header className="shrink-0 border-b border-border px-4 py-3">
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
      <div ref={scrollAreaRef} className="min-h-0 flex-1 relative">
        <ScrollArea className="h-full">
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
                {visibleMessages.map((message, index) => {
                  const content = getMessageText(message)
                  const reasoning = getReasoning(message)
                  const isLastMessage = index === visibleMessages.length - 1
                  const messageIsStreaming = isStreaming && isLastMessage && message.role === "assistant"
                  
                  // Show message if it has content, reasoning, or is streaming with reasoning
                  if (
                    !content &&
                    !reasoning &&
                    !(
                      messageIsStreaming &&
                      message.parts.some((p) => getPartType(p) === "reasoning")
                    )
                  ) {
                    return null
                  }
                  
                  return (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={content || ""}
                      reasoning={reasoning}
                      isStreaming={messageIsStreaming}
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
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-border bg-background">
        <Separator />
        <div className="mx-auto max-w-3xl px-4 py-4 relative">
          {/* Scroll to Bottom Button */}
          {showScrollToBottom && (
            <div className="absolute -top-12 right-4 z-10">
              <Button
                size="icon"
                variant="default"
                className="rounded-full shadow-lg"
                onClick={() => {
                  scrollToBottom()
                  setShowScrollToBottom(false)
                }}
              >
                <ArrowDownIcon className="size-4" />
                <span className="sr-only">Scroll to bottom</span>
              </Button>
            </div>
          )}
          {/* Generating Message */}
          {isStreaming && (
            <div className="absolute top-0 left-4 flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
              <SpinnerIcon className="size-3 animate-spin" />
              <span>Generating response...</span>
            </div>
          )}
          <PromptForm
            onSend={handleSendMessage}
            onStop={stop}
            disabled={status !== "ready"}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  )
}

