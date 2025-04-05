import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Heart, Sparkles, User, X, ThumbsUp, Smile, Star, MessageSquare, Copy, Share2, Flag, SmilePlus } from "lucide-react";
import { Message } from "@/lib/types";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: Message;
  userPhotoURL?: string;
  isLast?: boolean;
  onDelete?: (messageId: string) => void;
}

// Emoji reaction options
const emojiReactions = [
  { emoji: "👍", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "😊", label: "Smile" },
  { emoji: "🙏", label: "Thanks" },
  { emoji: "👏", label: "Clap" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "😮", label: "Wow" },
  { emoji: "🔥", label: "Fire" },
];

export default function MessageBubble({ message, userPhotoURL, isLast = false, onDelete }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [userName, setUserName] = useState<string>("User");
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [reactions, setReactions] = useState<string[]>([]);
  const [isReactionPopoverOpen, setIsReactionPopoverOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const isUser = message.sender === "user";
  
  useEffect(() => {
    // Get user's name from profile
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        const { name } = JSON.parse(userProfile);
        if (name) {
          setUserName(name);
        }
      } catch (error) {
        console.error("Error parsing user profile:", error);
      }
    }
    
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle reaction addition
  const handleAddReaction = (emoji: string) => {
    setReactions(prev => {
      // Don't add duplicates
      if (prev.includes(emoji)) return prev;
      return [...prev, emoji];
    });
    setIsReactionPopoverOpen(false);
    setShowMobileActions(false);
    toast.success(`Reaction added: ${emoji}`);
  };

  // Handle message copy
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.text);
    setShowMobileActions(false);
    toast.success("Message copied to clipboard");
  };

  // Handle message delete
  const handleDeleteMessage = () => {
    if (onDelete) {
      onDelete(message.id);
      setShowMobileActions(false);
      toast.success("Message deleted");
    }
  };

  // Handle message share
  const handleShareMessage = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Shared from LifeSync AI',
        text: message.text,
      }).catch(err => {
        console.error('Error sharing message:', err);
        toast.error("Couldn't share the message");
      });
    } else {
      handleCopyMessage();
      toast.success("Message copied for sharing");
    }
    setShowMobileActions(false);
  };

  // Handle message tap for mobile
  const handleMessageTap = () => {
    if (isMobile) {
      setShowMobileActions(!showMobileActions);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group flex ${
        isUser ? "justify-end" : "justify-start"
      } items-end space-x-2 relative mb-8`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-7 w-7 border-2 border-white shadow-md">
            <AvatarImage src="/ai-avatar.png" />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white">
              <Bot className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={`relative max-w-[85%] min-w-[80px] rounded-2xl px-4 py-2 shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
            : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
        }`}
        onClick={handleMessageTap}
      >
        {/* Message sender name */}
        <div className="text-xs font-semibold mb-1 opacity-80">
          {isUser ? userName : "LifeSync AI"}
        </div>
        
        <div className="prose dark:prose-invert prose-sm max-w-none">
          {message.text}
        </div>
        
        <div className="mt-1 text-xs opacity-70 text-right flex items-center justify-end gap-1">
          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>

        {/* Display reactions if there are any */}
        {reactions.length > 0 && (
          <div className="absolute -bottom-6 left-4 flex items-center space-x-1 bg-white dark:bg-slate-800 rounded-full px-2 py-1 shadow-md border border-slate-200 dark:border-slate-700">
            {reactions.map((emoji, index) => (
              <div 
                key={index} 
                className="text-sm cursor-pointer hover:scale-125 transition-transform"
                title={emoji}
              >
                {emoji}
              </div>
            ))}
          </div>
        )}
        
        {/* Message actions - Desktop */}
        {!isMobile && isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute ${isUser ? 'right-0' : 'left-0'} -top-10 bg-white dark:bg-slate-800 shadow-lg rounded-full px-2 py-1 flex items-center space-x-1 z-10 border border-slate-200 dark:border-slate-700`}
          >
            {/* Emoji reaction button with popover */}
            <Popover open={isReactionPopoverOpen} onOpenChange={setIsReactionPopoverOpen}>
              <PopoverTrigger asChild>
                <button 
                  className="text-muted-foreground hover:text-blue-500 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="Add Reaction"
                >
                  <SmilePlus className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" side="top">
                <div className="grid grid-cols-4 gap-2">
                  {emojiReactions.map((reaction) => (
                    <Button
                      key={reaction.emoji}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddReaction(reaction.emoji)}
                      className="flex flex-col items-center justify-center h-12 w-12 p-0"
                      title={reaction.label}
                    >
                      <span className="text-lg">{reaction.emoji}</span>
                      <span className="text-[10px] text-muted-foreground mt-1">{reaction.label}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Copy button */}
            <button 
              className="text-muted-foreground hover:text-blue-500 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Copy"
              onClick={handleCopyMessage}
            >
              <Copy className="h-4 w-4" />
            </button>

            {/* Share button */}
            <button 
              className="text-muted-foreground hover:text-green-500 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Share"
              onClick={handleShareMessage}
            >
              <Share2 className="h-4 w-4" />
            </button>

            {/* Delete button */}
            {isUser && (
              <button 
                className="text-muted-foreground hover:text-red-500 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Delete"
                onClick={handleDeleteMessage}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        )}

        {/* Message actions - Mobile */}
        {isMobile && showMobileActions && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-x-0 -bottom-14 mx-auto w-[200px] bg-white dark:bg-slate-800 shadow-lg rounded-full px-2 py-1 flex items-center justify-around z-10 border border-slate-200 dark:border-slate-700"
          >
            {/* Emoji reaction button with popover */}
            <Popover open={isReactionPopoverOpen} onOpenChange={setIsReactionPopoverOpen}>
              <PopoverTrigger asChild>
                <button 
                  className="text-muted-foreground p-2 rounded-full"
                >
                  <SmilePlus className="h-5 w-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" side="bottom">
                <div className="grid grid-cols-4 gap-2">
                  {emojiReactions.map((reaction) => (
                    <Button
                      key={reaction.emoji}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddReaction(reaction.emoji)}
                      className="flex flex-col items-center justify-center h-14 w-14 p-0"
                    >
                      <span className="text-xl">{reaction.emoji}</span>
                      <span className="text-[10px] text-muted-foreground mt-1">{reaction.label}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Copy button */}
            <button 
              className="text-muted-foreground p-2 rounded-full"
              onClick={handleCopyMessage}
            >
              <Copy className="h-5 w-5" />
            </button>

            {/* Share button */}
            <button 
              className="text-muted-foreground p-2 rounded-full"
              onClick={handleShareMessage}
            >
              <Share2 className="h-5 w-5" />
            </button>

            {/* Delete button */}
            {isUser && (
              <button 
                className="text-red-500 p-2 rounded-full"
                onClick={handleDeleteMessage}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <Avatar className="h-7 w-7 border-2 border-white shadow-md">
            <AvatarImage src={userPhotoURL} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-600 text-white">
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </motion.div>
  );
} 