"use client"

import * as React from "react"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  GearIcon, 
  FolderIcon, 
  CheckCircleIcon, 
  LightbulbIcon 
} from "@phosphor-icons/react"

const categories = [
  {
    id: "homework",
    label: "Homework",
  },
  {
    id: "writing",
    label: "Writing",
  },
  {
    id: "health",
    label: "Health",
  },
  {
    id: "travel",
    label: "Travel",
  },
] as const

const colorOptions = [
  "var(--foreground)",
  "#fa423e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#10b981",
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#fbbc04",
] as const

export function CreateProjectForm() {
  const [projectName, setProjectName] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    categories[0].id
  )
  const [memorySetting, setMemorySetting] = React.useState<
    "default" | "project-only"
  >("default")
  const [selectedColor, setSelectedColor] = React.useState<string | null>(
    "var(--foreground)"
  )

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>
          Start a new project to keep chats, files, and custom instructions in
          one place.
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <GearIcon />
                <span className="sr-only">Memory</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuRadioGroup
                value={memorySetting}
                onValueChange={(value) => {
                  setMemorySetting(value as "default" | "project-only")
                }}
              >
                <DropdownMenuRadioItem value="default">
                  <Item size="xs">
                    <ItemContent>
                      <ItemTitle>Default</ItemTitle>
                      <ItemDescription className="text-xs">
                        Project can access memories from outside chats, and
                        vice versa.
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="project-only">
                  <Item size="xs">
                    <ItemContent>
                      <ItemTitle>Project Only</ItemTitle>
                      <ItemDescription className="text-xs">
                        Project can only access its own memories. Its memories
                        are hidden from outside chats.
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                Note that this setting can&apos;t be changed later.
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="project-name" className="sr-only">
              Project Name
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="project-name"
                placeholder="Copenhagen Trip"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value)
                }}
              />
              <InputGroupAddon>
                <Popover>
                  <PopoverTrigger asChild>
                    <InputGroupButton variant="ghost" size="icon-xs">
                      <FolderIcon 
                        style={{ "--color": selectedColor } as React.CSSProperties} 
                        className="text-(--color)" 
                      />
                    </InputGroupButton>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-60 p-3">
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <Button
                          key={color}
                          size="icon"
                          variant="ghost"
                          className="rounded-full p-1"
                          style={{ "--color": color } as React.CSSProperties}
                          data-checked={selectedColor === color}
                          onClick={() => {
                            setSelectedColor(color)
                          }}
                        >
                          <span className="group-data-[checked=true]/button:ring-offset-background size-5 rounded-full bg-(--color) ring-2 ring-transparent ring-offset-2 ring-offset-(--color) group-data-[checked=true]/button:ring-(--color)" />
                          <span className="sr-only">{color}</span>
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  data-checked={selectedCategory === category.id}
                  asChild
                >
                  <button
                    onClick={() => {
                      setSelectedCategory(
                        selectedCategory === category.id ? null : category.id
                      )
                    }}
                  >
                    <CheckCircleIcon 
                      data-icon="inline-start" 
                      className="hidden group-data-[checked=true]/badge:inline" 
                    />
                    {category.label}
                  </button>
                </Badge>
              ))}
            </FieldDescription>
          </Field>
          <Field>
            <Alert className="bg-muted">
              <LightbulbIcon />
              <AlertDescription className="text-xs">
                Projects keep chats, files, and custom instructions in one
                place. Use them for ongoing work, or just to keep things tidy.
              </AlertDescription>
            </Alert>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

