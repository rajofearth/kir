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
  ArrowUpIcon 
} from "@phosphor-icons/react"

export function PromptForm() {
  const [dictateEnabled, setDictateEnabled] = React.useState(false)

  return (
    <Field>
      <FieldLabel htmlFor="prompt" className="sr-only">
        Prompt
      </FieldLabel>
      <InputGroup>
        <InputGroupTextarea id="prompt" placeholder="Ask anything" />
        <InputGroupAddon align="block-end">
          <DropdownMenu>
            <Tooltip>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDictateEnabled(!dictateEnabled)}
                    className="rounded-4xl"
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
                variant="ghost"
                size="icon-sm"
                onClick={() => setDictateEnabled(!dictateEnabled)}
                className="ml-auto rounded-4xl"
              >
                <MicrophoneIcon />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent>Dictate</TooltipContent>
          </Tooltip>
          <InputGroupButton
            size="icon-sm"
            variant="default"
            className="rounded-4xl"
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

