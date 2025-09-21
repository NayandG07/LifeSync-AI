"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { lifesyncChatbot, LifeSyncChatbotInput } from "../../ai/flows/health-chatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Bot, User, Loader2, Sparkles, MapPin, Phone, X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStickyChatbot } from "./StickyChatbot";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ChatbotSchema = z.object({
  question: z.string().min(1, { message: "Question cannot be empty." }),
});

type ChatbotFormValues = z.infer<typeof ChatbotSchema>;

interface Doctor {
  name: string;
  specialty: string;
  address: string;
  phone: string;
}

interface Message {
  type: "user" | "bot" | "doctors";
  content: string;
  doctors?: Doctor[];
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isChatOpen, setIsChatOpen } = useStickyChatbot();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const form = useForm<ChatbotFormValues>({
    resolver: zodResolver(ChatbotSchema),
    defaultValues: { question: "" },
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
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const panelVariants = {
    hidden: { x: "100%", opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } },
    visible: { x: 0, opacity: 1, transition: { duration: 0.35, ease: "easeInOut" } },
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          className="fixed top-0 right-0 h-full w-full md:w-[450px] z-[100] flex"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsChatOpen(false)}
          />

          {/* Chat Panel */}
          <Card className="relative w-full h-full shadow-2xl rounded-l-2xl bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 flex flex-col">
            {/* Header */}
            <CardHeader className="flex items-center justify-between border-b border-gray-700 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Bot className="h-7 w-7 text-blue-500" />
                <CardTitle className="text-lg font-semibold text-white">LifeSync AI Assistant</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
                className="rounded-full h-8 w-8 text-white/80 hover:bg-red-700 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            {/* Chat Content */}
            <CardContent
              ref={scrollAreaRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-900"
            >
              {messages.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center justify-center text-gray-400">
                  <Sparkles className="h-12 w-12 mb-4 text-blue-400 animate-pulse" />
                  <p className="text-lg font-semibold">Welcome to LifeSync</p>
                  <p className="text-sm text-gray-400">Ask me anything about your health.</p>
                </div>
              )}

              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex items-start gap-4 w-full",
                    msg.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.type !== "user" && (
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "p-4 rounded-2xl max-w-[80%] shadow-lg",
                      msg.type === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-800 text-white rounded-bl-none",
                      msg.type === "doctors" && "bg-gray-700 border border-blue-500"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>

                    {msg.type === "doctors" && msg.doctors && (
                      <div className="mt-3 space-y-2">
                        {msg.doctors.map((doc, i) => (
                          <div
                            key={i}
                            className="p-3 border border-gray-600 rounded-lg bg-gray-800 text-sm"
                          >
                            <p className="font-semibold text-white">{doc.name}</p>
                            <p className="text-xs text-gray-300">{doc.specialty}</p>
                            <p className="flex items-center text-xs text-gray-300">
                              <MapPin className="h-3 w-3 mr-1.5" /> {doc.address}
                            </p>
                            <p className="flex items-center text-xs text-gray-300">
                              <Phone className="h-3 w-3 mr-1.5" /> {doc.phone}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.type === "user" && (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-4"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-800 text-white shadow-lg">
                    <span>Thinking...</span>
                  </div>
                </motion.div>
              )}
            </CardContent>

            {/* Footer */}
            <CardFooter className="border-t border-gray-700 p-4 bg-gray-900">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex gap-3 items-center w-full"
                >
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel className="sr-only">Your Question</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ask anything..."
                            {...field}
                            className="rounded-full h-12 px-4 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !form.formState.isValid}
                    size="icon"
                    className="rounded-full h-12 w-12 bg-blue-500 text-white hover:bg-blue-600"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </Form>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
