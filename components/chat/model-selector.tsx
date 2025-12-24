"use client"

import * as React from "react"
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { CaretDownIcon } from "@phosphor-icons/react"

export function ModelSelector() {
  const [mode, setMode] = React.useState("auto")
  const [model, setModel] = React.useState("gpt-5.1")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          ChatGPT 5.1
          <CaretDownIcon className="text-muted-foreground size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="start">
        <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
          GPT-5.1
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={mode} onValueChange={setMode}>
          <DropdownMenuRadioItem value="auto">
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemTitle>Auto</ItemTitle>
                <ItemDescription className="text-xs">
                  Decides how long to think
                </ItemDescription>
              </ItemContent>
            </Item>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="instant">
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemTitle>Instant</ItemTitle>
                <ItemDescription className="text-xs">
                  Answers right away
                </ItemDescription>
              </ItemContent>
            </Item>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="thinking">
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemTitle>Thinking</ItemTitle>
                <ItemDescription className="text-xs">
                  Thinks longer for better answers
                </ItemDescription>
              </ItemContent>
            </Item>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span className="font-medium">Legacy models</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
              <DropdownMenuRadioItem value="gpt-4">
                GPT-4
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="gpt-4-turbo">
                GPT-4 Turbo
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="gpt-3.5">
                GPT-3.5
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

