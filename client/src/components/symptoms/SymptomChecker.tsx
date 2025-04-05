import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Import icons from our compatibility layer
import { 
  ExclamationTriangleIcon,
  CheckCircledIcon,
  QuestionMarkCircledIcon,
  ReloadIcon,
  Cross1Icon
} from "@/lib/radix-icons";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { gemma } from "@/lib/gemma";
import BodyMap from "./BodyMap";
import { SymptomCheckResult, SeverityLevel, Condition, Remedy } from "@/types/symptoms";
import { Checkbox } from "@/components/ui/checkbox";

// Common symptoms by body area
const bodyAreaSymptoms: Record<string, string[]> = {
  head: ["Headache", "Dizziness", "Blurred vision", "Ear pain", "Sore throat", "Fever", "Neck pain", "Nasal congestion"],
  chest: ["Chest pain", "Shortness of breath", "Heart palpitations", "Cough", "Rapid heartbeat", "Wheezing", "Chest tightness"],
  abdomen: ["Stomach pain", "Nausea", "Vomiting", "Diarrhea", "Constipation", "Bloating", "Acid reflux", "Loss of appetite"],
  back: ["Back pain", "Spine pain", "Muscle stiffness", "Lower back pain", "Upper back pain", "Sciatica", "Limited mobility"],
  arms: ["Arm pain", "Joint pain", "Muscle weakness", "Numbness", "Swelling", "Tingling", "Limited range of motion", "Redness"],
  legs: ["Leg pain", "Swelling", "Difficulty walking", "Knee pain", "Ankle pain", "Cramps", "Varicose veins", "Numbness"],
  skin: ["Rash", "Itching", "Hives", "Discoloration", "Dryness", "Bruising", "Lesions", "Excessive sweating"],
  general: ["Fatigue", "Weakness", "Chills", "Night sweats", "Weight loss", "Loss of appetite", "Dizziness", "Anxiety"]
};

// Severity indicators with descriptions
const severityLevels = [
  { level: "mild" as SeverityLevel, description: "Symptoms are mild and don't interfere with daily activities" },
  { level: "moderate" as SeverityLevel, description: "Symptoms may interfere with some activities and may require treatment" },
  { level: "severe" as SeverityLevel, description: "Symptoms significantly affect daily activities and require prompt treatment" },
  { level: "emergency" as SeverityLevel, description: "Symptoms are life-threatening and require immediate medical attention" }
];

