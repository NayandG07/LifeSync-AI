import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { 
  Home,
  LayoutDashboard, 
  MessageSquare, 
  Activity,
  UserCircle, 
  LogOut,
  LogIn,
  Settings,
  Bell,
  Menu as MenuIcon,
  LineChart,
  BarChart,
  BarChart2,
  User,
  X,
  Info,
  Check,
  Sparkles,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import HamburgerMenu from '../HamburgerMenu';

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female';
  profileImage?: string;
}

interface NavbarProps {
  onProfileClick: () => void;
}

// Navigation Link component
interface NavLinkProps {
  path: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}

const NavLink = ({ path, label, icon: Icon, onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  // For mobile view in the menu
  const mobileClasses = "flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300";
  const mobileActiveClasses = "bg-gradient-to-r from-purple-500/10 to-violet-600/20 text-purple-700 font-medium shadow-sm";
  const mobileInactiveClasses = "text-gray-700 hover:bg-purple-50";
  
  // For desktop view in the navbar
  const desktopClasses = "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors";
  const desktopActiveClasses = "bg-primary/10 text-primary hover:bg-primary/15";
  const desktopInactiveClasses = "text-muted-foreground hover:bg-primary/10 hover:text-primary";
  
  const isMobile = window.innerWidth < 768;
  
  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        isMobile ? mobileClasses : desktopClasses,
        isActive 
          ? (isMobile ? mobileActiveClasses : desktopActiveClasses)
          : (isMobile ? mobileInactiveClasses : desktopInactiveClasses)
      )}
    >
      <Icon className={cn(
        "transition-transform", 
        isMobile ? "w-5 h-5 mr-3" : "w-5 h-5",
        isActive ? "text-purple-600" : "text-gray-500"
      )} />
      <span className={cn(
        "transition-colors",
        isActive && isMobile ? "font-medium" : ""
      )}>{label}</span>
      
      {isActive && isMobile && (
        <div className="ml-auto">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
        </div>
      )}
    </Link>
  );
};

