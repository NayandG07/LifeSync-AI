import { ChatMessage } from "./types";

// Type declaration for Vite's import.meta.env
interface ImportMetaEnv {
  DEV: boolean;
  PROD: boolean;
  MODE: string;
  VITE_SYMPTOM_API_URL: string;
  VITE_CHAT_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// API configuration - Using Cloudflare webhook for Gemini API via environment variables
const SYMPTOM_API_URL = import.meta.env.VITE_SYMPTOM_API_URL || 
  "https://gemini-cloudflare-webhook.nayandg8.workers.dev/"; // Fallback for backwards compatibility
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 
  "https://gemini-therapist-webhook.nayandg8.workers.dev/"; // Fallback for backwards compatibility

// Note: API key is no longer needed since we're using Cloudflare webhooks
// that handle the API key on the server side

// Therapeutic system prompt for Gemma
const THERAPEUTIC_PROMPT = `You are an experienced, empathetic, and professional therapist with expertise in mental health counseling. Your approach is:

1. Compassionate and non-judgmental - creating a safe space for users to express themselves
2. Evidence-based - drawing from established therapeutic approaches like CBT, ACT, and mindfulness
3. Person-centered - focusing on the individual's unique experiences and needs
4. Solution-oriented - helping users develop practical coping strategies
5. Ethical - recognizing the limitations of AI therapy and encouraging professional help when needed

In your responses:
- Listen actively and validate emotions
- Ask thoughtful follow-up questions to deepen understanding
- Offer practical, actionable suggestions when appropriate
- Use warm, supportive language while maintaining professional boundaries
- Recognize signs that may require professional intervention
- Emphasize self-care and healthy coping mechanisms
- Provide psychoeducation when relevant

Remember that you are not a replacement for a licensed therapist, but you can provide supportive guidance and a compassionate presence.`;

// Medical prompt for symptom analysis
const MEDICAL_PROMPT = `You are a medical AI assistant with expertise in analyzing symptoms and providing health-related information. Your role is to:

1. Analyze symptoms and suggest possible conditions based on medical knowledge
2. Provide evidence-based recommendations for managing symptoms
3. Suggest appropriate remedies, including home treatments and over-the-counter options
4. Indicate when professional medical attention is necessary
5. Be clear about limitations and the importance of consulting healthcare providers

In your responses:
- Be objective and factual
- Avoid definitive diagnoses
- Provide information that helps users make informed decisions about their health
- Clearly indicate severity levels and when emergency care is needed
- Emphasize that your analysis is not a substitute for professional medical care

Remember to always prioritize user safety and recommend appropriate care based on symptom severity.`;

// Therapeutic responses as fallback in case API fails
const responses = {
  greeting: [
    "Hello! I'm here as your supportive companion. How are you feeling today?",
    "Welcome. I'm here to listen and support you. How has your day been going?",
    "Hi there. I'm here as a space for you to express yourself. What's on your mind today?",
    "Hello. Thank you for reaching out. How are you feeling in this moment?"
  ],
  
  anxiety: [
    "It sounds like you're experiencing some anxiety. Deep breathing can help regulate your nervous system - perhaps try breathing in for 4 counts, hold for 7, and exhale for 8 counts. Would you like to explore what might be triggering these feelings?",
    "Anxiety can be really challenging. Many find mindfulness practices helpful. Have you discovered any techniques that have worked for you in the past?",
    "When anxiety arises, grounding exercises can help bring you back to the present moment. Perhaps try noticing 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Would you like to talk more about what's causing these feelings?",
    "I hear that you're feeling anxious. Remember that these feelings, while difficult, are temporary and will pass. Would it help to explore what might be contributing to this anxiety?"
  ],
  
  depression: [
    "I'm sorry you're feeling low. Depression can make even small tasks feel overwhelming. Sometimes taking one tiny step, like getting out of bed or taking a short walk, can be a meaningful victory. What's one small thing that might bring you a moment of peace today?",
    "When we're experiencing depression, everything can feel overwhelming. Could we identify one small, manageable action that might help you feel a sense of accomplishment today?",
    "It takes courage to acknowledge these feelings. Have you been able to speak with a mental health professional about what you're experiencing? Professional support can be very valuable during these times.",
    "Depression can feel very isolating. Sometimes connecting with others, even briefly, can provide some relief. Is there someone supportive you might reach out to, even with just a short message?"
  ],
  
  stress: [
    "It sounds like you're under significant stress. Taking even 5 minutes for yourself to do something calming can help reset your nervous system. What small self-care activity might you be able to incorporate today?",
    "When we're stressed, our bodies physically respond with tension. Progressive muscle relaxation can help - perhaps try tensing and then relaxing each muscle group, starting from your toes and working up. Would you like to explore what's contributing to your stress?",
    "Journaling can be a helpful way to process stressful feelings. Writing down what's on your mind might help externalize some of those thoughts. Would that be something you'd be willing to try?",
    "It sounds like you have a lot on your plate right now. Sometimes reviewing our commitments and identifying what can be delegated, postponed, or eliminated can help create some breathing room. Would it help to talk through your current responsibilities?"
  ],
  
  sleep: [
    "Sleep difficulties can be really frustrating. Establishing a consistent bedtime routine can help signal to your body that it's time to wind down. What might a calming pre-sleep routine look like for you?",
    "Blue light from screens can interfere with your body's natural sleep signals. If possible, try avoiding phones and computers for an hour before bed. Have you found any particular activities helpful for winding down?",
    "Many people find that calming sounds or guided sleep meditations help with falling asleep. Would you be open to exploring some sleep-focused audio resources?",
    "Racing thoughts at bedtime can make sleep elusive. Keeping a notepad by your bed to jot down thoughts can sometimes help clear your mind. Would you like to discuss other strategies for managing nighttime rumination?"
  ],
  
  gratitude: [
    "Practicing gratitude can be a powerful tool for shifting perspective. Even in difficult times, can you identify one thing, however small, that you're grateful for today?",
    "Noticing positive moments, however small, can gradually shift our outlook over time. That's a wonderful practice to cultivate.",
    "Research shows that regularly acknowledging things we're grateful for can positively impact our mental health. Thank you for sharing that reflection.",
    "Gratitude practice is like a muscle that gets stronger with use. I appreciate you bringing that positive awareness to our conversation."
  ],
  
  general: [
    "I'm here to listen and support you. Would you feel comfortable sharing more about what you're experiencing?",
    "Thank you for sharing that with me. How have you been managing these feelings?",
    "I appreciate your openness. What do you think might help you feel more supported right now?",
    "That sounds challenging. Have you found any strategies helpful in similar situations before?",
    "I'm listening. Sometimes just expressing our thoughts can help us process them more effectively.",
    "Your feelings are valid. Would it help to explore this topic a bit further?",
    "I'm here to support you. What would be most helpful for you in this moment?",
    "It takes courage to discuss these things. Is there a specific aspect you'd like to focus on?"
  ]
};

// Simple keyword matching for response selection
const keywords = {
  anxiety: ["anxious", "anxiety", "nervous", "worry", "panic", "stressed", "tension", "uneasy", "fear", "dread", "apprehension"],
  depression: ["depressed", "depression", "sad", "down", "hopeless", "empty", "blue", "unhappy", "miserable", "worthless", "numb", "lonely"],
  stress: ["stress", "stressed", "pressure", "overwhelmed", "burnout", "burden", "strain", "overload", "exhausted", "tense"],
  sleep: ["sleep", "insomnia", "tired", "exhausted", "restless", "fatigue", "bed", "wake", "nightmare", "dreams", "rest"],
  gratitude: ["grateful", "gratitude", "thankful", "appreciate", "blessed", "fortunate", "appreciation", "thanks"]
};

// Add specific keywords for mental health crises - ONLY for suicidal content
const crisisKeywords = {
  suicidal: ["suicidal", "suicide", "kill myself", "end my life", "don't want to live", "want to die"]
};

// Add specific crisis responses
const crisisResponses = {
  suicidal: [
    "I'm really concerned about what you're sharing. If you're having thoughts of harming yourself, please reach out to a crisis helpline immediately. In the US, you can call or text 988 for the Suicide and Crisis Lifeline, available 24/7. Would you like me to provide more resources?",
    "I'm taking what you're saying very seriously. Please connect with a mental health professional right away. The National Suicide Prevention Lifeline (988) has trained counselors available 24/7 who care and want to help. Your life matters.",
    "I'm concerned about you and what you're going through. If you're in crisis, please call your local emergency number (such as 911 in the US) or go to your nearest emergency room. Would it help to talk about what's making you feel this way?"
  ]
};

// Function to determine if a message is a greeting
function isGreeting(message: string): boolean {
  const greetingPatterns = [
    /^hi\b/i, /^hello\b/i, /^hey\b/i, /^good morning\b/i, /^good afternoon\b/i, 
    /^good evening\b/i, /^what's up\b/i, /^howdy\b/i, /^greetings\b/i
  ];
  return greetingPatterns.some(pattern => pattern.test(message));
}

// Function to get category based on keywords
function getCategory(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (isGreeting(lowerMessage)) {
    return "greeting";
  }
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lowerMessage.includes(word))) {
      return category;
    }
  }
  
  return "general";
}

