
"use client";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import { createContext, useContext, useState, ReactNode } from "react";

interface StickyChatbotContextType {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
}

const StickyChatbotContext = createContext<StickyChatbotContextType | undefined>(undefined);

export const StickyChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <StickyChatbotContext.Provider value={{ isChatOpen, setIsChatOpen }}>
      {children}
      <StickyChatbotButton />
    </StickyChatbotContext.Provider>
  );
};

export const useStickyChatbot = () => {
  const context = useContext(StickyChatbotContext);
  if (context === undefined) {
    throw new Error("useStickyChatbot must be used within a StickyChatbotProvider");
  }
  return context;
};

const StickyChatbotButton = () => {
  const { setIsChatOpen } = useStickyChatbot();

  return (
    <motion.div
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.2, type: "spring", stiffness: 150 }}
      whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px hsl(var(--primary) / 0.3)" }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        size="lg"
        className="rounded-full shadow-xl p-0 h-14 w-14 md:h-16 md:w-auto md:px-6 md:py-3 bg-gradient-to-r from-blue-700 via-violet-700 to-pink-600 hover:from-blue-700 hover:to-violet-700 text-primary-foreground flex items-center justify-center"
        onClick={() => setIsChatOpen(true)}
        aria-label="Open LifeSync AI Chatbot"
      >
        <Zap className="h-6 w-6 md:h-7 md:w-7 mr-0 md:mr-2 fill-primary-foreground" />
        <span className="hidden md:inline text-sm font-semibold">Ask LifeSync AI</span>
      </Button>
    </motion.div>
  );
};
