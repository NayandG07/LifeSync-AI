import { useState, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Smile } from "lucide-react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  suggestions?: string[];
  value?: string;
  onChange?: (value: string) => void;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  suggestions = [],
  value: externalValue,
  onChange: externalOnChange
}: ChatInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  
  // Use either the external or internal state
  const value = externalValue !== undefined ? externalValue : internalValue;
  const setValue = externalOnChange || setInternalValue;

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    
    onSendMessage(value);
    setValue("");
  };
  
  const insertEmoji = (emoji: string) => {
    setValue(value + emoji);
    setIsEmojiOpen(false);
  };

  // Common emojis for quick selection
  const commonEmojis = ["😊", "👍", "❤️", "😂", "🎉", "👋", "🙏", "🤔", "😢", "😎", "🔥", "✨", 
                       "👏", "💪", "🥳", "😍", "🤗", "👌", "💯", "🙂", "😌", "🤩"];

  return (
    <div className="p-3 sm:p-4 border-t bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
      {/* Message suggestions */}
      {value === "" && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 max-w-3xl mx-auto overflow-x-auto pb-2"
        >
          <div className="flex flex-nowrap gap-2 w-max">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs py-1 h-auto whitespace-nowrap bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 flex-shrink-0"
                onClick={() => setValue(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 max-w-3xl mx-auto relative"
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm py-5 sm:py-6 pl-4 pr-10 rounded-full"
        />
        
        {/* Emoji selector with popover for better mobile experience */}
        <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
          <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none p-1.5"
              >
                <Smile className="h-5 w-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-64 p-2" 
              side={isMobile ? "top" : "top"} 
              align="end"
            >
              <div className="grid grid-cols-6 gap-1.5">
                {commonEmojis.map(emoji => (
                  <button 
                    key={emoji} 
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="text-lg hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded flex items-center justify-center h-9 w-9"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <Button 
          type="submit" 
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm flex-shrink-0"
          disabled={!value.trim() || isLoading}
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
      
      <div className="text-center text-xs text-muted-foreground mt-3 max-w-3xl mx-auto">
        <p className="line-clamp-1">LifeSync AI respects your privacy. Information shared is used to provide personalized support.</p>
      </div>
    </div>
  );
} 