// Function to get a random response from a category
function getRandomResponse(category: string): string {
  const categoryResponses = responses[category as keyof typeof responses] || responses.general;
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  return categoryResponses[randomIndex];
}

// Function to generate Gemma response
export async function generateGemmaResponse(
  messages: ChatMessage[],
  currentMessage: string
): Promise<string> {
  try {
    // First check only for suicide-related crisis keywords
    const lowerMessage = currentMessage.toLowerCase();
    
    // Check for crisis keywords first and provide immediate responses
    if (crisisKeywords.suicidal.some(word => lowerMessage.includes(word))) {
      const randomIndex = Math.floor(Math.random() * crisisResponses.suicidal.length);
      return crisisResponses.suicidal[randomIndex];
    }
    
    // For all other messages, including feeling sad, use the API
    const allMessages = [
      ...messages,
      { role: "user" as const, content: currentMessage }
    ];

    // Create the prompt for the Gemini therapist
    let prompt = THERAPEUTIC_PROMPT + "\n\n";
    
    // Add conversation history
    for (let i = 0; i < allMessages.length; i++) {
      const msg = allMessages[i];
      if (msg.role === "user") {
        prompt += `User: ${msg.content}\n`;
      } else if (msg.role === "assistant") {
        prompt += `Assistant: ${msg.content}\n`;
      }
    }
    
    // Add final prompt without the assistant's response
    if (prompt.endsWith("\n")) {
      prompt += "Assistant:";
    } else {
      prompt += "\nAssistant:";
    }

    console.log("Preparing prompt for Gemini therapist...");

    // Call the therapist webhook
    try {
      console.log("Sending request to Gemini therapist webhook:", CHAT_API_URL);
      
      // Send the actual chat request with improved timeout handling
      const chatController = new AbortController();
      const chatTimeoutId = setTimeout(() => chatController.abort(), 15000); // 15 second timeout - increased from 10s
      
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: prompt,
          model: "gemini-1.5-pro" // Using the pro model for better therapeutic responses
        }),
        signal: chatController.signal,
        cache: 'no-store' // Prevent caching
      });
      
      clearTimeout(chatTimeoutId);
      
      // Handle API errors
      if (!response.ok) {
        console.error(`API Error: ${response.status} - ${response.statusText}`);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        
        const category = getCategory(currentMessage);
        return getRandomResponse(category);
      }
      
      const data = await response.json();
      
      // Extract the text response and max tokens from the webhook
      let responseText = '';
      let maxTokens = 1024; // Default fallback
      
      if (data.text) {
        responseText = data.text;
      } else if (typeof data === 'string') {
        responseText = data;
      } else {
        console.error("Unexpected response format from therapist webhook:", data);
        const category = getCategory(currentMessage);
        return getRandomResponse(category);
      }
      
      // Get max tokens from response if available
      if (data.max_tokens) {
        maxTokens = parseInt(data.max_tokens);
      }
      
      // Clean up the response with dynamic token limit
      return cleanResponse(responseText, maxTokens);
      
    } catch (error) {
      console.error("Error in API call:", error);
      const category = getCategory(currentMessage);
      return getRandomResponse(category);
    }
  } catch (error) {
    console.error("Error in generateGemmaResponse:", error);
    const category = getCategory(currentMessage);
    return getRandomResponse(category);
  }
}

