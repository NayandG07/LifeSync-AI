"use client";
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Lightbulb, Search, DraftingCompass, Code2, FlaskConical, Smartphone, TrendingUp, HeartHandshake, Eye, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Student from "../../assets/STUDENT_INITIATIVE.png";
import Research from "../../assets/Research.png";
import Lifesync from "../../assets/Why_Lifesync.png";

const teamMembers = [
  {
    name: "Student Initiative Team",
    role: "Passionate about AI + Healthcare",
    image: Student,
    aiHint: "team diverse students",
    bio: "Built by passionate student developers focused on health-tech and artificial intelligence innovation, aiming to make a positive impact on personal health management."
  },
  {
    name: "AI Research & Development",
    role: "Innovating Health Solutions",
    image: Research,
    aiHint: "research lab scientists",
    bio: "Dedicated to pushing the boundaries of AI in healthcare to create more personalized and effective tools for everyone."
  }
];

interface NewTimelineEvent {
  id: string;
  displayTitle: string;
  subtitle: string;
  detail: string;
  icon: React.ElementType;
  dateShort: string;
  watermarkIcon?: React.ElementType;
}

const newTimelineEvents: NewTimelineEvent[] = [
  {
    id: "event-1",
    dateShort: "Jan 2025",
    displayTitle: "Idea Began",
    subtitle: "Inspired by Global Goals",
    detail: "Sparked from Sustainable Development Goal 3 (Good Health & Well-being), after observing health issues among peers and society.",
    icon: Lightbulb,
    watermarkIcon: Lightbulb,
  },
  {
    id: "event-2",
    dateShort: "Feb 2025",
    displayTitle: "Research & Validation",
    subtitle: "Understanding the Need",
    detail: "Conducted online surveys, studied few WHO guidelines, collected feedback and ideas from friends and faculty.",
    icon: Search,
    watermarkIcon: Search,
  },
  {
    id: "event-3",
    dateShort: "March 2025",
    displayTitle: "Planning the Platform",
    subtitle: "Feature Blueprint",
    detail: "Sketched the architecture, planned core features like AI chatbot, symptom checker, water tracker, and medication reminders.",
    icon: DraftingCompass,
    watermarkIcon: DraftingCompass,
  },
  {
    id: "event-4",
    dateShort: "June 2025",
    displayTitle: "Development Begins",
    subtitle: "Code Meets Design",
    detail: "Started building the app while still learning about it, using Firebase, backend and integrated Google Gemini API for chatbot interface.",
    icon: Code2,
    watermarkIcon: Code2,
  },
  {
    id: "event-5",
    dateShort: "July 2025",
    displayTitle: "Alpha Testing",
    subtitle: "Students First",
    detail: "Internally tested among friends, faculties and cousins, while taking feedback along, and feature refinement was done in this phase.",
    icon: FlaskConical,
    watermarkIcon: FlaskConical,
  },
  {
    id: "event-6",
    dateShort: "July 2025",
    displayTitle: "Web Version released",
    subtitle: "Public Access Begins",
    detail: "Publicly released the web version of LifeSync after all the improvements and refinements, with a simple, standard yet efficient UI.",
    icon: Smartphone,
    watermarkIcon: Smartphone,
  },
  {
    id: "event-7",
    dateShort: "Future",
    displayTitle: "Growth & Expansion",
    subtitle: "Health Nation 2.0",
    detail: "Working on future improvements like upcoming wearable integration, iOS version, premium dashboard, and health analytics.",
    icon: TrendingUp,
    watermarkIcon: TrendingUp,
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" }
  }),
};

const cardHoverVariants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: "0px 8px 20px rgba(0,0,0,0.07)",
    transition: { type: "spring", stiffness: 400, damping: 15 }
  },
  hover: {
    y: -5,
    scale: 1.05,
    boxShadow: "0px 15px 30px rgba(0,0,0,0.12)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  }
};

