import { useState } from "react";
import MoodTracker from "./MoodTracker";
import HealthMetrics from "./HealthMetrics";
import DailyHealthScore from "./DailyHealthScore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className="space-y-8">
      {/* Mobile View with Tabs */}
      {isMobile && (
        <Card className="p-4">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="mood">Mood</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              <DailyHealthScore />
              <MoodTracker />
              <HealthMetrics />
            </TabsContent>
            
            <TabsContent value="mood">
              <MoodTracker />
            </TabsContent>
            
            <TabsContent value="health" className="space-y-6">
              <DailyHealthScore />
              <HealthMetrics />
            </TabsContent>
          </Tabs>
        </Card>
      )}
      
      {/* Desktop View - Grid Layout */}
      {!isMobile && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-7 space-y-6">
            <DailyHealthScore />
            <MoodTracker />
          </div>
          
          {/* Right Column */}
          <div className="col-span-5">
            <HealthMetrics />
          </div>
        </div>
      )}
    </div>
  );
} 