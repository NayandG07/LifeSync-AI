import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, Bell, Lock, Activity } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleSyncComplete = (data: any) => {
    console.log("Sync completed with data:", data);
    // You would update your app's state or database with this data
  };

  return (
    <div className="container py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden md:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">Integrations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-semibold">Profile Settings</h2>
            <p className="text-muted-foreground">
              Manage your account information and personal details
            </p>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <h2 className="text-2xl font-semibold">Notification Settings</h2>
            <p className="text-muted-foreground">
              Manage how you receive notifications from LifeSync
            </p>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <h2 className="text-2xl font-semibold">Privacy Settings</h2>
            <p className="text-muted-foreground">
              Control who can see your data and how it's used
            </p>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <h2 className="text-2xl font-semibold">Integrations</h2>
            <p className="text-muted-foreground">
              Connect LifeSync with other health and fitness platforms
            </p>
            
            <div className="grid gap-6 mt-8">
              {/* Placeholder for future integrations */}
              <div className="mt-6 p-6 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-center text-muted-foreground">
                <p>More integrations coming soon (Apple Health, Fitbit, etc.)</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
} 