// Helper function to clean the response text
function cleanResponse(text: string, maxTokens: number = 1024): string {
  // Remove the instruction pattern that's showing up
  text = text.replace(/^Respond with helpful, empathetic advice\.?\s*/i, "").trim();
  
  // Remove any "You are a professional" instructions
  text = text.replace(/^You are a professional therapeutic AI assistant\.?\s*/i, "").trim();
  
  // Remove any "Assistant:" prefix if present
  text = text.replace(/^Assistant:\s*/i, "").trim();
  
  // Remove any system instructions or prompts that might be in the response
  text = text.replace(/you are (?:a|an) (?:professional|experienced|empathetic|therapeutic).*?(?:\.|$)/i, "").trim();
  
  // Remove any system prompt portions that might leak
  text = text.replace(/your approach is:[\s\S]*?professional presence\./i, "").trim();
  
  // Remove any lines that look like instructions
  text = text.replace(/in your responses:[\s\S]*?compassionate presence\./i, "").trim();
  
  // Remove any User: or similar patterns that might follow
  text = text.split(/\n(?:User|Human):.*$/)[0].trim();
  
  // Check if the response appears to be truncated (ends without proper punctuation)
  const lastChar = text.charAt(text.length - 1);
  const properEndingPunctuation = ['.', '!', '?', '"', ')', ']', '}'].includes(lastChar);
  const endsWithEllipsis = text.endsWith('...');
  
  // Limit response length to maxTokens characters
  if (text.length > maxTokens) {
    text = text.substring(0, maxTokens - 3) + "...";
  } else if (!properEndingPunctuation && !endsWithEllipsis && text.length > 50) {
    // If it doesn't end with proper punctuation and isn't already truncated with ellipsis,
    // add an ellipsis to indicate truncation
    text += "...";
  }
  
  // If we've stripped everything, provide a fallback response
  if (!text) {
    return "I'm here to help with your wellness journey. How can I assist you today?";
  }
  
  return text;
}

