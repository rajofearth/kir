"use client"

import * as React from "react"
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CaretDownIcon } from "@phosphor-icons/react"
import { CHAT_MODEL_IDS, CHAT_MODELS, type ChatModelId } from "@/lib/ai/chat-models"

interface ModelSelectorProps {
  value: ChatModelId
  onValueChange: (value: ChatModelId) => void
}

function isChatModelId(value: string): value is ChatModelId {
  return (CHAT_MODEL_IDS as readonly string[]).includes(value)
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  const currentLabel =
    CHAT_MODELS.find((m) => m.id === value)?.label ?? value

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          {currentLabel}
          <CaretDownIcon className="text-muted-foreground size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="start">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            if (isChatModelId(next)) onValueChange(next)
          }}
        >
          {CHAT_MODELS.map((model) => (
            <DropdownMenuRadioItem key={model.id} value={model.id}>
              {model.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