export default function AboutUsPage() {
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      timelineScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="container mx-auto max-w-6xl space-y-12 md:space-y-16 py-12"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      {/* Mission Section */}
      <motion.section className="text-center" variants={itemVariants}>
          <CardHeader className="p-0 items-center">
            <div className="inline-flex items-center text-primary mb-4">
              <HeartHandshake className="h-12 w-12 md:h-14 mr-4" />
              <h1 className="text-4xl md:text-5xl font-extrabold">Our Mission</h1>
            </div>
            <CardDescription className="text-lg text-muted-foreground max-w-7xl mx-auto leading-relaxed">
              At LifeSync AI, our mission is to revolutionize personal health management by empowering individuals with cutting-edge, AI-driven solutions designed for intuitive interaction and seamless usability. Our commitment is to create a trustworthy digital companion that supports users in their wellness journey, promoting informed decisions, early detection of health issues, and a positive lifestyle transformation, by bridging the gap between technology and healthcare, making proactive self-care accessible to everyone.
            </CardDescription>
          </CardHeader>
      </motion.section>

      {/* Why LifeSync Section */}
      <motion.section className="grid md:grid-cols-2 gap-8 md:gap-10 items-center" variants={sectionVariants}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, ease: "circOut" }}>
          <Image src={Lifesync} alt="Technology enhancing healthcare" width={600} height={450} className="rounded-2xl shadow-soft-lg" data-ai-hint="healthcare innovation team" />
        </motion.div>
        <motion.div className="space-y-4" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold">Why We Built LifeSync AI</h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Many people hesitate to talk to doctors due to various reasons – be it time constraints, fear, or lack of access. We saw an opportunity to leverage the power of Artificial Intelligence to create a supportive, informative, and readily available health companion.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            LifeSync AI was born from a desire to democratize health information and provide preliminary guidance, encouraging users to be more proactive about their health and seek professional help when necessary.
          </p>
        </motion.div>
      </motion.section>

      {/* Team Section */}
      <motion.section className="bg-secondary/30 py-10 md:py-12 rounded-2xl" variants={sectionVariants}>
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center text-primary mb-2">
              <Users className="h-8 w-8 md:h-10 mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold">The Team Behind LifeSync AI</h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground mt-2">A student initiative, passionate about AI + Healthcare.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div key={index} custom={index} variants={itemVariants} className="flex" whileHover={{ y: -5, boxShadow: "0px 10px 25px rgba(0,0,0,0.1)" }} viewport={{ once: true, amount: 0.5 }}>
                <Card className="w-full text-center shadow-lg rounded-2xl p-6 bg-card/90 backdrop-blur-sm border border-border/50 flex flex-col h-full">
                  <CardHeader className="items-center p-0 mb-4">
                    <Image src={member.image} alt={member.name} width={100} height={100} className="rounded-full mb-3 border-4 border-primary/20 shadow-md" data-ai-hint={member.aiHint} />
                    <CardTitle className="text-xl font-semibold text-foreground">{member.name}</CardTitle>
                    <p className="text-primary text-xs font-medium">{member.role}</p>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow">
                    <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Vision and Goals Section */}
      <motion.section className="grid md:grid-cols-2 gap-8 md:gap-10 items-start" variants={sectionVariants}>
        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex items-center text-primary">
            <Eye className="h-8 w-8 md:h-10 mr-2 transform hover:rotate-180 transition-transform duration-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600">Our Vision</h2>
          </div>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            We aim to make advanced healthcare accessible to every individual through intelligent design and AI innovation. Our vision is to create a future where AI seamlessly integrates with personal health management, making proactive and personalized healthcare support a reality for everyone, everywhere.
          </p>
        </motion.div>
        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex items-center text-primary">
            <TrendingUp className="h-8 w-8 md:h-10 mr-2 transform transition-transform duration-700 hover:rotate-[360deg]" />
            <h2 className="text-3xl md:text-4xl font-bold">Future Goals</h2>
          </div>
          <ul className="space-y-2 text-base md:text-lg text-muted-foreground">
            {[
              "Expanding our range of intelligent health features.",
              "Integrating with wearable devices for comprehensive health tracking.",
              "Offering premium plans with advanced functionalities.",
              "Continuously improving AI capabilities for even smarter support."
            ].map((goal, i) => (
              <motion.li key={i} className="flex items-start" custom={i} variants={itemVariants} viewport={{ once: true, amount: 0.8 }}>
                <CheckCircle className="h-5 w-5 text-accent mr-2 mt-1 shrink-0" />
                <span className="leading-relaxed text-sm md:text-base">{goal}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.section>

      {/* Roadmap Section */}
      <motion.section className="py-2 md:py-6 bg-gradient-to-br from-sky-50 via-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl overflow-hidden" variants={sectionVariants}>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Our Journey & Roadmap</h2>
          <p className="text-base md:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto mb-7">
            Charting the course for a healthier future, step by step.
          </p>
        </div>

        <div className="relative container mx-auto max-w-full md:max-w-6xl px-0 md:px-6">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 bg-card/70 hover:bg-card dark:bg-slate-700/70 dark:hover:bg-slate-600 shadow-lg hidden md:flex disabled:opacity-30 rounded-full"
            onClick={() => scrollTimeline('left')}
            aria-label="Scroll left"
            disabled={isMobile}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 bg-card/70 hover:bg-card dark:bg-slate-700/70 dark:hover:bg-slate-600 shadow-lg hidden md:flex disabled:opacity-30 rounded-full"
            onClick={() => scrollTimeline('right')}
            aria-label="Scroll right"
            disabled={isMobile}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div
            ref={timelineScrollRef}
            className="grid grid-flow-col auto-cols-[270px] md:auto-cols-[310px] overflow-x-auto gap-3 md:gap-5 py-4 px-4 md:px-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
          >
            {newTimelineEvents.map((event) => {
              const IconComponent = event.icon;
              const WatermarkIcon = event.watermarkIcon;

              return (
                <motion.div key={event.id} className="snap-center relative">
                  <motion.div
                    className={cn(
                      "w-full rounded-2xl bg-gradient-to-br from-white via-sky-50 to-white dark:from-slate-800 dark:via-slate-800/50 dark:to-slate-800 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 transition-all duration-100 ease-in-out overflow-hidden flex flex-col shadow-lg relative group-hover:shadow-xl group-hover:ring-1 group-hover:ring-primary/40",
                      "pt-6 px-4 pb-6"
                    )}
                    initial="rest"
                    whileHover="hover"
                    variants={cardHoverVariants}
                  >
                    {WatermarkIcon && (
                      <WatermarkIcon className="absolute top-3 right-3 h-10 w-10 text-primary/10 dark:text-primary/5 transition-opacity duration-300 group-hover:opacity-50" />
                    )}
                    <div className="flex items-start mb-1">
                      <IconComponent className="w-6 h-6 text-primary mr-2 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-foreground leading-tight">{event.dateShort} – {event.displayTitle}</h3>
                        <p className="text-xs text-muted-foreground">{event.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center my-5">
                      <div className="flex-grow border-t border-slate-200/40 dark:border-slate-700/40 relative">
                        <div className="absolute -top-2 left-1/2 w-3 h-3 bg-primary rounded-full shadow"></div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground leading-relaxed mt-2 flex-grow">
                      {event.detail}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
