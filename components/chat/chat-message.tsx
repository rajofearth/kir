"use client"

import * as React from "react"
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChatCircleIcon, UserIcon } from "@phosphor-icons/react"
import { Streamdown } from "streamdown"
import { CodeBlockWrapper } from './code-block-wrapper'

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
  isStreaming?: boolean
}

export function ChatMessage({ role, content, timestamp, isStreaming = false }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div
      className={cn(
        "flex w-full gap-4 px-4 py-6 min-w-0",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <ChatCircleIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex max-w-[80%] min-w-0 flex-col gap-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 min-w-0 w-full",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
          ) : (
            <CodeBlockWrapper>
              <div className="chat-markdown text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 min-w-0 w-full">
                <Streamdown 
                  isAnimating={isStreaming}
                  className="prose prose-sm dark:prose-invert max-w-none min-w-0 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80"
                >
                  {content}
                </Streamdown>
              </div>
            </CodeBlockWrapper>
          )}
        </div>
        {timestamp && (
          <span className="text-muted-foreground text-xs">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      {isUser && (
        <Avatar className="shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

