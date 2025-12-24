"use client"

import * as React from "react"
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChatCircleIcon, UserIcon } from "@phosphor-icons/react"
import { Streamdown } from "streamdown"
import { CodeBlockWrapper } from './code-block-wrapper'
import { ReasoningSection } from './reasoning-section'

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  reasoning?: string
  timestamp?: Date
  isStreaming?: boolean
}

export function ChatMessage({ role, content, reasoning, timestamp, isStreaming = false }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div
      className={cn(
        "flex w-full py-6 min-w-0",
        isUser 
          ? "justify-end px-4 gap-4" 
          : "justify-start px-2 md:px-4 gap-2 md:gap-4"
      )}
    >
      {/* Hide assistant avatar on mobile only */}
      {!isUser && (
        <Avatar className="shrink-0 hidden sm:flex">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <ChatCircleIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex min-w-0 flex-col gap-2",
          isUser
            ? "items-end w-full max-w-[85%] md:max-w-[80%]"
            : "items-start w-full sm:max-w-[90%] md:max-w-[80%]"
        )}
      >
        {!isUser && reasoning && (
          <ReasoningSection reasoning={reasoning} isStreaming={isStreaming} />
        )}
        <div
          className={cn(
            // Prevent wide markdown children (tables/code/diagrams) from pushing the layout off-screen.
            "rounded-2xl px-4 py-3 min-w-0",
            isUser
              ? "bg-primary text-primary-foreground w-fit max-w-full"
              : "bg-muted text-muted-foreground w-full overflow-hidden"
          )}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
          ) : (
            <CodeBlockWrapper>
              <div className="chat-markdown text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 min-w-0 w-full break-words [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_code]:break-words [&_table]:max-w-full [&_table]:w-full [&_table]:block [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto [&_svg]:max-w-full">
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

