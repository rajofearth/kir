"use client"

import * as React from "react"
import { cn } from '@/lib/utils'
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"
import { Streamdown } from "streamdown"
import { CodeBlockWrapper } from './code-block-wrapper'

interface ReasoningSectionProps {
  reasoning: string
  isStreaming?: boolean
}

export function ReasoningSection({ reasoning, isStreaming = false }: ReasoningSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)

  if (!reasoning.trim()) return null

  return (
    <div className="mb-2 rounded-lg border border-border/50 bg-muted/30 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium",
          "text-muted-foreground hover:text-foreground transition-colors",
          "hover:bg-muted/50"
        )}
        type="button"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse reasoning" : "Expand reasoning"}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider">Reasoning</span>
          {isStreaming && (
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px]">Thinking...</span>
            </span>
          )}
        </div>
        {isExpanded ? (
          <CaretUpIcon className="size-3 shrink-0" />
        ) : (
          <CaretDownIcon className="size-3 shrink-0" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-border/50">
          <CodeBlockWrapper>
            <div className="chat-markdown text-xs leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 min-w-0 w-full">
              <Streamdown 
                isAnimating={isStreaming}
                className="prose prose-xs dark:prose-invert max-w-none min-w-0 prose-headings:text-muted-foreground prose-p:text-muted-foreground prose-strong:text-muted-foreground prose-code:text-muted-foreground prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80"
              >
                {reasoning}
              </Streamdown>
            </div>
          </CodeBlockWrapper>
        </div>
      )}
    </div>
  )
}

