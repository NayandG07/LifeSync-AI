import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  MessageSquare, 
  PlusCircle,
  User,
  X,
  Loader2,
  Edit,
  Check
} from "lucide-react";
import { saveChatMessage, getMessages, deleteMessages, deleteAllMessages } from "@/lib/firebase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { generateGemmaResponse } from "@/lib/gemma";
import { Message, ChatTab } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Import our new components
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import ChatSidebar from "@/components/chat/ChatSidebar";
import TypingIndicator from "@/components/chat/TypingIndicator";

// Welcome messages for new chats
const welcomeMessages = [
  "Hello! I'm your AI health companion. I'm here to listen and support you. How are you feeling today?",
  "Welcome to LifeSync Chat! I'm here to help with your wellness journey. How can I assist you today?",
  "Hi there! I'm your personal wellness assistant. How are you doing today?",
  "Welcome! I'm here to provide support and guidance for your well-being. How are you feeling right now?"
];

// Get a random welcome message
const getRandomWelcomeMessage = () => {
  const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
  return welcomeMessages[randomIndex];
};

// Message suggestions for the user
const defaultSuggestions = [
  "How can I improve my sleep?",
  "I'm feeling anxious today",
  "What are some stress management techniques?",
  "Help me track my mood",
  "What foods are good for mental health?"
];

