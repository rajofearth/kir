"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function GroupChatDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Start Group Chat</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Use ChatGPT together</AlertDialogTitle>
          <AlertDialogDescription>
            Add people to your chats to plan, share ideas, and get creative.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row items-center justify-between sm:justify-between">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
          >
            Learn more
          </a>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Start group chat</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

