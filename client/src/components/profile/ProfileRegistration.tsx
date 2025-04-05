import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface ProfileRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  height: number;
  heightUnit: 'cm' | 'm' | 'ft';
  weight: number;
  weightUnit: 'kg' | 'lbs';
  profileImage?: string;
}

const ProfileRegistration = ({ isOpen, onClose }: ProfileRegistrationProps) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    gender: 'male',
    age: 0,
    height: 0,
    heightUnit: 'm',
    weight: 0,
    weightUnit: 'kg',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  });
  const [imagePreview, setImagePreview] = useState<string>('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');
  const [avatarSeed, setAvatarSeed] = useState<string>('Felix');
  const [avatarStyle, setAvatarStyle] = useState<string>('avataaars');
  
  // Available avatar styles from DiceBear
  const avatarStyles = [
    { id: 'avataaars', name: 'Avataaars' },
    { id: 'bottts', name: 'Bottts' },
    { id: 'pixel-art', name: 'Pixel Art' },
    { id: 'lorelei', name: 'Lorelei' },
    { id: 'micah', name: 'Micah' },
    { id: 'personas', name: 'Personas' },
    { id: 'initials', name: 'Initials' }
  ];

  // Load profile data from Firebase on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.profile) {
              setProfile(userData.profile);
              if (userData.profile.profileImage) {
                setImagePreview(userData.profile.profileImage);
                
                // Extract seed and style from URL if it's a DiceBear avatar
                if (userData.profile.profileImage.includes('dicebear')) {
                  const url = new URL(userData.profile.profileImage);
                  const style = url.pathname.split('/')[2];
                  const seed = url.searchParams.get('seed') || 'Felix';
                  setAvatarSeed(seed);
                  setAvatarStyle(style);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          toast.error('Failed to load profile data');
        }
      }
    };

    loadProfile();
  }, []);

  const convertHeight = (value: number, from: string, to: string): number => {
    if (from === to) return value;
    switch (from) {
      case 'm':
        return to === 'cm' ? value * 100 : value * 3.28084;
      case 'cm':
        return to === 'm' ? value / 100 : value * 0.0328084;
      case 'ft':
        return to === 'm' ? value / 3.28084 : value * 30.48;
      default:
        return value;
    }
  };

  const convertWeight = (value: number, from: string, to: string): number => {
    if (from === to) return value;
    return from === 'kg' ? value * 2.20462 : value / 2.20462;
  };

  const handleUnitChange = (type: 'height' | 'weight', newUnit: string) => {
    const currentValue = profile[type];
    const currentUnit = profile[`${type}Unit`];
    const convertedValue = type === 'height' 
      ? convertHeight(currentValue, currentUnit, newUnit)
      : convertWeight(currentValue, currentUnit, newUnit);
    
    setProfile(prev => ({
      ...prev,
      [type]: Number(convertedValue.toFixed(2)),
      [`${type}Unit`]: newUnit
    }));
  };

  const validateProfile = () => {
    if (!profile.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }

    if (profile.name.length < 2) {
      toast.error("Name should be at least 2 characters long");
      return false;
    }

    if (!profile.age || profile.age < 0 || profile.age > 120) {
      toast.error("Please enter a valid age between 0 and 120");
      return false;
    }

    const minHeight = profile.heightUnit === 'm' ? 0.5 : 
                     profile.heightUnit === 'cm' ? 50 : 1.64;
    const maxHeight = profile.heightUnit === 'm' ? 2.5 : 
                     profile.heightUnit === 'cm' ? 250 : 8.2;
    
    if (!profile.height || profile.height < minHeight || profile.height > maxHeight) {
      toast.error(`Please enter a valid height between ${minHeight} and ${maxHeight} ${profile.heightUnit}`);
      return false;
    }

    const minWeight = profile.weightUnit === 'kg' ? 20 : 44;
    const maxWeight = profile.weightUnit === 'kg' ? 300 : 661;
    
    if (!profile.weight || profile.weight < minWeight || profile.weight > maxWeight) {
      toast.error(`Please enter a valid weight between ${minWeight} and ${maxWeight} ${profile.weightUnit}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateProfile()) return;

    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        
        // Save to Firestore with retry mechanism
        let retries = 3;
        while (retries > 0) {
          try {
            await setDoc(doc(db, 'users', userId), {
              profile,
              updatedAt: new Date(),
            }, { merge: true });
            break;
          } catch (error) {
            retries--;
            if (retries === 0) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
          }
        }
        
        // Update localStorage after successful Firebase update
        localStorage.setItem('userProfile', JSON.stringify(profile));
        toast.success("Profile saved successfully!");
        onClose();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  // Generate a consistent seed from a name
  const generateSeedFromName = (name: string): string => {
    // If name is empty, return a default seed
    if (!name || name.trim() === '') return 'User';
    
    // Remove spaces and special characters, keep only alphanumeric
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '');
    
    // If the name is too short after cleaning, return it directly
    if (cleanName.length < 3) return cleanName || 'User';
    
    // For longer names, create a more unique seed by using parts of the name
    // This ensures the same name always generates the same avatar
    const firstPart = cleanName.substring(0, Math.min(5, cleanName.length));
    const lastPart = cleanName.length > 5 
      ? cleanName.substring(cleanName.length - 3) 
      : '';
    
    return `${firstPart}${lastPart}`;
  };

  const generateRandomSeed = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleAvatarChange = (style: string, seed?: string) => {
    // If seed is provided and looks like a name, generate a consistent seed from it
    const newSeed = seed 
      ? (seed.length > 2 && /[a-zA-Z]/.test(seed)) 
        ? generateSeedFromName(seed) 
        : seed
      : generateRandomSeed();
      
    setAvatarSeed(newSeed);
    setAvatarStyle(style);
    
    // Add style-specific parameters for better avatar appearance
    let styleParams = '';
    if (style === 'avataaars') {
      styleParams = '&mouth[]=smile&eyes[]=happy';
    } else if (style === 'bottts') {
      styleParams = '&mouthColor[]=ffffff&backgroundColor[]=172B4D';
    } else if (style === 'initials') {
      // For initials, use the first 2 characters of the name if available
      const initials = profile.name && profile.name.trim() !== '' 
        ? profile.name.substring(0, 2).toUpperCase() 
        : 'U';
      styleParams = `&chars=${initials}&backgroundColor[]=172B4D`;
    }
    
    const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${newSeed}${styleParams}`;
    setImagePreview(avatarUrl);
    setProfile(prev => ({
      ...prev,
      profileImage: avatarUrl
    }));
  };

  const handleRandomizeAvatar = () => {
    handleAvatarChange(avatarStyle, generateRandomSeed());
  };

  // Use name for avatar generation
  const handleUseNameForAvatar = () => {
    if (profile.name && profile.name.trim() !== '') {
      handleAvatarChange(avatarStyle, profile.name);
    } else {
      toast.error("Please enter your name first");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] border border-blue-200/30 dark:border-blue-800/30">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-700/25 opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.15),transparent_50%)]"></div>
        
        <DialogHeader className="space-y-4 relative">
          <div className="flex flex-col items-center gap-4">
            {/* Enhanced Avatar Display with Better Contrast */}
            <div className="relative group mt-2">
              {/* Outer glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-30 blur-md group-hover:opacity-60 group-hover:blur-lg animate-pulse"></div>
              
              {/* Avatar container with enhanced shadow and border */}
              <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-[3px] cursor-pointer hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] relative z-10">
                {/* Inner container with improved background */}
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 p-2 flex items-center justify-center">
                  {/* Avatar image with enhanced styling */}
                  {imagePreview ? (
                    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center" style={{
                      backgroundColor: avatarStyle === 'initials' ? '#172B4D' : 
                                      avatarStyle === 'bottts' ? '#172B4D' : 
                                      '#f8fafc'
                    }}>
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-contain p-1"
                        style={{ 
                          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))',
                        }}
                      />
                    </div>
                  ) : (
                    <UserCircle className="w-full h-full text-blue-500 dark:text-blue-400" />
                  )}
                </div>
              </div>
              
              {/* Avatar Preview Label with enhanced styling */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-1 rounded-full text-xs font-medium text-blue-600 dark:text-blue-400 shadow-md border border-blue-100 dark:border-blue-900 z-20">
                Avatar Preview
              </div>
            </div>
            
            {/* Avatar Style Selection - Enhanced UI */}
            <div className="flex flex-col gap-3 w-full max-w-xs mt-6 bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl shadow-md border border-blue-100/50 dark:border-blue-900/50 backdrop-blur-sm">
              <Label className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Avatar Style
              </Label>
              <Select
                value={avatarStyle}
                onValueChange={(value) => handleAvatarChange(value)}
              >
                <SelectTrigger className="w-full bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-500/30">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {avatarStyles.map(style => (
                    <SelectItem key={style.id} value={style.id} className="focus:bg-blue-50 dark:focus:bg-blue-900/20">
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Avatar Customization Options */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleRandomizeAvatar}
                  className="bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-500"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path></svg>
                  Randomize
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleUseNameForAvatar}
                  className="bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
                  Use Name
                </Button>
              </div>
            </div>
            
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              Complete Your Profile
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
              Let's personalize your experience with some basic information about you
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="py-4 relative space-y-6">
          {/* Name Input */}
          <div className="space-y-2 group">
            <Label htmlFor="name" className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Full Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full pr-10 bg-white/80 dark:bg-gray-800/80 border-blue-200/50 dark:border-blue-800/50 focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-blue-400/40 transition-all duration-300 backdrop-blur-sm rounded-lg"
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"></path></svg>
              </div>
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg blur-xl"></div>
          </div>

          {/* Gender Selection */}
          <div className="space-y-2 relative group">
            <Label className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Gender
            </Label>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm shadow-sm">
              <RadioGroup
                value={profile.gender}
                onValueChange={(value: 'male' | 'female' | 'other') => setProfile({ ...profile, gender: value })}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2 transition-transform hover:scale-105">
                  <RadioGroupItem value="male" id="male" className="border-blue-400/50 text-blue-600 dark:text-blue-400" />
                  <Label htmlFor="male" className="text-gray-700 dark:text-gray-300 cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2 transition-transform hover:scale-105">
                  <RadioGroupItem value="female" id="female" className="border-blue-400/50 text-blue-600 dark:text-blue-400" />
                  <Label htmlFor="female" className="text-gray-700 dark:text-gray-300 cursor-pointer">Female</Label>
                </div>
                <div className="flex items-center space-x-2 transition-transform hover:scale-105">
                  <RadioGroupItem value="other" id="other" className="border-blue-400/50 text-blue-600 dark:text-blue-400" />
                  <Label htmlFor="other" className="text-gray-700 dark:text-gray-300 cursor-pointer">Other</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg blur-xl"></div>
          </div>

          {/* Age Input */}
          <div className="space-y-2 group relative">
            <Label htmlFor="age" className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
              Age
            </Label>
            <div className="relative">
              <Input
                id="age"
                type="number"
                value={profile.age || ''}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                placeholder="Enter your age"
                min="0"
                max="120"
                className="w-full pr-10 bg-white/80 dark:bg-gray-800/80 border-blue-200/50 dark:border-blue-800/50 focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-blue-400/40 transition-all duration-300 backdrop-blur-sm rounded-lg"
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Years</span>
              </div>
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-green-500/10 via-teal-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg blur-xl"></div>
          </div>

          {/* Height Input with Unit Selection */}
          <div className="space-y-2 group relative">
            <Label htmlFor="height" className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 22V2M2 12h20M17 22H7M17 2H7"></path></svg>
              Height
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="height"
                  type="number"
                  value={profile.height || ''}
                  onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                  placeholder="Enter your height"
                  className="w-full bg-white/80 dark:bg-gray-800/80 border-blue-200/50 dark:border-blue-800/50 focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-blue-400/40 transition-all duration-300 backdrop-blur-sm rounded-lg"
                />
              </div>
              <Select
                value={profile.heightUnit}
                onValueChange={(value: 'cm' | 'm' | 'ft') => handleUnitChange('height', value)}
              >
                <SelectTrigger className="w-[100px] bg-white/80 dark:bg-gray-800/80 border-blue-200/50 dark:border-blue-800/50 focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-blue-400/40">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50">
                  <SelectItem value="cm" className="focus:bg-blue-50 dark:focus:bg-blue-900/20">cm</SelectItem>
                  <SelectItem value="m" className="focus:bg-blue-50 dark:focus:bg-blue-900/20">m</SelectItem>
                  <SelectItem value="ft" className="focus:bg-blue-50 dark:focus:bg-blue-900/20">ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg blur-xl"></div>
          </div>

          {/* Weight Input with Unit Selection */}
          <div className="space-y-2 group relative">
            <Label htmlFor="weight" className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="9" x2="16" y2="9"></line><line x1="9" y1="12" x2="15" y2="12"></line><line x1="10" y1="15" x2="14" y2="15"></line></svg>
              Weight
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight || ''}
                  onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                  placeholder="Enter your weight"
                  className="w-full bg-white/80 dark:bg-gray-800/80 border-blue-200/50 dark:border-blue-800/50 focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-blue-400/40 transition-all duration-300 backdrop-blur-sm rounded-lg"
                />
              </div>
              <Select
                value={profile.weightUnit}
                onValueChange={(value: 'kg' | 'lbs') => handleUnitChange('weight', value)}
              >
                <SelectTrigger className="w-[100px] bg-white/80 dark:bg-gray-800/80 border-blue-200/50 dark:border-blue-800/50 focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:focus-visible:ring-blue-400/40">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50">
                  <SelectItem value="kg" className="focus:bg-blue-50 dark:focus:bg-blue-900/20">kg</SelectItem>
                  <SelectItem value="lbs" className="focus:bg-blue-50 dark:focus:bg-blue-900/20">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg blur-xl"></div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
            <div className="relative flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Save Profile
            </div>
          </Button>
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
            Your data is stored securely and used only to personalize your experience
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileRegistration; 