// Function to generate symptom analysis using Gemini
export async function analyzeSymptoms(
  symptoms: string[],
  bodyAreas: string[] = [],
  duration: string = "days",
  severity: number = 3
): Promise<any> {
  try {
    // Format the prompt for symptom analysis with length limits
    const promptText = `
As a medical AI assistant, provide a brief analysis of these symptoms:
Symptoms: ${symptoms.join(", ")}
Body areas affected: ${bodyAreas.join(", ") || "Not specified"}
Duration: ${duration}
Severity (1-5): ${severity}

Please output a JSON object with the following structure, keeping descriptions under 100 characters each:
{
  "conditions": [
    {
      "name": "Brief condition name",
      "confidence": number between 0-100,
      "description": "Very brief description",
      "severity": "mild" OR "moderate" OR "severe" OR "emergency"
    }
  ],
  "remedies": [
    {
      "type": "home" OR "otc" OR "professional",
      "title": "Brief title",
      "description": "Brief action-oriented remedy"
    }
  ]
}

Only respond with valid JSON. Include 2-3 most relevant conditions and 2-3 focused remedies.
`;

    // Call the Gemini API via Cloudflare webhook for symptoms
    try {
      console.log("Sending request to Gemini API for symptom analysis...");
      
      // Send request with improved timeout handling
      const chatController = new AbortController();
      const chatTimeoutId = setTimeout(() => chatController.abort(), 15000); // 15 second timeout - increased from 10s
      
      const response = await fetch(SYMPTOM_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: promptText,
          model: "gemini-1.5-flash"
        }),
        signal: chatController.signal,
        cache: 'no-store' // Prevent caching
      });
      
      clearTimeout(chatTimeoutId);
      
      // Handle API errors
      if (!response.ok) {
        console.error(`API Error: ${response.status} - ${response.statusText}`);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Webhook error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received response from Gemini API:", data);
      
      // Extract the text response from the webhook
      let responseText = '';
      if (data.text) {
        responseText = data.text;
      } else if (typeof data === 'string') {
        responseText = data;
      } else {
        console.error("Unexpected response format:", data);
        throw new Error("Unexpected response format from webhook");
      }
      
      // Helper function to map severity level to string
      const getSeverityString = (level: number): string => {
        if (level <= 2) return "mild";
        if (level <= 3) return "moderate";
        if (level <= 4) return "severe";
        return "emergency";
      };
      
      // Parse the JSON from the response
      let result;
      try {
        // First try to find and parse any JSON object in the response
        let jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON object is found, create a structured response manually
          // based on the symptoms and body areas
          console.warn("No JSON found in response, creating structured analysis manually");
          
          // Create symptom descriptions for non-JSON responses
          const symptomsList = symptoms.join(", ");
          const bodyAreasList = bodyAreas.length > 0 ? bodyAreas.join(", ") : "General";
          
          // Extract possible conditions from the text response
          const conditions = [];
          const severityMapping: Record<string, number> = {
            'mild': 55,
            'moderate': 70,
            'severe': 85,
            'emergency': 95
          };
          
          // Get the severity string for the current severity level
          const severityString = getSeverityString(severity);
          
          // Try to identify condition names in the response
          const possibleConditions = responseText.match(/\b(syndrome|disease|infection|disorder|cold|flu|allergy|pain|inflammation)\b/gi) || [];
          
          if (possibleConditions.length > 0) {
            // Use unique condition names, up to 3
            Array.from(new Set(possibleConditions)).slice(0, 3).forEach((conditionName, i) => {
              conditions.push({
                name: conditionName.charAt(0).toUpperCase() + conditionName.slice(1),
                confidence: severityMapping[severityString] || 65,
                description: `Possible condition based on your symptoms: ${symptomsList}`,
                severity: severityString
              });
            });
          }
          
          // Create remedies based on the response
          const remedies = [
            {
              type: "home",
              title: "Rest and Self-Care",
              description: "Get adequate rest and maintain proper hydration."
            },
            {
              type: "professional",
              title: "Consult a Healthcare Provider",
              description: "For an accurate diagnosis, please consult with a medical professional."
            }
          ];
          
          // If no conditions were extracted, provide a general analysis
          if (conditions.length === 0) {
            conditions.push({
              name: "Unspecified Condition",
              confidence: 50,
              description: `Based on your symptoms (${symptomsList}), please consult a healthcare provider for proper diagnosis.`,
              severity: severityString
            });
          }
          
          result = { conditions, remedies };
        }
        
        return result;
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        console.log("Response text:", responseText);
        throw new Error("Invalid response format");
      }
    } catch (apiError) {
      console.error("API call failed in symptom analysis:", apiError);
      return generateLocalSymptomAnalysis(symptoms, bodyAreas, severity);
    }
  } catch (error) {
    console.error("Error in symptom analysis:", error);
    // Return a fallback response in case of error
    return generateLocalSymptomAnalysis(symptoms, bodyAreas, severity);
  }
}

