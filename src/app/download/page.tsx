"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, HelpCircle, CheckCircle, Lock, Bot, Star, ShieldCheck, Droplets, QrCode, MessageSquare, BarChart3, Globe, Zap, Gem } from 'lucide-react';
import { motion } from 'framer-motion';


const faqItems = [
  {
    question: "Is LifeSync AI free to use?",
    answer: "Yes, the core features of LifeSync AI are completely free to download and use. We plan to introduce optional premium features in the future, but core functionalities will remain accessible to everyone."
  },
  {
    question: "What kind of questions can I ask the AI Health Chatbot?",
    answer: "You can ask a wide range of health-related questions, from understanding symptoms, learning about medical conditions, getting information on healthy habits, to general wellness advice. However, please remember the AI is for informational purposes and not a substitute for professional medical advice."
  },
  {
    question: "Is my data safe with LifeSync AI?",
    answer: "We take your privacy and data security very seriously. All your personal information is encrypted and stored securely. We adhere to strict privacy policies to ensure your data is protected. You can learn more in our Privacy Policy."
  },
  {
    question: "When will the iOS version be available?",
    answer: "We are actively working on the iOS version of LifeSync AI and aim to release it soon. Stay tuned for updates on our website and social media channels!"
  }
];

const benefits = [
  {
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradBen1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--violet-accent))" />
          </linearGradient>
        </defs>
        <path d="M12 8V4H8V8H4V12H8V16H12V12H16V8H12Z" fill="url(#gradBen1)" fillOpacity="0.3" />
        <path d="M20 18H4V12H2V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V12H20V18Z" fill="url(#gradBen1)" />
        <path d="M18 4H6C4.89543 4 4 4.89543 4 6V12H6V6H18V12H20V6C20 4.89543 19.1046 4 18 4Z" fill="url(#gradBen1)" />
        <circle cx="8" cy="15" r="1" fill="url(#gradBen1)" fillOpacity="0.7" />
        <circle cx="16" cy="15" r="1" fill="url(#gradBen1)" fillOpacity="0.7" />
      </svg>
    ),
    title: "24/7 AI Assistant",
    description: "Instant answers to your health queries, anytime, anywhere."
  },
  {
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradBen2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--violet-accent))" />
          </linearGradient>
        </defs>
        <path d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2Z" stroke="url(#gradBen2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#gradBen2)" fillOpacity="0.2" />
        <path d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2Z" fill="url(#gradBen2)" fillOpacity="0.2" />
        <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Encrypted Medical Data",
    description: "Your health data is secured with bank-grade encryption."
  },
  {
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://wwws.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradBen3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--violet-accent))" />
          </linearGradient>
        </defs>
        <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.5 12 22 12 22C12 22 19 13.5 19 9C19 5.13401 15.866 2 12 2Z" stroke="url(#gradBen3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#gradBen3)" fillOpacity="0.3" />
        <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" fill="url(#gradBen3)" fillOpacity="0.5" />
      </svg>
    ),
    title: "Smart Water Tracker",
    description: "Personalized hydration goals and intelligent reminders."
  }
];

const testimonials = [
  { quote: "LifeSync AI is a game-changer! So easy to track my water intake and symptoms. The AI insights are incredibly accurate.", name: "Alex P.", rating: 5, role: "Fitness Enthusiast" },
  { quote: "The AI chatbot is surprisingly accurate and helpful. Feels like having a doctor on call 24/7. Highly recommended!", name: "Jamie R.", rating: 5, role: "Busy Professional" },
  { quote: "Finally, an app that centralizes my health info securely. The upcoming features look amazing! Can't wait.", name: "Casey L.", rating: 4, role: "Tech Savvy User" }
];

const plans = {
  free: {
    name: "Basic",
    price: "Free",
    features: [
      { text: "AI Health Chatbot (Basic)", included: true },
      { text: "Symptom Checker (Standard)", included: true },
      { text: "Water Intake Tracker", included: true },
      { text: "Medication Reminders (Limited)", included: true },
      { text: "Basic Health Reports", included: true },
      { text: "Community Support", included: true },
      { text: "Advanced AI Insights", included: false },
      { text: "Wearable Integration", included: false },
      { text: "Personalized Health Plans", included: false },
      { text: "Priority Support", included: false },
    ],
    cta: "Get Started for Free"
  },
  premium: {
    name: "Premium",
    price: "Coming Soon",
    tag: "Most Popular",
    features: [
      { text: "AI Health Chatbot (Advanced)", included: true },
      { text: "Symptom Checker (Pro)", included: true },
      { text: "Water Intake Tracker (Smart Goals)", included: true },
      { text: "Medication Reminders (Unlimited)", included: true },
      { text: "Advanced Health Reports & Analytics", included: true },
      { text: "Community Support + Forum Access", included: true },
      { text: "Advanced AI Insights & Trends", included: true },
      { text: "Wearable Integration (Full Sync)", included: true },
      { text: "Personalized Health & Wellness Plans", included: true },
      { text: "Priority Email & Chat Support", included: true },
    ],
    cta: "Notify Me"
  }
}


const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  }),
};

