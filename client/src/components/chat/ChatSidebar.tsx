import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  MessageSquare, 
  PlusCircle, 
  User, 
  X, 
  Trash, 
  Edit, 
  Menu,
  Search,
  History,
  Zap,
  Sparkles,
  Star
} from "lucide-react";
import { ChatTab } from "@/lib/types";
import { User as FirebaseUser } from "firebase/auth";
import { format } from "date-fns";
import { deleteAllMessages } from "@/lib/firebase";
import { toast } from "sonner";

interface ChatSidebarProps {
  tabs: ChatTab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string, e: React.MouseEvent) => void;
  onCreateTab: () => void;
  onClose: () => void;
  onDeleteAllChats: () => void;
  onToggleFavorite: (tabId: string) => void;
  user: FirebaseUser;
  isMobile: boolean;
}

export default function ChatSidebar({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onCreateTab,
  onClose,
  onDeleteAllChats,
  onToggleFavorite,
  user,
  isMobile
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'recent' | 'favorites'>('all');
  
  // Filter tabs based on search query and category
  const filteredTabs = tabs
    .filter(tab => {
      // First filter by search query
      const matchesSearch = !searchQuery || 
        tab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tab.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesSearch) return false;
      
      // Then filter by category
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'recent') {
        // Show chats from last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        return new Date(tab.lastUpdated) >= oneDayAgo;
      }
      // Filter favorites based on the favorite flag
      if (selectedCategory === 'favorites') return tab.favorite === true;
      
      return true;
    })
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  // Get user's name from profile
  useEffect(() => {
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        const { name } = JSON.parse(userProfile);
        if (name) {
          setUserName(name);
        } else {
          setUserName(user.displayName || user.email?.split('@')[0] || "User");
        }
      } catch (error) {
        console.error("Error parsing user profile:", error);
        setUserName(user.displayName || user.email?.split('@')[0] || "User");
      }
    } else {
      setUserName(user.displayName || user.email?.split('@')[0] || "User");
    }
  }, [user]);

  // Function to delete all conversations
  const handleDeleteAllConversations = async () => {
    try {
      setIsDeleteDialogOpen(false);
      
      // Delete all messages from Firebase/localStorage
      await deleteAllMessages(user.uid);
      
      // Clear the tabs in localStorage
      localStorage.setItem(`chat_tabs_${user.uid}`, JSON.stringify([]));
      
      // Call the parent component's handler to create a new conversation
      onDeleteAllChats();
      
      toast.success("All conversations deleted successfully!");
    } catch (error) {
      console.error("Error deleting conversations:", error);
      toast.error("Failed to delete conversations. Please try again.");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Header with improved visual style */}
      <motion.div 
        className="p-4 border-b flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
        initial={false}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-3 ring-2 ring-blue-100 dark:ring-blue-900">
            <AvatarImage src="/ai-avatar.png" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-blue-700 dark:text-blue-400">LifeSync Chat</h1>
            <p className="text-xs text-blue-500/70 dark:text-blue-400/70 font-medium">AI Wellness Companion</p>
          </div>
        </div>
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </motion.div>
      
      {/* New Chat button with shadow and gradient */}
      <div className="p-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={onCreateTab} 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 py-5 font-medium"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>New Conversation</span>
          </Button>
        </motion.div>
      </div>
      
      {/* Search with icon */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm pl-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="px-4 pt-1 pb-2">
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedCategory('all')}
            className={`flex-1 ${selectedCategory === 'all' ? 
              'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 
              'text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'}`}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">All</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedCategory('recent')}
            className={`flex-1 ${selectedCategory === 'recent' ? 
              'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 
              'text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'}`}
          >
            <History className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Recent</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedCategory('favorites')}
            className={`flex-1 ${selectedCategory === 'favorites' ? 
              'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 
              'text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'}`}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Favorites</span>
          </Button>
        </div>
      </div>
      
      {/* Conversation list with improved scrolling and animations */}
      <ScrollArea className="flex-1 px-2 pb-4">
        <AnimatePresence>
          <div className="space-y-1.5 py-2">
            {filteredTabs.length > 0 ? (
              filteredTabs.map(tab => (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  layout
                  onClick={() => onTabSelect(tab.id)}
                  className={`flex items-center px-3 py-2.5 rounded-md cursor-pointer text-sm group transition-all ${
                    tab.id === activeTabId
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-l-2 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-400"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1 duration-200"
                  }`}
                >
                  <div className={`flex items-center justify-center h-7 w-7 rounded-full mr-2 flex-shrink-0 ${
                    tab.id === activeTabId ? 
                      'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 
                      'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-semibold truncate flex items-center">
                      {tab.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center">
                      <span className="mr-1.5">{format(new Date(tab.lastUpdated), "MMM d, h:mm a")}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                      <span className="ml-1.5">{tab.messages.length} messages</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {/* Favorite Star Button */}
                    <motion.button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tab.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-1.5 rounded-full transition-colors ${
                        tab.favorite 
                          ? 'text-yellow-400 hover:text-yellow-500' 
                          : 'text-slate-400 hover:text-yellow-400 dark:text-slate-500 dark:hover:text-yellow-400'
                      } ${tab.favorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      aria-label={tab.favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star className="h-4 w-4" fill={tab.favorite ? "currentColor" : "none"} />
                    </motion.button>
                    
                    {/* Close Button */}
                    <motion.button 
                      onClick={(e) => onTabClose(tab.id, e)}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 mt-2"
              >
                <div className="bg-slate-100 dark:bg-slate-800 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {searchQuery ? "No conversations found" : "No conversations yet"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 text-center max-w-[200px]">
                  {searchQuery ? "Try a different search term" : "Start a new conversation to chat with your AI companion"}
                </p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </ScrollArea>
      
      {/* User info with better styling */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center">
            <Avatar className="h-9 w-9 mr-3 ring-2 ring-slate-200 dark:ring-slate-700">
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="font-semibold truncate text-slate-800 dark:text-slate-200">{userName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {tabs.length} conversation{tabs.length !== 1 ? 's' : ''} · LifeSync Member
              </div>
            </div>
          </div>
        </div>

        {/* Delete all button with improved styling */}
        <div className="px-4 pb-4">
          <Button 
            variant="outline" 
            className="w-full text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 border-red-200 dark:border-red-900/30 transition-colors group"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
            Delete All Conversations
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog with improved animation */}
      <AnimatePresence>
        {isDeleteDialogOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-200">Delete All Conversations</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete all conversations? This action cannot be undone.
              </p>
              <div className="flex space-x-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAllConversations}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 