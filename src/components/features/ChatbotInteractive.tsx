"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { lifesyncChatbot, LifeSyncChatbotInput } from "../../ai/flows/health-chatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Bot, User, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ChatbotSchema = z.object({
  question: z.string().min(5, { message: "Question must be at least 5 characters." }),
});

type ChatbotFormValues = z.infer<typeof ChatbotSchema>;

interface Message {
  type: "user" | "bot";
  content: string;
}

export default function ChatbotInteractive() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ChatbotFormValues>({
    resolver: zodResolver(ChatbotSchema),
    defaultValues: {
      question: "",
    },
  });

  const onSubmit: SubmitHandler<ChatbotFormValues> = async (data) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { type: "user", content: data.question }]);
    form.reset();

    try {
      const input: LifeSyncChatbotInput = { question: data.question };
      const result = await lifesyncChatbot(input);

      setMessages((prev) => [...prev, { type: "bot", content: result.answer }]);

    } catch (error) {
      console.error("Error calling LifeSync chatbot flow:", error);
      toast({
        title: "Error",
        description: "Could not get a response from the chatbot. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => [...prev, { type: "bot", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold font-headline">
          <Bot className="mr-2 h-6 w-6 text-primary" />
          LifeSync AI Chatbot
        </CardTitle>
        <CardDescription>Ask questions about LifeSync AI features and services.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4 h-64 overflow-y-auto p-3 bg-muted/50 rounded-md border">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Sparkles className="mx-auto h-10 w-10 mb-2" />
              <p>No messages yet. Ask a question to start!</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-2 ${msg.type === "user" ? "justify-end" : ""}`}>
              {msg.type !== "user" && <Bot className="h-6 w-6 text-primary shrink-0 mt-1" />}
              <div className={`p-3 rounded-lg max-w-[80%] ${
                msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}>
                <p className="text-sm">{msg.content}</p>
              </div>
              {msg.type === "user" && <User className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />}
            </div>
          ))}
          {isLoading && messages.length > 0 && messages[messages.length - 1].type === 'user' && (
            <div className="flex items-start gap-2">
              <Bot className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div className="p-3 rounded-lg bg-secondary">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-start">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel className="sr-only">Your Question</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., How do I track my water intake?"
                      {...field}
                      className="rounded-md"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="rounded-md">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