export default function SymptomChecker() {
  const [user] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState("text");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [selectedBodyAreas, setSelectedBodyAreas] = useState<string[]>([]);
  const [severityLevel, setSeverityLevel] = useState<number>(1);
  const [duration, setDuration] = useState<string>("days");
  const [analysis, setAnalysis] = useState<SymptomCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedResults, setSavedResults] = useState<SymptomCheckResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeBodyPartFilter, setActiveBodyPartFilter] = useState<string | null>(null);

  // Fetch saved symptom checks
  useEffect(() => {
    const fetchSavedResults = async () => {
      if (user) {
        try {
          // Use localStorage to avoid excessive Firebase reads (free tier consideration)
          const savedData = localStorage.getItem(`symptom_history_${user.uid}`);
          if (savedData) {
            setSavedResults(JSON.parse(savedData));
          }
        } catch (error) {
          console.error("Error fetching saved symptom checks:", error);
        }
      }
    };
    
    fetchSavedResults();
  }, [user]);

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom("");
    }
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const toggleBodyArea = (area: string) => {
    if (selectedBodyAreas.includes(area)) {
      setSelectedBodyAreas(selectedBodyAreas.filter(a => a !== area));
    } else {
      setSelectedBodyAreas([...selectedBodyAreas, area]);
      
      // Suggest common symptoms for this area
      const areaSymptoms = bodyAreaSymptoms[area] || [];
      areaSymptoms.forEach(symptom => {
        if (!symptoms.includes(symptom)) {
          setSymptoms(prev => [...prev, symptom]);
        }
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700";
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700";
      case "severe": return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700";
      case "emergency": return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700";
      default: return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getRemedyIcon = (type: string) => {
    switch (type) {
      case "home": return "🏠";
      case "otc": return "💊";
      case "professional": return "👨‍⚕️";
      default: return "❓";
    }
  };

  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const analyze = async () => {
    if (symptoms.length === 0) {
      alert("Please add at least one symptom");
      return;
    }

    setLoading(true);
    try {
      // Use the dedicated symptom analysis function
      const result = await gemma.analyzeSymptoms(
        symptoms,
        selectedBodyAreas,
        duration,
        severityLevel
      );
      
      // Create the full result object
      const analysisResult: SymptomCheckResult = {
        symptoms,
        bodyAreas: selectedBodyAreas,
        severity: severityLevel,
        conditions: result.conditions || [],
        remedies: result.remedies || [],
        timestamp: new Date()
      };
      
      setAnalysis(analysisResult);
      
      // Save to local storage to avoid excessive Firebase writes (free tier consideration)
      if (user) {
        const userId = user.uid;
        analysisResult.userId = userId;
        
        const savedData = localStorage.getItem(`symptom_history_${userId}`);
        let history: SymptomCheckResult[] = savedData ? JSON.parse(savedData) : [];
        
        // Keep only last 10 results to save space
        history = [analysisResult, ...history].slice(0, 10);
        localStorage.setItem(`symptom_history_${userId}`, JSON.stringify(history));
        setSavedResults(history);
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      alert("Error analyzing symptoms. Please try again.");
    }
    setLoading(false);
  };

  const resetChecker = () => {
    setSymptoms([]);
    setSelectedBodyAreas([]);
    setSeverityLevel(1);
    setDuration("days");
    setAnalysis(null);
    setActiveBodyPartFilter(null);
  };

  const resetCurrentTab = () => {
    switch (activeTab) {
      case "text":
        setSymptoms([]);
        setCurrentSymptom("");
        setActiveBodyPartFilter(null);
        break;
      case "body":
        setSelectedBodyAreas([]);
        break;
      case "questionnaire":
        setSeverityLevel(1);
        setDuration("days");
        break;
    }
  };

  // Add a function to clear symptom history
  const clearHistory = () => {
    if (user) {
      // Clear from localStorage
      localStorage.removeItem(`symptom_history_${user.uid}`);
      // Update state
      setSavedResults([]);
    }
  };

  // Render the body map section
  const renderBodyMap = () => {
    return (
      <div className="my-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Select affected body areas:</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedBodyAreas([])}
            disabled={selectedBodyAreas.length === 0}
            className="text-xs h-8"
          >
            <ReloadIcon className="mr-1 h-3 w-3" />
            Reset body selection
          </Button>
        </div>
        <BodyMap 
          selectedAreas={selectedBodyAreas}
          onAreaClick={toggleBodyArea}
        />
      </div>
    );
  };

  // Render symptom toggle boxes for text input tab
  const renderSymptomToggles = () => {
    const allBodyParts = Object.keys(bodyAreaSymptoms);
    
    return (
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium">Quick symptoms selection:</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveBodyPartFilter(null)} 
              className={`text-xs h-8 ${!activeBodyPartFilter ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
            >
              All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSymptoms([])}
              disabled={symptoms.length === 0}
              className="text-xs h-8"
            >
              <ReloadIcon className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {allBodyParts.map(bodyPart => (
            <Badge 
              key={bodyPart}
              variant={activeBodyPartFilter === bodyPart ? "default" : "outline"} 
              className={`cursor-pointer text-sm px-3 py-1.5 font-medium transition-all duration-200 hover:shadow-md ${
                activeBodyPartFilter === bodyPart 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-transparent shadow-md' 
                  : 'hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2 border-slate-200 dark:border-slate-700'
              }`}
              onClick={() => setActiveBodyPartFilter(activeBodyPartFilter === bodyPart ? null : bodyPart)}
            >
              {bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {(activeBodyPartFilter ? bodyAreaSymptoms[activeBodyPartFilter] : 
            Object.values(bodyAreaSymptoms).flat().filter((v, i, a) => a.indexOf(v) === i)
          ).map(symptom => (
            <div 
              key={symptom} 
              className={`flex items-center space-x-2 rounded-md border-2 p-3 transition-all duration-200 cursor-pointer ${
                symptoms.includes(symptom) 
                  ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-md' 
                  : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50'
              }`}
              onClick={() => toggleSymptom(symptom)}
            >
              <Checkbox 
                id={`checkbox-${symptom}`}
                checked={symptoms.includes(symptom)}
                onCheckedChange={() => toggleSymptom(symptom)}
                className={symptoms.includes(symptom) ? "text-blue-500 border-blue-400" : ""}
              />
              <label 
                htmlFor={`checkbox-${symptom}`}
                className={`text-sm cursor-pointer flex-grow font-medium ${symptoms.includes(symptom) ? "text-blue-700 dark:text-blue-300" : ""}`}
              >
                {symptom}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render questionnaire section
  const renderQuestionnaire = () => {
    return (
      <div className="space-y-4 my-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Symptom details:</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSeverityLevel(1);
              setDuration("days");
            }}
            className="text-xs h-8"
          >
            <ReloadIcon className="mr-1 h-3 w-3" />
            Reset details
          </Button>
        </div>
      
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="text-sm font-medium mb-2">How long have you experienced these symptoms?</h3>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="years">Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="text-sm font-medium mb-2">
            How severe are your symptoms? (1-5)
          </h3>
          <Slider
            value={[severityLevel]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => setSeverityLevel(value[0])}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>
      </div>
    );
  };

  // Render analysis results
  const renderResults = () => {
    if (!analysis) return null;
    
    const hasEmergency = analysis.conditions.some(c => c.severity === "emergency");
    
    return (
      <div className="mt-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analysis Results</h2>
          <Button onClick={resetChecker} variant="outline" size="sm">
            <ReloadIcon className="mr-2 h-4 w-4" />
            Start New Check
          </Button>
        </div>
        
        {hasEmergency && (
          <Alert variant="destructive" className="bg-red-50 border-red-300 dark:bg-red-900/30 dark:border-red-800">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <AlertTitle className="text-red-800 dark:text-red-300">Emergency Warning</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-200">
              Some symptoms may indicate a serious condition requiring immediate medical attention.
              Please consult with a healthcare provider immediately or visit an emergency room.
            </AlertDescription>
          </Alert>
        )}
        
        <div>
          <h3 className="font-medium text-lg mb-3">Possible Conditions</h3>
          <div className="space-y-3">
            {analysis.conditions.map((condition, index) => (
              <Card key={index} className={`p-4 border-l-4 ${getSeverityColor(condition.severity)}`}>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold">{condition.name}</h4>
                  <Badge variant={condition.severity === "emergency" ? "destructive" : "outline"}>
                    {condition.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground my-2">{condition.description}</p>
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground">Confidence Level</span>
                  <div className="flex items-center gap-2">
                    <Progress value={condition.confidence} className="h-2" />
                    <span className="text-xs font-bold">{condition.confidence}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-3">Recommended Remedies</h3>
          <Accordion type="single" collapsible className="w-full">
            {["home", "otc", "professional"].map((type) => (
              <AccordionItem key={type} value={type}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <span>{getRemedyIcon(type)}</span>
                    <span className="font-medium capitalize">
                      {type === "otc" ? "Over-the-counter Medications" : `${type} Remedies`}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {analysis.remedies
                      .filter(remedy => remedy.type === type)
                      .map((remedy, i) => (
                        <div key={i} className="border rounded-md p-3 bg-card">
                          <h4 className="font-medium">{remedy.title}</h4>
                          <p className="text-sm text-muted-foreground">{remedy.description}</p>
                        </div>
                      ))}
                    {analysis.remedies.filter(remedy => remedy.type === type).length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No specific remedies in this category</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="text-sm text-muted-foreground pt-4 border-t mt-6">
          <p className="flex items-start gap-1">
            <QuestionMarkCircledIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>This analysis is provided for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider regarding your specific situation.</span>
          </p>
        </div>
      </div>
    );
  };

  // Render history section
  const renderHistory = () => {
    if (!user || savedResults.length === 0) return null;
    
    return (
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Recent Symptom Checks</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearHistory}
            className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            <ReloadIcon className="mr-1 h-3 w-3" />
            Clear History
          </Button>
        </div>
        <div className="space-y-3">
          {savedResults.map((result, index) => (
            <Card key={index} className="p-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">
                    {new Date(result.timestamp).toLocaleDateString()} at {new Date(result.timestamp).toLocaleTimeString()}
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1 mb-2">
                    {result.symptoms.slice(0, 3).map((symptom, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                    {result.symptoms.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{result.symptoms.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                {result.conditions.length > 0 && (
                  <Badge 
                    className={getSeverityColor(
                      result.conditions.sort((a, b) => 
                        severityLevels.findIndex(s => s.level === b.severity) - 
                        severityLevels.findIndex(s => s.level === a.severity)
                      )[0].severity
                    )}
                  >
                    {result.conditions[0].severity}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-4 sm:p-6 shadow-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center sm:text-left bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent drop-shadow-sm">Symptom Checker</h2>
      
      {!analysis ? (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 w-full p-1.5 bg-blue-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
              <TabsTrigger 
                value="text" 
                className="text-sm sm:text-base font-medium py-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300 border data-[state=active]:border-blue-200 dark:data-[state=active]:border-blue-700"
              >
                Text Input
              </TabsTrigger>
              <TabsTrigger 
                value="body" 
                className="text-sm sm:text-base font-medium py-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300 border data-[state=active]:border-blue-200 dark:data-[state=active]:border-blue-700"
              >
                Body Map
              </TabsTrigger>
              <TabsTrigger 
                value="questionnaire" 
                className="text-sm sm:text-base font-medium py-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-300 border data-[state=active]:border-blue-200 dark:data-[state=active]:border-blue-700"
              >
                Questionnaire
              </TabsTrigger>
            </TabsList>
            
            {/* Text input tab */}
            <TabsContent value="text" className="mt-0">
              <div className="flex gap-2 mb-4">
                <Input
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  placeholder="Enter a symptom..."
                  onKeyDown={(e) => e.key === "Enter" && addSymptom()}
                  className="flex-grow border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                />
                <Button onClick={addSymptom} className="min-w-[80px] bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md">Add</Button>
              </div>
              {renderSymptomToggles()}
            </TabsContent>
            
            {/* Body map tab */}
            <TabsContent value="body" className="mt-0">
              {renderBodyMap()}
            </TabsContent>
            
            {/* Questionnaire tab */}
            <TabsContent value="questionnaire" className="mt-0">
              {renderQuestionnaire()}
            </TabsContent>
          </Tabs>
          
          {/* Update symptom list container with stronger gradient and border */}
          <div className="p-5 border-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-900/20 mt-4 shadow-md border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Your symptoms:</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetCurrentTab}
                disabled={
                  (activeTab === "text" && symptoms.length === 0) || 
                  (activeTab === "body" && selectedBodyAreas.length === 0) || 
                  (activeTab === "questionnaire" && severityLevel === 1 && duration === "days")
                }
                className="text-xs h-8"
              >
                <ReloadIcon className="mr-1 h-3 w-3" />
                Reset {activeTab === "text" ? "symptoms" : activeTab === "body" ? "body selection" : "details"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
              {symptoms.length === 0 ? (
                <p className="text-sm text-muted-foreground">No symptoms added yet</p>
              ) : (
                symptoms.map((symptom, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer pl-3 pr-1.5 py-1.5 h-7 flex items-center gap-1.5 group hover:bg-red-50 bg-white border-2 border-slate-200 text-slate-700 shadow-md hover:border-red-300 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
                    onClick={() => removeSymptom(index)}
                  >
                    <span className="font-medium">{symptom}</span>
                    <div className="ml-1 rounded-full bg-slate-100 hover:bg-red-200 h-5 w-5 inline-flex items-center justify-center transition-colors dark:bg-slate-700 dark:hover:bg-red-900/40">
                      <Cross1Icon className="h-3 w-3 text-slate-500 dark:text-slate-300 group-hover:text-red-500" />
                    </div>
                  </Badge>
                ))
              )}
            </div>
          </div>
          
          {symptoms.length > 0 && (
            <Button
              className="w-full mt-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 hover:from-blue-600 hover:via-indigo-600 hover:to-violet-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg border border-blue-400"
              onClick={analyze}
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Symptoms"
              )}
            </Button>
          )}
        </>
      ) : (
        renderResults()
      )}
      
      {/* Render history section if available */}
      {renderHistory()}
    </Card>
  );
}