const cardHoverVariants = {
  rest: { scale: 1, y: 0, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" },
  hover: {
    scale: 1.03,
    y: -5,
    boxShadow: "0px 12px 25px rgba(0,0,0,0.08)", // Softer shadow
    transition: { type: "spring", stiffness: 300, damping: 15 }
  }
};

const buttonHoverTapVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.97 }
};

export default function DownloadPage() {
  return (
    <motion.div
      className="container mx-auto max-w-6xl space-y-12 md:space-y-16 py-12" // Standard padding
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Download Section */}
      <section className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"> {/* Reduced gap */}
        <motion.div
          className="space-y-5 text-center md:text-left" // Reduced space-y
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">Get Started with LifeSync AI Today</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Your intelligent health companion is just a tap away. Download LifeSync AI now and experience the power of an AI health assistant in your pocket.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center md:justify-start pt-4">
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <motion.div variants={buttonHoverTapVariants} whileHover="hover" whileTap="tap">
                <Button asChild size="lg" className="w-full sm:w-auto rounded-full shadow-soft-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-primary-foreground px-7 py-3 text-base font-semibold">
                  <Link href="/downloads/lifesync-ai.apk" download="lifesync-ai.apk">
                    <Image src="https://placehold.co/24x24.png" alt="Google Play Store" width={20} height={20} className="mr-2 rounded-sm" data-ai-hint="google play logo" /> Download for Android
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={buttonHoverTapVariants} whileHover="hover" whileTap="tap">
                <Button size="lg" className="w-full sm:w-auto rounded-full shadow-soft hover:shadow-soft-lg border-border text-muted-foreground px-7 py-3 text-base font-semibold" variant="outline" disabled>
                  <Smartphone className="mr-2 h-5 w-5" /> Coming Soon on iOS
                </Button>
              </motion.div>
            </div>
            <motion.div variants={itemVariants} custom={1}>
              <Card className="max-w-xs mx-auto shadow-soft-lg rounded-2xl p-4 bg-card/90 backdrop-blur-sm border-border/50 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
                <CardHeader className="p-0 mb-2 text-center">
                  <QrCode className="h-6 w-6 text-primary mx-auto mb-1" />
                  <CardTitle className="text-base font-semibold">Scan to Download</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex justify-center">
                  <Image
                    src="https://placehold.co/128x128.png"
                    alt="QR Code for LifeSync AI App Download"
                    width={128}
                    height={128}
                    className="rounded-md shadow-sm border p-1 bg-white"
                    data-ai-hint="qr code app download"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          className="flex justify-center items-center relative" // Added relative for potential animation layers
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 100 }}
        >
          {/* Placeholder for animated mockup - replace with actual animation or more dynamic image */}
          <div className="relative mx-auto border-gray-800/60 dark:border-gray-700/60 bg-gray-800/60 border-[10px] rounded-[2.5rem] h-[550px] w-[275px] shadow-2xl backdrop-blur-sm">
            <div className="w-[120px] h-[16px] bg-gray-800/80 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
            <div className="h-[35px] w-[3px] bg-gray-800/80 absolute -left-[13px] top-[65px] rounded-l-md"></div>
            <div className="h-[35px] w-[3px] bg-gray-800/80 absolute -left-[13px] top-[120px] rounded-l-md"></div>
            <div className="h-[50px] w-[3px] bg-gray-800/80 absolute -right-[13px] top-[90px] rounded-r-md"></div>
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-gray-800">
              <Image
                src="https://placehold.co/270x560.png"
                alt="LifeSync App Screenshot on Mobile Mockup"
                width={270}
                height={560}
                className="object-cover w-full h-full"
                data-ai-hint="app interface mobile health"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <motion.section
        className="py-10 md:py-12 bg-secondary/30 rounded-2xl" // Reduced padding
        variants={sectionVariants}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10">Key Benefits of LifeSync AI</h2> {/* Reduced mb */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8"> {/* Reduced gap */}
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                custom={index}
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
                initial="rest" animate="rest" // For Framer Motion variants on cardHover
                viewport={{ once: true, amount: 0.4 }}
              >
                <Card className="p-6 bg-card/90 backdrop-blur-sm rounded-xl shadow-soft-lg text-center h-full border-border/50 flex flex-col items-center">
                  <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                    <benefit.icon className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-1.5 text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Plan Comparison Section */}
      <motion.section className="py-10 md:py-12" variants={sectionVariants}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Choose Your Plan</h2>
          <p className="text-lg text-muted-foreground mb-8 md:mb-10 max-w-xl mx-auto">Start with our free essentials or get ready for premium features.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {[plans.free, plans.premium].map((plan, idx) => (
              <motion.div
                key={plan.name}
                custom={idx}
                variants={itemVariants}
                viewport={{ once: true, amount: 0.3 }}
                className="flex" // For equal height
              >
                <Card className={`rounded-2xl shadow-soft-lg p-6 md:p-8 w-full flex flex-col ${plan.name === "Premium" ? "border-2 border-primary bg-primary/5" : "bg-card/90 border-border/50"}`}>
                  {(plan as any).tag && (
                    <div className="absolute top-0 right-6 -mt-3">
                      <span className="bg-violet-accent text-violet-accent-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-pulseGlow">
                        {(plan as any).tag}
                      </span>
                    </div>
                  )}

                  <CardHeader className="p-0 mb-4 text-center">
                    <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                    <p className={`text-3xl font-extrabold mt-2 ${plan.name === "Premium" ? "text-primary" : "text-foreground"}`}>{plan.price}</p>
                    {plan.name === "Premium" && <p className="text-sm text-muted-foreground">(Launching Soon)</p>}
                  </CardHeader>
                  <CardContent className="p-0 flex-grow mb-6">
                    <ul className="space-y-2.5 text-left">
                      {plan.features.map((feature, featIdx) => (
                        <li key={featIdx} className="flex items-center text-sm">
                          {feature.included ? <CheckCircle className="h-4 w-4 mr-2 text-accent shrink-0" /> : <Lock className="h-4 w-4 mr-2 text-muted-foreground/50 shrink-0" />}
                          <span className={feature.included ? "text-muted-foreground" : "text-muted-foreground/60"}>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <motion.div variants={buttonHoverTapVariants} whileHover="hover" whileTap="tap" className="mt-auto">
                    <Button asChild size="lg" className={`w-full rounded-full text-base font-semibold py-3 ${plan.name === "Premium" ? "bg-primary hover:bg-primary/90 text-primary-foreground animate-pulseGlow" : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"}`} disabled={plan.name === "Premium"}>
                      {plan.name === "Premium" ? (
                        <>
                          <Gem className="mr-2 h-5 w-5" /> {plan.cta}
                        </>
                      ) : (
                        <Link href="/downloads/lifesync-ai.apk" download="lifesync-ai.apk">
                          <Download className="mr-2 h-5 w-5" /> {plan.cta}
                        </Link>
                      )}
                    </Button>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="mt-10 p-4 bg-violet-accent/10 rounded-lg text-center border border-violet-accent/30"
            variants={itemVariants} custom={2} viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-violet-accent flex items-center justify-center"><Globe className="w-6 h-6 mr-2" />LifeSync Web Dashboard</h3>
            <p className="text-muted-foreground text-sm mt-1">Access your health insights on any device. <span className="font-semibold text-violet-accent/80">Coming Soon!</span></p>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-10 md:py-12" // Reduced padding
        variants={sectionVariants}
      >
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-10"> {/* Reduced mb */}
            <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">Real feedback from LifeSync AI users who love our app.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"> {/* Reduced gap */}
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
                initial="rest" animate="rest"
                viewport={{ once: true, amount: 0.4 }}
                className="flex" // For equal height
              >
                <Card className="shadow-soft-lg rounded-xl p-6 h-full flex flex-col bg-card/90 backdrop-blur-sm border-border/50">
                  <div className="flex mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <MessageSquare className="h-6 w-6 text-primary/60 mb-2.5" />
                  <p className="text-muted-foreground italic mb-4 flex-grow leading-relaxed text-sm">"{testimonial.quote}"</p>
                  <div className="mt-auto text-right">
                    <p className="font-semibold text-foreground text-sm">- {testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        variants={sectionVariants}
        className="pb-12" // Reduced padding bottom
      >
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center text-primary mb-2">
            <HelpCircle className="h-8 w-8 md:h-10 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto bg-card/80 backdrop-blur-sm p-2 md:p-4 rounded-2xl shadow-soft-lg border-border/50">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={itemVariants}
              viewport={{ once: true, amount: 0.5 }}
            >
              <AccordionItem value={`item-${index + 1}`} className="border-b border-border/60 last:border-b-0 px-2 md:px-0">
                <AccordionTrigger className="py-3.5 text-md md:text-lg font-semibold hover:no-underline text-left text-foreground hover:text-primary data-[state=open]:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-3.5 pt-0.5 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.section>
    </motion.div>
  );
}