// Get a new chat number based on existing chat names
const getNextChatNumber = (tabs: ChatTab[]) => {
  const existingNumbers = tabs
    .map(tab => {
      const match = tab.name.match(/^Chat (\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => !isNaN(num));
  
  if (existingNumbers.length === 0) return 1;
  return Math.max(...existingNumbers) + 1;
};

export default function ChatEnhanced() {
  // State for tabs
  const [tabs, setTabs] = useState<ChatTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");
  
  // Other state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user, loading, signInWithGoogle } = useAuth();
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  
  // New UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(defaultSuggestions);
  const [isMobile, setIsMobile] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const chatNameInputRef = useRef<HTMLInputElement>(null);

  // Check if the window is mobile-sized
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      // Auto-hide sidebar on mobile
      if (isMobileView) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close a tab
  const closeTab = async (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Don't close if it's the only tab
    if (tabs.length <= 1) return;
    
    // Get the tab to be closed
    const tabToClose = tabs.find(tab => tab.id === tabId);
    
    // Delete messages from Firebase if user is logged in
    if (user && tabToClose) {
      try {
        // Get message IDs from the tab
        const messageIds = tabToClose.messages.map(msg => msg.id);
        
        // Delete messages from Firebase
        await Promise.all(messageIds.map(id => deleteMessages(user.uid, id)));
      } catch (error) {
        console.error("Error deleting messages:", error);
      }
    }
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    // If closing the active tab, switch to another tab
    if (tabId === activeTabId) {
      setActiveTabId(newTabs[0].id);
      setMessages(newTabs[0].messages);
    }
    
    // Save the updated tabs list to localStorage
    localStorage.setItem(`chat_tabs_${user?.uid}`, JSON.stringify(newTabs));
  };

  // Switch to a tab
  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setMessages(tab.messages);
    }
    
    // Close sidebar on mobile after tab selection
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Load messages from Firebase and restore tabs
  useEffect(() => {
    const loadMessages = async () => {
      if (user) {
        try {
          // Try to load tabs from localStorage first
          const savedTabsJSON = localStorage.getItem(`chat_tabs_${user.uid}`);
          let savedTabs: ChatTab[] = [];
          
          if (savedTabsJSON) {
            try {
              savedTabs = JSON.parse(savedTabsJSON);
              // Convert string dates back to Date objects
              savedTabs = savedTabs.map(tab => ({
                ...tab,
                createdAt: new Date(tab.createdAt),
                lastUpdated: new Date(tab.lastUpdated),
                messages: tab.messages.map(msg => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp)
                }))
              }));
            } catch (e) {
              console.error("Error parsing saved tabs:", e);
              savedTabs = [];
            }
          }
          
          if (savedTabs.length > 0) {
            // Use saved tabs
            setTabs(savedTabs);
            setActiveTabId(savedTabs[0].id);
            setMessages(savedTabs[0].messages);
          } else {
            // Fallback to loading messages from Firebase
            const savedMessages = await getMessages(user.uid);
            if (savedMessages.length > 0) {
              // Create a tab with saved messages
              const savedTab: ChatTab = {
                id: Date.now().toString(),
                name: "Previous Chat",
                messages: savedMessages,
                createdAt: new Date(savedMessages[0].timestamp),
                lastUpdated: new Date(savedMessages[savedMessages.length - 1].timestamp)
              };
              setTabs([savedTab]);
              setActiveTabId(savedTab.id);
              setMessages(savedMessages);
              
              // Save to localStorage
              localStorage.setItem(`chat_tabs_${user.uid}`, JSON.stringify([savedTab]));
            } else {
              // Create a new tab with welcome message
              createNewTab();
            }
          }
        } catch (error) {
          console.error("Error loading messages:", error);
          createNewTab();
        }
      }
    };
    
    if (user && tabs.length === 0) {
      loadMessages();
    }
  }, [user]);

  // Improved auto-scroll function with more robust implementation
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      // Try different methods to find the scrollable element
      const scrollableElement = 
        // First try using data attribute
        scrollElement.querySelector('[data-radix-scroll-area-viewport]') || 
        // Then try using class names that might be used by the ScrollArea component
        scrollElement.querySelector('.scroll-area-viewport') ||
        // Then try the first div child which is likely the viewport
        scrollElement.querySelector('div > div') ||
        // Fallback to the ref itself
        scrollElement;
      
      if (scrollableElement) {
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          scrollableElement.scrollTop = scrollableElement.scrollHeight;
        });
      }
    }
  };

  // Make sure we scroll when messages change and when isTyping changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      scrollToBottom();
    }
  }, [isTyping]);

  // Add debugging for loading state
  useEffect(() => {
    console.log("Message loading state changed:", isMessageLoading);
    
    if (isMessageLoading) {
      console.log("AI is typing...");
      scrollToBottom();
    } else {
      console.log("AI finished typing");
    }
  }, [isMessageLoading]);

  // Also scroll to bottom when a new tab is selected
  useEffect(() => {
    scrollToBottom();
  }, [activeTabId]);

  // Create a new tab
  const createNewTab = () => {
    const newTabId = Date.now().toString();
    const nextChatNumber = getNextChatNumber(tabs);
    
    // Only include welcome message for truly new tabs
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: getRandomWelcomeMessage(),
      sender: 'bot',
      timestamp: new Date()
    };
    
    const newTab: ChatTab = {
      id: newTabId,
      name: `Chat ${nextChatNumber}`,
      messages: [welcomeMessage],
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    const updatedTabs = [...tabs, newTab];
    setTabs(updatedTabs);
    setActiveTabId(newTabId);
    setMessages([welcomeMessage]); // Set just this tab's messages
    
    // Save welcome message if user is logged in
    if (user) {
      saveChatMessage(user.uid, welcomeMessage);
      
      // Save updated tabs to localStorage
      localStorage.setItem(`chat_tabs_${user.uid}`, JSON.stringify(updatedTabs));
    }
    
    // Close sidebar on mobile after creating a new tab
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Update localStorage when tabs change
  useEffect(() => {
    if (user && tabs.length > 0) {
      localStorage.setItem(`chat_tabs_${user.uid}`, JSON.stringify(tabs));
    }
  }, [tabs, user]);

  // Handler for deleting all conversations
  const handleAfterDeleteAll = () => {
    // Clear existing tabs state
    setTabs([]);
    
    // Create a fresh new tab with slight delay to ensure state is updated
    setTimeout(() => {
      const newTabId = Date.now().toString();
      
      // Create welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: getRandomWelcomeMessage(),
        sender: 'bot',
        timestamp: new Date()
      };
      
      // Create new tab
      const newTab: ChatTab = {
        id: newTabId,
        name: `Chat 1`,
        messages: [welcomeMessage],
        createdAt: new Date(),
        lastUpdated: new Date()
      };
      
      // Update state
      setTabs([newTab]);
      setActiveTabId(newTabId);
      setMessages([welcomeMessage]);
      
      // Save to Firebase if user is logged in
      if (user) {
        saveChatMessage(user.uid, welcomeMessage);
        localStorage.setItem(`chat_tabs_${user.uid}`, JSON.stringify([newTab]));
      }
    }, 100);
  };

  // Update chat name based on context
  useEffect(() => {
    // Only update name if the tab has default naming pattern and we have messages
    if (activeTabId && messages.length > 0) {
      const currentTab = tabs.find(tab => tab.id === activeTabId);
      if (currentTab && currentTab.name.match(/^Chat \d+$/)) {
        // Find the first user message to use for naming
        const firstUserMessage = messages.find(msg => msg.sender === 'user');
        if (firstUserMessage) {
          // Trim and limit length for the name
          let newName = firstUserMessage.text.trim();
          if (newName.length > 30) {
            newName = newName.substring(0, 27) + '...';
          }
          
          // Update the tab name
          const updatedTabs = tabs.map(tab => 
            tab.id === activeTabId ? { ...tab, name: newName } : tab
          );
          
          setTabs(updatedTabs);
          
          // Save updated tabs to localStorage
          if (user) {
            localStorage.setItem(`chat_tabs_${user.uid}`, JSON.stringify(updatedTabs));
          }
        }
      }
    }
  }, [messages, activeTabId, user]);

  // Start editing chat name
  const startEditingName = () => {
    const currentTab = tabs.find(tab => tab.id === activeTabId);
    if (currentTab) {
      setEditedName(currentTab.name);
      setIsEditingName(true);
      // Focus the input field after it's rendered
      setTimeout(() => {
        if (chatNameInputRef.current) {
          chatNameInputRef.current.focus();
        }
      }, 50);
    }
  };

  // Save edited chat name
  const saveEditedName = () => {
    if (editedName.trim()) {
      const updatedTabs = tabs.map(tab => 
        tab.id === activeTabId ? { ...tab, name: editedName.trim() } : tab
      );
      
      setTabs(updatedTabs);
      setIsEditingName(false);
      
      // Save updated tabs to localStorage
      if (user) {
        localStorage.setItem(`chat_tabs_${user.uid}`, JSON.stringify(updatedTabs));
      }
    } else {
      cancelEditingName();
    }
  };

  // Cancel editing chat name
  const cancelEditingName = () => {
    setIsEditingName(false);
  };

  // Handle keydown events for the name editing input
  const handleNameInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveEditedName();
    } else if (e.key === 'Escape') {
      cancelEditingName();
    }
  };

  const handleSendMessage = async (messageText: string) => {
    try {
      if (!messageText.trim()) return;
      
      // Create user message
      const userMsg: Message = {
        id: uuidv4(),
        text: messageText,
        sender: 'user',
        timestamp: new Date()
      };
      
      // Add user message to state
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      
      // Set loading state immediately to show typing indicator
      setIsMessageLoading(true);
      
      // Clear input after sending
      setInput("");
      
      // Scroll to bottom immediately to show typing indicator
      requestAnimationFrame(() => {
        scrollToBottom();
      });
      
      // Update tabs with the new message
      const updatedTabs = tabs.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, messages: [...tab.messages, userMsg], lastUpdated: new Date() }
          : tab
      );
      setTabs(updatedTabs);
      
      // Save to localStorage for persistence
      localStorage.setItem(`chat_tabs_${user?.uid}`, JSON.stringify(updatedTabs));
      
      // Save to Firebase if user is logged in
      if (user) {
        try {
          await saveChatMessage(user.uid, userMsg);
        } catch (saveError) {
          console.error("Error saving message:", saveError);
        }
      }
      
      // Convert messages to format expected by Gemma API
      const gemmaMessages = updatedMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));
      
      try {
        // Add a slight delay to make the typing indicator more noticeable
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Call the Gemma API through our proxy function
        const response = await generateGemmaResponse(
          gemmaMessages, 
          messageText
        );
        
        // Create bot message with the response
        const botMsg: Message = {
          id: uuidv4(),
          text: response,
          sender: 'bot',
          timestamp: new Date()
        };
        
        // Add bot message to state
        const messagesWithResponse = [...updatedMessages, botMsg];
        setMessages(messagesWithResponse);
        
        // Update tabs with the bot message
        const tabsWithResponse = updatedTabs.map(tab => 
          tab.id === activeTabId 
            ? { ...tab, messages: [...tab.messages, botMsg], lastUpdated: new Date() }
            : tab
        );
        setTabs(tabsWithResponse);
        
        // Save to localStorage
        localStorage.setItem(`chat_tabs_${user?.uid}`, JSON.stringify(tabsWithResponse));
        
        // Save to Firebase if user is logged in
        if (user) {
          try {
            await saveChatMessage(user.uid, botMsg);
          } catch (saveError) {
            console.error("Error saving bot message:", saveError);
          }
        }
        
        // Update suggestions based on context
        if (messageText.toLowerCase().includes("anxiety") || response.toLowerCase().includes("anxiety")) {
          setSuggestions([
            "What are symptoms of anxiety?",
            "How can I manage anxiety?",
            "Are there breathing exercises for anxiety?",
            "What foods can help reduce anxiety?",
            "What's the difference between anxiety and stress?"
          ]);
        } else if (messageText.toLowerCase().includes("sleep") || response.toLowerCase().includes("sleep")) {
          setSuggestions([
            "How can I improve my sleep quality?",
            "What's the ideal sleep schedule?",
            "What foods help with sleep?",
            "How does screen time affect sleep?",
            "What are good bedtime routines?"
          ]);
        } else if (messageText.toLowerCase().includes("stress") || response.toLowerCase().includes("stress")) {
          setSuggestions([
            "What are effective stress management techniques?",
            "How does stress affect the body?",
            "What are good stress-relieving activities?",
            "How can I reduce work stress?",
            "What's the connection between stress and health?"
          ]);
        }
      } catch (error) {
        console.error("Error getting response from AI:", error);
        
        // Create error message
        const errorMsg: Message = {
          id: uuidv4(),
          text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          sender: 'bot',
          timestamp: new Date()
        };
        
        // Add error message to state
        setMessages([...updatedMessages, errorMsg]);
        
        // Update tabs with the error message
        const tabsWithError = updatedTabs.map(tab => 
          tab.id === activeTabId 
            ? { ...tab, messages: [...tab.messages, errorMsg], lastUpdated: new Date() }
            : tab
        );
        setTabs(tabsWithError);
        
        // Save to localStorage
        localStorage.setItem(`chat_tabs_${user?.uid}`, JSON.stringify(tabsWithError));
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
    } finally {
      // Make sure to turn off loading state
      setIsMessageLoading(false);
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Find the message in the current tab
      const currentTab = tabs.find(tab => tab.id === activeTabId);
      if (!currentTab) return;

      // Remove the message from the tab and update state
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      setMessages(updatedMessages);

      // Update tabs state
      const updatedTabs = tabs.map(tab => 
        tab.id === activeTabId 
          ? { 
              ...tab, 
              messages: tab.messages.filter(msg => msg.id !== messageId),
              lastUpdated: new Date()
            }
          : tab
      );
      setTabs(updatedTabs);

      // Save to localStorage
      localStorage.setItem(`chat_tabs_${user?.uid}`, JSON.stringify(updatedTabs));

      // Delete from Firebase if user is logged in
      if (user) {
        await deleteMessages(user.uid, messageId);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your chats...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 max-w-md w-full shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Avatar className="h-16 w-16 border-4 border-white shadow-md bg-gradient-to-br from-blue-500 to-indigo-600">
                  <AvatarImage src="/ai-avatar.png" />
                  <AvatarFallback>
                    <Bot className="h-8 w-8 text-white" />
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Welcome to LifeSync Chat</h2>
            <p className="text-center mb-8 text-slate-600 dark:text-slate-400">Your personal AI wellness companion is ready to help you on your journey to better health and happiness</p>
            <Button onClick={signInWithGoogle} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 py-6">
              <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
              <span>Sign in with Google</span>
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - conditionally rendered based on state for mobile */}
      <div className={`fixed md:relative z-20 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 h-full`}>
        <ChatSidebar 
          tabs={tabs}
          activeTabId={activeTabId}
          onTabSelect={switchTab}
          onTabClose={closeTab}
          onCreateTab={createNewTab}
          onClose={() => setIsSidebarOpen(false)}
          onDeleteAllChats={handleAfterDeleteAll}
          user={user}
          isMobile={isMobile}
        />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 w-full">
        {/* Chat header */}
        <div className="px-4 py-2 border-b bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(true)}
              className="mr-2 md:hidden"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            
            {isEditingName ? (
              <div className="flex items-center">
                <input
                  ref={chatNameInputRef}
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={handleNameInputKeyDown}
                  onBlur={saveEditedName}
                  className="border-0 bg-transparent focus:outline-none focus:ring-0 text-sm font-medium w-full max-w-[180px]"
                  maxLength={30}
                />
                <Button 
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1 flex-shrink-0"
                  onClick={saveEditedName}
                >
                  <Check className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center overflow-hidden">
                <h1 
                  className="font-medium text-sm cursor-pointer group flex items-center truncate max-w-[120px] sm:max-w-[200px] md:max-w-none"
                  onClick={startEditingName}
                  title="Click to rename this chat"
                >
                  <span className="truncate">{tabs.find(tab => tab.id === activeTabId)?.name || "Chat"}</span>
                  <Edit className="h-3.5 w-3.5 ml-1.5 text-blue-500 opacity-80 group-hover:opacity-100 flex-shrink-0" />
                </h1>
                <p className="text-xs text-muted-foreground ml-2 hidden sm:block">
                  {tabs.find(tab => tab.id === activeTabId)?.messages.length || 0} messages
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Button 
              onClick={createNewTab} 
              size="sm" 
              variant="ghost"
              className="h-8 px-2"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-0 sm:mr-1" />
              <span className="text-xs hidden sm:inline">New Chat</span>
            </Button>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full p-4">
            <div className="space-y-4 max-w-3xl mx-auto pt-4">
              {tabs.length > 0 && activeTabId && messages.length === 0 && (
                <div className="flex items-center justify-center h-full py-12">
                  <div className="text-center space-y-4">
                    <Bot className="h-12 w-12 mx-auto text-blue-500 opacity-50" />
                    <h3 className="font-medium text-lg">Start a new conversation</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                      Your AI wellness companion is ready to help with any health, wellness, or mental well-being questions
                    </p>
                  </div>
                </div>
              )}
              
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  userPhotoURL={user.photoURL || undefined}
                  isLast={index === messages.length - 1}
                  onDelete={handleDeleteMessage}
                />
              ))}
              
              {/* Typing indicator - explicitly visible when loading */}
              {isMessageLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <TypingIndicator />
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Chat input */}
        <ChatInput 
          onSendMessage={handleSendMessage}
          isLoading={isMessageLoading}
          suggestions={suggestions}
          value={input}
          onChange={setInput}
        />
      </div>
    </div>
  );
} 