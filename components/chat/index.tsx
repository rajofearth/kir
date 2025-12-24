"use client"

import { cn } from '@/lib/utils'
import { PromptForm } from './prompt-form'
import { ModelSelector } from './model-selector'
import { GroupChatDialog } from './group-chat-dialog'
import { CreateProjectForm } from './create-project-form'

function SectionWrapper({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="bg-background w-full">
      <div
        className={cn(
          "mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 2xl:max-w-6xl",
          className
        )}
        {...props}
      />
    </div>
  )
}

function Section({
  title,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  title?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none",
        className
      )}
      {...props}
    >
      {title && (
        <div className="text-muted-foreground px-1.5 py-2 text-xs font-medium">
          {title}
        </div>
      )}
      <div
        className={cn(
          "bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function ChatGPTBlock() {
  return (
    <SectionWrapper>
      <Section title="Prompt Form">
        <PromptForm />
      </Section>
      <Section title="Model Selector">
        <ModelSelector />
      </Section>
      <Section title="Group Chat Dialog" className="items-center justify-center">
        <GroupChatDialog />
      </Section>
      <Section title="Create Project" className="items-center justify-center">
        <CreateProjectForm />
      </Section>
    </SectionWrapper>
  )
}

