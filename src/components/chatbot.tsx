"use client"

import { useState, useRef, useEffect, useActionState } from "react"
import { useFormStatus } from "react-dom"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getChatbotResponse } from "@/lib/actions"
import { BotAvatar } from "./bot-avatar"
import { Send, MessageCircle, Loader2 } from "lucide-react"

type Message = {
  type: "user" | "bot"
  text: string
}

const initialState = {
  userMessage: "",
  botMessage: "Hello! Let's explore winning strategies.",
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="icon" disabled={pending} className="bg-primary hover:bg-primary/90">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      <span className="sr-only">Send</span>
    </Button>
  )
}

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", text: initialState.botMessage },
  ])
  const [formState, formAction] = useActionState(getChatbotResponse, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formState.userMessage && formState.botMessage) {
      setMessages((prev) => [
        ...prev,
        { type: "user", text: formState.userMessage },
        { type: "bot", text: formState.botMessage },
      ])
    }
  }, [formState.botMessage, formState.userMessage, formState.error])

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-20 right-4 rounded-full w-14 h-14 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-lg">
          <MessageCircle className="h-7 w-7" />
          <span className="sr-only">Open Support Chat</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-card/80 backdrop-blur-sm">
        <SheetHeader>
          <SheetTitle>Hello! Let's explore winning strategies</SheetTitle>
          <SheetDescription>
            Our AI assistant is here to help you. Ask a question below.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 my-4 pr-4" viewportRef={viewportRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.type === "user" ? "justify-end" : ""
                }`}
              >
                {message.type === "bot" && <BotAvatar />}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] shadow-sm ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                {message.type === "user" && (
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <SheetFooter>
          <form
            ref={formRef}
            action={(formData) => {
              formAction(formData)
              formRef.current?.reset()
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              name="message"
              placeholder="Type your question..."
              autoComplete="off"
              required
            />
            <SubmitButton />
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
