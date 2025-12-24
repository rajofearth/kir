"use client"

import * as React from "react"
import { cn } from '@/lib/utils'
import { PromptForm } from './prompt-form'
import { ModelSelector } from './model-selector'
import { ChatMessage } from './chat-message'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ChatCircleIcon } from "@phosphor-icons/react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  className?: string
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = React.useCallback((content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I received your message. This is a placeholder response.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }, [])

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
          <h1 className="text-lg font-semibold">kir</h1>
          <ModelSelector />
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
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
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background">
        <Separator />
        <div className="mx-auto max-w-3xl px-4 py-4">
          <PromptForm onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  )
}

