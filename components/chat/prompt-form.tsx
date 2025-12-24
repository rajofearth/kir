"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Field,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Kbd } from '@/components/ui/kbd'
import { 
  PlusIcon, 
  PaperclipIcon, 
  SparkleIcon, 
  BagIcon, 
  MagicWandIcon, 
  HandPointingIcon, 
  DotsThreeOutlineIcon, 
  ShareIcon, 
  BookOpenIcon, 
  GlobeIcon, 
  PencilIcon, 
  MicrophoneIcon, 
  ArrowUpIcon,
  StopIcon
} from "@phosphor-icons/react"

interface PromptFormProps {
  onSend?: (message: string) => void
  onStop?: () => void
  disabled?: boolean
  isStreaming?: boolean
}

export function PromptForm({ 
  onSend, 
  onStop, 
  disabled = false, 
  isStreaming = false 
}: PromptFormProps) {
  const [dictateEnabled, setDictateEnabled] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled || isStreaming) return
    if (inputValue.trim() && onSend) {
      onSend(inputValue)
      setInputValue("")
    }
  }

  const handleStop = () => {
    if (onStop) {
      onStop()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
  }

  const handleResetHeight = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (!inputValue.trim()) {
      e.target.style.height = "auto"
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field>
        <FieldLabel htmlFor="prompt" className="sr-only">
          Prompt
        </FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="prompt"
            placeholder="Ask anything"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleResetHeight}
            rows={1}
            className="max-h-32 resize-none"
            disabled={disabled || isStreaming}
          />
          <InputGroupAddon align="block-end">
            <DropdownMenu>
              <Tooltip>
                <DropdownMenuTrigger asChild>
                  <TooltipTrigger asChild>
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDictateEnabled(!dictateEnabled)}
                      className="rounded-4xl"
                      disabled={disabled || isStreaming}
                    >
                      <PlusIcon />
                    </InputGroupButton>
                  </TooltipTrigger>
                </DropdownMenuTrigger>
                <TooltipContent>
                  Add files and more <Kbd>/</Kbd>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                className="w-56"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuItem>
                  <PaperclipIcon />
                  Add photos & files
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SparkleIcon />
                  Deep research
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BagIcon />
                  Shopping research
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MagicWandIcon />
                  Create image
                </DropdownMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem>
                      <HandPointingIcon />
                      Agent mode
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="font-medium">35 left</div>
                    <div className="text-primary-foreground/80 text-xs">
                      More available for purchase
                    </div>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <DotsThreeOutlineIcon />
                    More
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <ShareIcon />
                      Add sources
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BookOpenIcon />
                      Study and learn
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <GlobeIcon />
                      Web search
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PencilIcon />
                      Canvas
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDictateEnabled(!dictateEnabled)}
                  className="ml-auto rounded-4xl"
                  disabled={disabled || isStreaming}
                >
                  <MicrophoneIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Dictate</TooltipContent>
            </Tooltip>
            {isStreaming ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    type="button"
                    size="icon-sm"
                    variant="destructive"
                    className="rounded-4xl cursor-pointer"
                    onClick={handleStop}
                  >
                    <StopIcon />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>Stop generation</TooltipContent>
              </Tooltip>
            ) : (
              <InputGroupButton
                type="submit"
                size="icon-sm"
                variant="default"
                className="rounded-4xl cursor-pointer"
                disabled={disabled || !inputValue.trim()}
              >
                <ArrowUpIcon />
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  )
}

