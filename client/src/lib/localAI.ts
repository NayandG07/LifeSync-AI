import { ChatMessage } from "./gemini";

// Therapeutic responses database
const responses = {
  greeting: [
    "Hello! I'm here to listen. How are you feeling today?",
    "Welcome! How has your day been so far?",
    "Hi there! I'm your AI wellness companion. What's on your mind?",
    "Hello! I'm here to support you. How are you doing today?"
  ],
  
  anxiety: [
    "It sounds like you're experiencing some anxiety. Deep breathing can help - try breathing in for 4 counts, hold for 7, and exhale for 8 counts.",
    "Anxiety can be challenging to deal with. Have you tried any mindfulness practices that have worked for you in the past?",
    "When anxiety arises, it can help to ground yourself by naming 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
    "I'm sorry to hear you're feeling anxious. Remember that these feelings are temporary and will pass. Would it help to talk more about what's causing this feeling?"
  ],
  
  depression: [
    "I'm sorry you're feeling low. Sometimes small steps can help - even just getting out of bed or taking a short walk can be a victory.",
    "Depression can make everything feel overwhelming. Could you think of one small thing that might bring you a moment of peace today?",
    "It takes courage to acknowledge these feelings. Have you spoken to a professional about how you're feeling?",
    "When you're feeling down, it can help to connect with others. Is there someone supportive you could reach out to?"
  ],
  
  stress: [
    "Stress can be really overwhelming. Taking even 5 minutes for yourself to do something calming can make a difference.",
    "When we're stressed, our bodies tense up. Try progressively tensing and relaxing each muscle group, starting from your toes and working up.",
    "Sometimes writing down what's stressing you can help process those feelings. Have you tried journaling?",
    "It sounds like you have a lot on your plate. Is there anything you could temporarily delegate or postpone to give yourself some breathing room?"
  ],
  
  sleep: [
    "Sleep troubles can be frustrating. A consistent bedtime routine can help signal to your body that it's time to wind down.",
    "Blue light from screens can interfere with sleep. Try avoiding phones and computers for an hour before bed if possible.",
    "Some people find that calming sounds or white noise helps with sleep. Have you tried any sleep sounds or meditation?",
    "If racing thoughts keep you awake, keeping a notepad by your bed to write them down can sometimes help clear your mind."
  ],
  
  gratitude: [
    "Practicing gratitude can be powerful. Can you think of one thing, even something small, that you're grateful for today?",
    "That's a wonderful perspective. Noticing positive moments, however small, can gradually shift our outlook.",
    "Taking time to appreciate the good things can be so beneficial for mental health. Thank you for sharing that.",
    "I love that you're focusing on gratitude. It's a practice that gets stronger the more we use it."
  ],
  
  general: [
    "I'm here to listen and support you. Would you like to tell me more about that?",
    "Thank you for sharing that with me. How have you been coping with these feelings?",
    "I appreciate you opening up. What do you think might help you feel better right now?",
    "That sounds challenging. What strategies have helped you in similar situations before?",
    "I'm listening. Sometimes just expressing our thoughts can help us process them better.",
    "Your feelings are valid. Would it help to explore this topic a bit further?",
    "I'm here to support you through this. What would be most helpful for you right now?",
    "It takes courage to discuss these things. Is there a specific aspect you'd like to focus on?"
  ]
};

// Simple keyword matching for response selection
const keywords = {
  anxiety: ["anxious", "anxiety", "nervous", "worry", "panic", "stressed", "tension", "uneasy"],
  depression: ["depressed", "depression", "sad", "down", "hopeless", "empty", "blue", "unhappy", "miserable"],
  stress: ["stress", "stressed", "pressure", "overwhelmed", "burnout", "burden", "strain"],
  sleep: ["sleep", "insomnia", "tired", "exhausted", "restless", "fatigue", "bed", "wake", "nightmare"],
  gratitude: ["grateful", "gratitude", "thankful", "appreciate", "blessed", "fortunate"]
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

export async function generateLocalResponse(
  messages: ChatMessage[],
  currentMessage: string
): Promise<string> {
  try {
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get the appropriate category based on message content
    const category = getCategory(currentMessage);
    
    // Return a response based on the category
    return getRandomResponse(category);
  } catch (error) {
    console.error("Error generating local response:", error);
    return "I'm here to listen and help. Could you tell me more about what's on your mind?";
  }
}

export const localAI = {
  generateLocalResponse,
}; 