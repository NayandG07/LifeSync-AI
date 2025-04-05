import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-end space-x-2 mb-8">
      <div className="flex-shrink-0">
        <Avatar className="h-7 w-7 border-2 border-white shadow-md">
          <AvatarImage src="/ai-avatar.png" />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white">
            <Bot className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-[85%] min-w-[80px] rounded-2xl px-4 py-3 shadow-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
      >
        <div className="text-xs font-semibold mb-1.5 opacity-90 flex items-center">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LifeSync AI</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="ml-1.5 text-blue-600 dark:text-blue-400"
          >
            is analyzing...
          </motion.span>
        </div>
        
        <div className="flex items-center py-1.5">
          <div className="flex space-x-3">
            <motion.div
              className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
            />
            <motion.div
              className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 1, delay: 0.15, repeat: Infinity, repeatType: "loop" }}
            />
            <motion.div
              className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 1, delay: 0.3, repeat: Infinity, repeatType: "loop" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
} 