const Navbar = ({ onProfileClick }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState(auth.currentUser);
  const [initials, setInitials] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Navigation links
  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/chat-enhanced', label: 'Chat', icon: MessageSquare },
  ];

  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setEditProfile(JSON.parse(savedProfile));
    }

    // Remove theme-related code and always use light theme
    document.documentElement.classList.remove('dark-theme');
    setIsDarkTheme(false);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          const { name, profileImage } = JSON.parse(userProfile);
          if (name) {
            const nameParts = name.split(' ');
            const firstInitial = nameParts[0] ? nameParts[0][0] : '';
            const lastInitial = nameParts[1] ? nameParts[1][0] : '';
            setInitials(`${firstInitial}${lastInitial}`);
          }
          if (profileImage) {
            setProfileImage(profileImage);
          }
        }
      }
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Update state
    setUserProfile(updatedProfile);
    
    // Save to Firestore if user is logged in
    if (auth.currentUser) {
      try {
        const userId = auth.currentUser.uid;
        updateDoc(doc(db, 'users', userId), {
          profile: updatedProfile,
          updatedAt: new Date()
        }).then(() => {
          toast.success("Profile updated in database!");
        }).catch(err => {
          console.error("Error updating profile in database:", err);
          toast.error("Failed to update profile in database, but saved locally");
        });
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
    
    // Close modal
    setShowProfileModal(false);
    setIsProfileModalOpen(false);
    
    toast.success("Profile updated successfully!");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userProfile'); // Clear user profile from local storage
      navigate('/'); // Redirect to home page after sign out
      toast.success("You have been signed out.");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const handleSaveProfile = () => {
    if (editProfile) {
      // Save to localStorage
      localStorage.setItem("userProfile", JSON.stringify(editProfile));
      
      // Update state
      setUserProfile(editProfile);
      
      // Save to Firestore if user is logged in
      if (auth.currentUser) {
        try {
          const userId = auth.currentUser.uid;
          updateDoc(doc(db, 'users', userId), {
            profile: editProfile,
            updatedAt: new Date()
          }).then(() => {
            toast.success("Profile updated in database!");
          }).catch(err => {
            console.error("Error updating profile in database:", err);
            toast.error("Failed to update profile in database, but saved locally");
          });
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      }
      
      // Close modal
      setIsProfileModalOpen(false);
      
      toast.success("Profile updated successfully!");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const ProfileModal = () => {
    const [formData, setFormData] = useState<UserProfile>(
      userProfile || {
        name: '',
        age: 0,
        height: 0,
        weight: 0,
        gender: 'male'
      }
    );

    const handleInputChange = (field: keyof UserProfile, value: any) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleProfileUpdate(formData);
    };

    return (
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white via-blue-50 to-indigo-50 backdrop-blur-xl border border-blue-200/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] opacity-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
          
          <DialogHeader className="relative">
            <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              Personal Details
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Please fill in your details to personalize your experience
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4 relative">
            {/* Name Input */}
            <div className="space-y-2 group">
              <Label htmlFor="name" className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white/50 border-blue-200/50 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 backdrop-blur-sm"
                required
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg blur-xl"></div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gender
              </Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" className="border-blue-400/50 text-blue-600" />
                  <Label htmlFor="male" className="text-gray-700">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" className="border-blue-400/50 text-blue-600" />
                  <Label htmlFor="female" className="text-gray-700">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" className="border-blue-400/50 text-blue-600" />
                  <Label htmlFor="other" className="text-gray-700">Other</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Age Input */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                placeholder="25"
                min="0"
                max="120"
                className="w-full bg-white/50 border-blue-200/50 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 backdrop-blur-sm"
                required
              />
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                placeholder="70"
                step="0.1"
                min="0"
                className="w-full bg-white/50 border-blue-200/50 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 backdrop-blur-sm"
                required
              />
            </div>

            {/* Height Input */}
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Height (metres)
              </Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ''}
                onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                placeholder="1.75"
                step="0.01"
                min="0"
                className="w-full bg-white/50 border-blue-200/50 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 backdrop-blur-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Save Profile</span>
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Activity,
    },
    {
      name: "Mood Tracking",
      href: "/mood",
      icon: LineChart,
    },
    {
      name: "Health Metrics",
      href: "/health",
      icon: BarChart,
    },
    {
      name: "MoodAI Chat",
      href: "/chat",
      icon: MessageSquare,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-[2px] border-blue-200/30 bg-white/95 backdrop-blur-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]">
      {/* AI-inspired animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08)_0%,transparent_50%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.08)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent backdrop-blur-xl"></div>
      
      {/* 3D border effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-[1px] h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-sm"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="container flex h-16 items-center px-8 md:px-12 lg:px-16 max-w-6xl mx-auto relative"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2"
        >
          <Link to="/" className="flex items-center gap-2 mr-6 relative group">
            {/* 3D glow effect for logo */}
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            
            <Activity className="h-6 w-6 text-blue-600 transform group-hover:rotate-12 transition-transform duration-300 relative" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent relative">
              LifeSync
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </span>
          </Link>
        </motion.div>
        
        <div className="flex-1" />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 mr-4">
          {navLinks.map((link) => (
            <NavLink key={link.path} {...link} />
          ))}
        </div>
        
        {/* Mobile Hamburger Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden mr-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg hover:shadow-purple-400/20 transition-all duration-300"
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-white/95 backdrop-blur-xl border-r border-blue-200/30">
            <div className="flex flex-col h-full">
              <div className="py-6 px-6 border-b border-blue-200/30 bg-gradient-to-r from-purple-500/10 to-violet-600/10">
                <div className="flex items-center gap-3">
                  <Activity className="h-7 w-7 text-purple-600" />
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    LifeSync
                  </span>
                </div>
              </div>
              
              <div className="pt-4 pb-2 px-4">
                <p className="text-sm font-medium text-gray-500">Navigation</p>
              </div>
              
              <nav className="flex-1 px-3">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.path}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <NavLink
                        key={link.path}
                        {...link}
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-blue-200/30">
                  <div className="px-3 py-2 rounded-lg bg-purple-50 mb-4">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white mr-3">
                        <Bell className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-sm text-purple-700">Quick Access</span>
                    </div>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/settings');
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-purple-100 transition-colors"
                    >
                      <Settings className="mr-2 h-4 w-4 text-purple-600" />
                      Settings
                    </button>
                    {user && (
                      <button 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onProfileClick();
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-purple-100 transition-colors"
                      >
                        <User className="mr-2 h-4 w-4 text-purple-600" />
                        Profile
                      </button>
                    )}
                  </div>
                </div>
              </nav>
              
              {user && (
                <div className="p-4 border-t border-blue-200/30">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center justify-end space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden group">
                {/* 3D glow effect for avatar */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                
                <Avatar className="h-10 w-10 transform group-hover:scale-105 transition-all duration-300 ring-2 ring-white/20">
                  <AvatarImage 
                    src={auth.currentUser?.photoURL || profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600">
                    {auth.currentUser?.displayName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {/* Animated ring effect */}
                <motion.div
                  className="absolute -inset-1 rounded-full border-2 border-blue-500/30"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 p-2 bg-white/90 backdrop-blur-xl border border-blue-200/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)]">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  id="profile-trigger"
                  onClick={onProfileClick}
                  className="cursor-pointer relative group px-4 py-2.5 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <User className="mr-2 h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Personal Details</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="cursor-pointer text-red-600 group px-4 py-2.5 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100"
                >
                  <LogOut className="mr-2 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar; 