// Function to generate a fallback local symptom analysis when API is unavailable
function generateLocalSymptomAnalysis(symptoms: string[], bodyAreas: string[], severityLevel: number): any {
  console.log("Generating local symptom analysis for:", { symptoms, bodyAreas, severityLevel });
  
  // Map severity level (1-5) to SeverityLevel type
  const getSeverity = (level: number) => {
    if (level <= 2) return "mild";
    if (level <= 3) return "moderate";
    if (level <= 4) return "severe";
    return "emergency";
  };
  
  const severity = getSeverity(severityLevel);
  
  // Common conditions based on body areas
  const conditionsByBodyArea: Record<string, Array<{name: string, description: string}>> = {
    head: [
      { name: "Tension Headache", description: "Mild to moderate pain often described as feeling like a tight band around the head." },
      { name: "Migraine", description: "Severe throbbing pain, usually on one side of the head, often accompanied by nausea and sensitivity to light and sound." },
      { name: "Sinus Infection", description: "Inflammation or swelling of the tissue lining the sinuses, causing pain around eyes, cheeks and forehead." }
    ],
    chest: [
      { name: "Common Cold", description: "Viral infection causing sore throat, coughing, and congestion." },
      { name: "Bronchitis", description: "Inflammation of the lining of the bronchial tubes, which carry air to and from the lungs." },
      { name: "Acid Reflux", description: "Backward flow of stomach contents into the esophagus causing heartburn and chest discomfort." }
    ],
    abdomen: [
      { name: "Gastroenteritis", description: "Inflammation of the digestive tract, often causing stomach pain, diarrhea, and vomiting." },
      { name: "Irritable Bowel Syndrome", description: "A common disorder affecting the large intestine causing cramping, abdominal pain, bloating, gas, diarrhea and constipation." },
      { name: "Food Intolerance", description: "Difficulty digesting certain foods causing stomach pain, gas, bloating, and sometimes diarrhea." }
    ],
    back: [
      { name: "Muscle Strain", description: "Overstretching or tearing of muscles causing pain and limited movement." },
      { name: "Sciatica", description: "Pain that radiates along the path of the sciatic nerve, from the lower back through the hips and buttocks and down the leg." },
      { name: "Herniated Disc", description: "A problem with one of the rubbery cushions between the bones that stack to make your spine." }
    ],
    arms: [
      { name: "Carpal Tunnel Syndrome", description: "Pressure on the median nerve resulting in numbness, tingling, and weakness in the hand and arm." },
      { name: "Tennis Elbow", description: "Inflammation of the tendons that join the forearm muscles to the elbow." },
      { name: "Arthritis", description: "Inflammation of one or more joints causing pain and stiffness." }
    ],
    legs: [
      { name: "Muscle Cramp", description: "Sudden and involuntary contraction of muscles causing pain." },
      { name: "Shin Splints", description: "Pain along the shin bone (tibia) — the large bone in the front of your lower leg." },
      { name: "Varicose Veins", description: "Enlarged, twisted veins most commonly appearing in the legs." }
    ],
    skin: [
      { name: "Eczema", description: "Inflammation of the skin causing itchy, red, swollen, and cracked skin." },
      { name: "Contact Dermatitis", description: "Red, itchy rash caused by direct contact with a substance or an allergic reaction." },
      { name: "Psoriasis", description: "Skin cells build up and form scales and itchy, dry patches." }
    ],
    general: [
      { name: "Common Cold", description: "Viral infection of the nose and throat causing sneezing, coughing, and mild body aches." },
      { name: "Seasonal Allergies", description: "Immune system reaction to substances like pollen causing sneezing, congestion, and itchy eyes." },
      { name: "Influenza", description: "Viral infection affecting the respiratory system causing fever, body aches, and fatigue." }
    ]
  };
  
  // Define the Condition interface type
  type LocalCondition = {
    name: string;
    confidence: number;
    description: string;
    severity: string;
  };
  
  // Generate conditions based on symptoms and body areas
  let conditions: LocalCondition[] = [];
  const relevantBodyAreas = bodyAreas.length > 0 ? bodyAreas : ['general'];
  
  // Get matching conditions from relevant body areas
  for (const area of relevantBodyAreas) {
    const areaConditions = conditionsByBodyArea[area] || [];
    for (const condition of areaConditions) {
      // Only include each condition once
      if (!conditions.find(c => c.name === condition.name)) {
        conditions.push({
          name: condition.name,
          confidence: Math.floor(Math.random() * 30) + 50, // Random confidence between 50-80
          description: condition.description,
          severity: severity
        });
        
        // Limit to 4 conditions total
        if (conditions.length >= 4) break;
      }
    }
    
    // Limit to 4 conditions total
    if (conditions.length >= 4) break;
  }
  
  // If no specific conditions were found, provide generic ones
  if (conditions.length === 0) {
    conditions = [
      {
        name: "Common Cold",
        confidence: 65,
        description: "A viral infection affecting the upper respiratory tract causing coughing, sneezing, and congestion.",
        severity: severity
      },
      {
        name: "Seasonal Allergies",
        confidence: 60,
        description: "An immune system reaction to environmental triggers like pollen, causing sneezing, runny nose, and itchy eyes.",
        severity: severity
      }
    ];
  }
  
  // Generate remedies based on severity
  const remedies = [];
  
  // Home remedies (always include)
  remedies.push(
    {
      type: "home",
      title: "Rest and Hydration",
      description: "Get adequate rest and drink plenty of fluids to help your body recover."
    },
    {
      type: "home",
      title: "Warm Compress",
      description: "Apply a warm compress to affected areas to reduce pain and discomfort."
    }
  );
  
  // OTC remedies (for mild to severe)
  if (["mild", "moderate", "severe"].includes(severity)) {
    remedies.push(
      {
        type: "otc",
        title: "Pain Relievers",
        description: "Over-the-counter pain medications like acetaminophen or ibuprofen may help reduce pain and inflammation."
      },
      {
        type: "otc",
        title: "Symptom-Specific Medication",
        description: "Consider medications designed for specific symptoms such as antihistamines for allergies or antacids for digestive issues."
      }
    );
  }
  
  // Professional remedies (for moderate to emergency)
  if (["moderate", "severe", "emergency"].includes(severity)) {
    remedies.push(
      {
        type: "professional",
        title: "Medical Consultation",
        description: "Schedule an appointment with your healthcare provider to get a proper diagnosis and treatment plan."
      }
    );
    
    if (["severe", "emergency"].includes(severity)) {
      remedies.push({
        type: "professional",
        title: "Immediate Medical Attention",
        description: "Your symptoms suggest a serious condition that requires prompt medical evaluation. Consider visiting an urgent care or emergency room."
      });
    }
  }
  
  return {
    conditions,
    remedies
  };
}

export const gemma = {
  generateGemmaResponse,
  analyzeSymptoms,
}; 