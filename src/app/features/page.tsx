
"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Stethoscope, Droplets, Pill, ShieldCheck, LayoutDashboard, ScanLine, Brain, Zap, X } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';

const GradientBot = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gradBot" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary))" /><stop offset="100%" stopColor="hsl(var(--violet-accent))" /></linearGradient></defs>
    <path d="M12 8V4H8V8H4V12H8V16H12V12H16V8H12Z" fill="url(#gradBot)" fillOpacity="0.3"/><path d="M20 18H4V12H2V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V12H20V18Z" fill="url(#gradBot)"/><path d="M18 4H6C4.89543 4 4 4.89543 4 6V12H6V6H18V12H20V6C20 4.89543 19.1046 4 18 4Z" fill="url(#gradBot)"/><circle cx="8" cy="15" r="1" fill="white" fillOpacity="0.7"/><circle cx="16" cy="15" r="1" fill="white" fillOpacity="0.7"/>
  </svg>
);
const GradientStethoscope = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gradSteth" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary))" /><stop offset="100%" stopColor="hsl(var(--violet-accent))" /></linearGradient></defs>
    <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12V18H4V12Z" fill="url(#gradSteth)" fillOpacity="0.3"/><path d="M12 4C11.4477 4 11 4.44772 11 5V7C11 7.55228 11.4477 8 12 8C12.5523 8 13 7.55228 13 7V5C13 4.44772 12.5523 4 12 4Z" fill="url(#gradSteth)"/><path d="M10 2H14C15.1046 2 16 2.89543 16 4V4C16 5.10457 15.1046 6 14 6H10C8.89543 6 8 5.10457 8 4V4C8 2.89543 8.89543 2 10 2Z" fill="url(#gradSteth)"/><path d="M20 12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V12" stroke="url(#gradSteth)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const GradientDroplets = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gradDrop" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary))" /><stop offset="100%" stopColor="hsl(var(--violet-accent))" /></linearGradient></defs>
    <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.5 12 22 12 22C12 22 19 13.5 19 9C19 5.13401 15.866 2 12 2Z" stroke="url(#gradDrop)" strokeWidth="1.5" fill="url(#gradDrop)" fillOpacity="0.3"/><path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" fill="url(#gradDrop)" fillOpacity="0.5"/>
  </svg>
);
const GradientPill = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gradPill" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary))" /><stop offset="100%" stopColor="hsl(var(--violet-accent))" /></linearGradient></defs>
    <path d="M14.5 9.5L9.5 14.5M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="url(#gradPill)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 2C14.6522 2 17.1957 3.05357 19.0711 4.92893C20.9464 6.8043 22 9.34784 22 12" stroke="url(#gradPill)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#gradPill)" fillOpacity="0.3"/>
  </svg>
);
const GradientDashboard = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gradDash" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary))" /><stop offset="100%" stopColor="hsl(var(--violet-accent))" /></linearGradient></defs>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="url(#gradDash)" strokeWidth="1.5" fill="url(#gradDash)" fillOpacity="0.2" /><path d="M7 12L10 9L13 14L17 10" stroke="url(#gradDash)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 7H7.01" stroke="url(#gradDash)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const GradientShield = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gradShield" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary))" /><stop offset="100%" stopColor="hsl(var(--violet-accent))" /></linearGradient></defs>
    <path d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2Z" stroke="url(#gradShield)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#gradShield)" fillOpacity="0.2"/><path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GradientScan = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gradScan" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary))" /><stop offset="100%" stopColor="hsl(var(--violet-accent))" /></linearGradient></defs>
    <path d="M3 7V5C3 3.89543 3.89543 3 5 3H7" stroke="url(#gradScan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" stroke="url(#gradScan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 17V19C21 20.1046 20.1046 21 19 21H17" stroke="url(#gradScan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 21H5C3.89543 21 3 20.1046 3 19V17" stroke="url(#gradScan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 12H17" stroke="url(#gradScan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#gradScan)" fillOpacity="0.3"/>
  </svg>
);
const GradientBrain = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gradBrain" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary))" /><stop offset="100%" stopColor="hsl(var(--violet-accent))" /></linearGradient></defs>
    <path d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8Z" stroke="url(#gradBrain)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.5 8C15.3284 8 16 7.32843 16 6.5C16 5.67157 15.3284 5 14.5 5C13.6716 5 13 5.67157 13 6.5C13 7.32843 13.6716 8 14.5 8Z" stroke="url(#gradBrain)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.5 13.25C10.3284 13.25 11 12.5784 11 11.75C11 10.9216 10.3284 10.25 9.5 10.25C8.67157 10.25 8 10.9216 8 11.75C8 12.5784 8.67157 13.25 9.5 13.25Z" stroke="url(#gradBrain)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.5 13.25C15.3284 13.25 16 12.5784 16 11.75C16 10.9216 15.3284 10.25 14.5 10.25C13.6716 10.25 13 10.9216 13 11.75C13 12.5784 13.6716 13.25 14.5 13.25Z" stroke="url(#gradBrain)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.5 18.5C10.3284 18.5 11 17.8284 11 17C11 16.1716 10.3284 15.5 9.5 15.5C8.67157 15.5 8 16.1716 8 17C8 17.8284 8.67157 18.5 9.5 18.5Z" stroke="url(#gradBrain)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.5 18.5C15.3284 18.5 16 17.8284 16 17C16 16.1716 15.3284 15.5 14.5 15.5C13.6716 15.5 13 16.1716 13 17C13 17.8284 13.6716 18.5 14.5 18.5Z" stroke="url(#gradBrain)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.40654 20.9631 7.0253 19.25 5.25" stroke="url(#gradBrain)" strokeWidth="1.5" strokeLinecap="round" fill="url(#gradBrain)" fillOpacity="0.2"/>
  </svg>
);
const GradientZap = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gradZap" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary))" /><stop offset="100%" stopColor="hsl(var(--violet-accent))" /></linearGradient></defs>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="url(#gradZap)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#gradZap)" fillOpacity="0.3"/>
  </svg>
);


interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  longDescription?: string;
  status?: 'coming soon';
  aiHint?: string;
}

const featuresList: Feature[] = [
  {
    icon: GradientBot,
    title: 'AI Health Chatbot',
    description: 'Engage in smart conversations for health queries and get doctor suggestions.',
    longDescription: 'Our AI Health Chatbot provides instant, personalized responses to your health-related questions, offering guidance, information on conditions, and even suggesting relevant local healthcare providers. It learns from interactions to become more helpful over time.',
    aiHint: 'chatbot interface user',
  },
  {
    icon: GradientStethoscope,
    title: 'Symptom Checker',
    description: 'Understand potential symptoms with our AI-driven analysis for next steps.',
    longDescription: 'Simply input your symptoms, and our AI will analyze them against a vast medical database to provide potential insights and suggest appropriate next steps, including whether to seek professional medical attention.',
    aiHint: 'symptom analysis medical',
  },
  {
    icon: GradientDroplets,
    title: 'Water Intake Tracker',
    description: 'Personalized daily water goals based on your profile, activity, and reminders.',
    longDescription: 'Stay optimally hydrated with personalized daily water intake goals calculated based on your unique health profile, activity level, and even local weather conditions. Set smart reminders to keep you on track.',
    aiHint: 'hydration tracker app',
  },
  {
    icon: GradientPill,
    title: 'Medication Reminder',
    description: 'Log medications, set intelligent reminders, and track your schedule effortlessly.',
    longDescription: 'Never miss a dose again. Log your medications, set customizable reminders for dosage times, and track your adherence. LifeSync AI helps you manage your medication schedule with ease and precision.',
    aiHint: 'medication schedule digital',
  },
  {
    icon: GradientDashboard,
    title: 'Health Reports Dashboard',
    description: 'Visualize your health trends, track progress with insightful charts, and export reports.',
    longDescription: 'Gain a comprehensive overview of your health journey. Our intuitive dashboard visualizes your tracked data (symptoms, water intake, medication adherence) through easy-to-understand charts and trends. Export reports to share with your doctor.',
    aiHint: 'health dashboard data',
  },
  {
    icon: GradientShield,
    title: 'Secure Data Storage',
    description: 'Your sensitive health data is encrypted and stored with utmost privacy and security.',
    longDescription: 'We prioritize your privacy. All personal health information is end-to-end encrypted and stored using industry-leading security protocols, ensuring your data remains confidential and protected at all times.',
    aiHint: 'data security digital'
  },
  {
    icon: GradientScan,
    title: 'Wearable Integration',
    description: 'Sync data from Fitbit, Apple Health, and Google Fit for comprehensive insights.',
    longDescription: 'Connect your favorite wearable devices and health apps like Fitbit, Apple Health, and Google Fit. LifeSync AI will consolidate your data to provide a holistic view of your activity levels, sleep patterns, and more.',
    status: 'coming soon',
    aiHint: 'wearable sync smart watch',
  },
  {
    icon: GradientBrain,
    title: 'Mental Wellness Support',
    description: 'Access tools, guided meditations, and insights for mental well-being.',
    longDescription: 'Your mental health is just as important. Access a library of resources including guided meditations, stress-relief exercises, mood tracking, and AI-driven insights to support your mental well-being journey.',
    status: 'coming soon',
    aiHint: 'mental health meditation',
  },
  {
    icon: GradientZap,
    title: 'AI Nutrition Planner',
    description: 'Personalized meal plans and nutritional advice based on your health goals.',
    longDescription: 'Achieve your dietary goals with AI-powered meal planning. Get personalized meal suggestions, recipes, and nutritional breakdowns tailored to your preferences, allergies, and health objectives.',
    status: 'coming soon',
    aiHint: 'nutrition plan healthy food',
  }
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.05 } },
};

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [10, -10]);
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { width, height, left, top } = rect;
    const mouseX = event.clientX - left;
    const mouseY = event.clientY - top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 200);
    y.set(yPct * 200);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, scale: 1, backdropFilter: 'blur(4px)', transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.9, backdropFilter: 'blur(0px)', transition: { duration: 0.2, ease: 'easeIn' } },
  };

  const modalContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative flex"
    >
      <div
        style={{
            transform: "translateZ(20px)",
            transformStyle: "preserve-3d",
        }}
        className="h-full w-full relative"
      >
        {/* Initial Card Content */}
        <div className="h-full w-full flex flex-col shadow-soft-lg rounded-2xl overflow-hidden p-6 bg-card/90 backdrop-blur-sm border border-border/50 hover:bg-card transition-all duration-300 group">
          <CardHeader className="items-center text-center p-0 mb-4" style={{ transform: "translateZ(40px)" }}>
            <motion.div
              className={`p-3.5 rounded-full mb-3 inline-block transition-colors duration-300 ${feature.status === 'coming soon' ? 'bg-muted' : 'bg-primary/10 group-hover:bg-primary/20'}`}
            >
              <feature.icon className={`h-10 w-10 md:h-12 md:h-12 transition-colors duration-300 ${feature.status === 'coming soon' ? 'text-muted-foreground' : 'text-primary group-hover:text-primary/90'}`} />
            </motion.div>
            <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">{feature.title}</CardTitle>
            {feature.status === 'coming soon' && (
              <span className="mt-1.5 text-xs bg-violet-accent text-violet-accent-foreground px-2 py-0.5 rounded-full font-medium tracking-wide">COMING SOON</span>
            )}
          </CardHeader>
          <CardContent className="text-center flex-grow p-0" style={{ transform: "translateZ(30px)" }}>
            <p className={`text-sm md:text-base leading-relaxed ${feature.status === 'coming soon' ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>{feature.description}</p>
          </CardContent>
          {feature.longDescription && (
            <div className="mt-4 text-center" style={{ transform: "translateZ(20px)" }}>
              <Button
                variant="link"
                className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
                onClick={() => setIsExpanded(true)}
              >
                Learn More
              </Button>
            </div>
          )}
        </div>
        
        {/* Modal Overlay */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute inset-0 z-10 p-6 flex flex-col bg-card/80 backdrop-blur-sm rounded-2xl border-2 border-primary/50 shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={modalContentVariants} className="flex flex-col h-full">
                <motion.div variants={modalContentVariants} className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                        <feature.icon className="h-8 w-8 text-primary mr-3" />
                        <h2 className="text-2xl font-bold text-foreground">{feature.title}</h2>
                    </div>
                    <motion.button onClick={() => setIsExpanded(false)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} className="p-1 rounded-full bg-secondary hover:bg-secondary/80">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </motion.button>
                </motion.div>
                <motion.p variants={modalContentVariants} className="text-base text-muted-foreground leading-relaxed flex-grow">
                  {feature.longDescription}
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


export default function FeaturesPage() {
  return (
    <motion.div
      className="container mx-auto max-w-6xl py-12"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center mb-10 md:mb-14">
        <motion.h1
            className="text-4xl md:text-5xl font-extrabold"
            variants={sectionVariants}
        >Explore LifeSync AI Features</motion.h1>
        <motion.p
            className="text-lg md:text-xl text-muted-foreground mt-3 max-w-3xl mx-auto"
            variants={sectionVariants}
        >
          Discover the innovative tools designed to empower your health and well-being, with more exciting features on the way.
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-12"
        variants={sectionVariants}
        style={{ perspective: '1000px' }}
      >
        {featuresList.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </motion.div>
    </motion.div>
  );
}
