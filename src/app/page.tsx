
"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Stethoscope, Droplets, HeartPulse, MessageCircle, Download, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Robot from "../assets/Robot.png"
import About from "../assets/About_lifesync.png"

const featureHighlights = [
  {
    icon: (props: any) => (
      <svg {...props} width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--violet-accent))" />
          </linearGradient>
        </defs>
        <path d="M12 8V4H8V8H4V12H8V16H12V12H16V8H12Z" fill="url(#grad1)" fillOpacity="0.3"/>
        <path d="M20 18H4V12H2V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V12H20V18Z" fill="url(#grad1)"/>
        <path d="M18 4H6C4.89543 4 4 4.89543 4 6V12H6V6H18V12H20V6C20 4.89543 19.1046 4 18 4Z" fill="url(#grad1)"/>
        <circle cx="8" cy="15" r="1" fill="url(#grad1)" fillOpacity="0.7"/>
        <circle cx="16" cy="15" r="1" fill="url(#grad1)" fillOpacity="0.7"/>
      </svg>
    ),
    title: 'AI Health Chatbot',
    description: 'Get smart responses and guidance for your health questions.',
    aiHint: 'chatbot interface person'
  },
  {
    icon: (props: any) => (
       <svg {...props} width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--violet-accent))" />
          </linearGradient>
        </defs>
        <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12V18H4V12Z" fill="url(#grad2)" fillOpacity="0.3"/>
        <path d="M12 4C11.4477 4 11 4.44772 11 5V7C11 7.55228 11.4477 8 12 8C12.5523 8 13 7.55228 13 7V5C13 4.44772 12.5523 4 12 4Z" fill="url(#grad2)"/>
        <path d="M10 2H14C15.1046 2 16 2.89543 16 4V4C16 5.10457 15.1046 6 14 6H10C8.89543 6 8 5.10457 8 4V4C8 2.89543 8.89543 2 10 2Z" fill="url(#grad2)"/>
        <path d="M20 12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V12" stroke="url(#grad2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
    ),
    title: 'Symptom Checker',
    description: 'Assess symptoms and understand potential next steps.',
    aiHint: 'medical diagnosis tool'
  },
  {
    icon: (props: any) => (
      <svg {...props} width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--violet-accent))" />
          </linearGradient>
        </defs>
        <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.5 12 22 12 22C12 22 19 13.5 19 9C19 5.13401 15.866 2 12 2Z" fill="url(#grad3)" fillOpacity="0.3"/>
        <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.5 12 22 12 22C12 22 19 13.5 19 9C19 5.13401 15.866 2 12 2Z" stroke="url(#grad3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" fill="url(#grad3)" fillOpacity="0.5"/>
      </svg>
    ),
    title: 'Water Tracker',
    description: 'Personalized hydration goals to keep you refreshed.',
    aiHint: 'water bottle glass'
  },
  {
    icon: (props: any) => (
      <svg {...props} width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3G.org/2000/svg">
        <defs>
          <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--violet-accent))" />
          </linearGradient>
        </defs>
        <path d="M3 12H7L9.5 5L14.5 19L17 12H21" stroke="url(#grad4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M20.84,10.61a9,9,0,1,0-17.68,0" stroke="url(#grad4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#grad4)" fillOpacity="0.2"/>
      </svg>
    ),
    title: 'Health Dashboard',
    description: 'Monitor your vital health stats in one place (Coming Soon).',
    aiHint: 'health chart graph'
  },
];

const testimonials = [
  {
    quote: "LifeSync AI has revolutionized how I approach my health. The AI chatbot is incredibly helpful!",
    name: "Sarah L.",
    role: "Beta User",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "woman smiling"
  },
  {
    quote: "The symptom checker gave me peace of mind and clear directions. Highly recommend this app.",
    name: "John B.",
    role: "Early Adopter",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "man thinking"
  },
  {
    quote: "LifeSync AI has truly changed how I manage my health. So easy and reliable!",
    name: "Alex M.",
    role: "Beta User, 2025",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "person happy"
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const cardHoverVariants = {
  rest: { scale: 1, y: 0, rotateY: 0, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"},
  hover: { 
    scale: 1.05,
    y: -8,
    rotateY: 5,
    boxShadow: "0px 10px 30px -5px hsl(var(--primary) / 0.2)",
    transition: { duration: 0.25, type: "spring", stiffness:300, damping:15 } 
  }
};

const buttonHoverTapVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.97 }
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden"> {/* Added overflow-x-hidden */}
      {/* Hero Section */}
      <motion.section 
        className="w-full bg-gradient-to-br from-background via-sky-50 to-background py-12 md:py-16 lg:py-20" // Reduced padding
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-8 md:gap-12 items-center"> {/* Reduced gap */}
          <motion.div 
            className="space-y-5 text-center md:text-left" // Reduced space-y
            variants={itemVariants} custom={0}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-balance">
              LifeSync AI: Your <span className="bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent">AI-Powered</span> Health Companion
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto md:mx-0">
              Trusted by over 10,000+ users to support their health journey with intelligent insights and real-time AI support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center md:justify-start"> {/* Reduced gap & pt */}
              <motion.div variants={buttonHoverTapVariants} whileHover="hover" whileTap="tap">
                <Button asChild size="lg" className="rounded-full shadow-soft-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-primary-foreground w-full sm:w-auto px-7 py-3 text-base font-semibold">
                  <Link href="/download">
                    <Download className="mr-2 h-5 w-5" /> Download for Android
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={buttonHoverTapVariants} whileHover="hover" whileTap="tap">
                <Button variant="outline" size="lg" asChild className="rounded-full shadow-soft hover:shadow-soft-lg border-primary text-primary hover:bg-primary/5 w-full sm:w-auto px-7 py-3 text-base font-semibold">
                  <Link href="/features">
                    Learn More <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants} custom={1}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, type: "spring", stiffness: 100 }}
          >
            <Image
              src={Robot}
              alt="AI Healthcare Technology Interface"
              width={600}
              height={500}
              className="rounded-2xl mx-auto" // Updated shadow
              data-ai-hint="healthcare ai technology"
              priority
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Feature Highlights Section */}
      <motion.section 
        className="w-full py-12 md:py-16 bg-secondary/30" // Reduced padding
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-12"> {/* Reduced mb */}
            <h2 className="text-3xl md:text-4xl font-bold">Discover What LifeSync Offers</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Powerful tools designed for your well-being, backed by intelligent AI.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"> {/* Reduced gap */}
            {featureHighlights.map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={itemVariants}
                whileHover="hover" initial="rest" animate="rest" // For Framer Motion variants
                className="flex" // Added for consistent height
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  variants={cardHoverVariants}
                  className="w-full"
                >
                  <Card className="text-center shadow-soft-lg rounded-2xl h-full flex flex-col p-6 bg-card/90 backdrop-blur-sm border border-border/50 hover:bg-card transition-colors duration-200">
                    <CardHeader className="items-center p-0 mb-3">
                      <div className="p-3.5 bg-primary/10 rounded-full inline-block group-hover:bg-primary/20 transition-colors duration-200">
                        <feature.icon className="h-10 w-10 text-primary" />
                      </div>
                    </CardHeader>
                    <CardTitle className="text-lg md:text-xl font-semibold mb-1.5">{feature.title}</CardTitle>
                    <CardContent className="p-0 flex-grow">
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About LifeSync Section */}
      <motion.section 
        className="w-full py-12 md:py-16" // Reduced padding
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-10 md:gap-12 items-center"> {/* Reduced gap */}
          <motion.div
             variants={itemVariants} custom={0}
          >
            <Image
              src= {About}
              alt="Person using health app on a modern device"
              width={550}
              height={450}
              className="rounded-2xl" // Updated shadow
              data-ai-hint="health app lifestyle"
            />
          </motion.div>
          <motion.div 
            className="space-y-4" // Reduced space-y
            variants={itemVariants} custom={1}
          >
            <h2 className="text-3xl md:text-4xl font-bold">About LifeSync AI</h2>
            <p className="text-base md:text-lg text-muted-foreground">
              LifeSync AI is more than just an app; it's a compassionate partner in your health journey. We leverage cutting-edge AI to provide accessible, personalized health support. Whether you're seeking quick answers, tracking your habits, or managing symptoms, LifeSync AI is designed to empower you with the knowledge and tools you need for a healthier life.
            </p>
            <motion.div variants={buttonHoverTapVariants} whileHover="hover" whileTap="tap" className="inline-block pt-1">
              <Button asChild size="lg" className="rounded-full shadow-soft-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-primary-foreground px-7 py-3 text-base font-semibold">
                <Link href="/about">
                  Learn More About Our Mission
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="w-full py-12 md:py-16 bg-secondary/30" // Reduced padding
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-12"> {/* Reduced mb */}
            <h2 className="text-3xl md:text-4xl font-bold">Loved by Users</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">Here's what people are saying about LifeSync AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"> {/* Reduced gap */}
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={itemVariants}
                whileHover={cardHoverVariants.hover} initial="rest" animate="rest"
                className="flex" // For equal height
              >
                <Card className="shadow-soft-lg rounded-2xl h-full flex flex-col p-6 bg-card/90 backdrop-blur-sm border border-border/50 hover:bg-card transition-colors duration-200">
                  <CardContent className="p-0 flex-grow flex flex-col">
                    <div className="flex items-center mb-3">
                       <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="rounded-full mr-3 border-2 border-primary/30" data-ai-hint={testimonial.aiHint}/>
                        <div>
                            <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                            <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                    </div>
                    <MessageCircle className="h-6 w-6 text-accent mb-2" />
                    <p className="text-muted-foreground mb-4 italic flex-grow text-sm">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call-to-Action Section */}
      <motion.section 
        className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-r from-blue-700 via-violet-700 to-pink-600 text-primary-foreground" // Updated gradient
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance" // Reduced mb
            variants={itemVariants} custom={0}
          >Ready to Take Control of Your Health?</motion.h2>
          <motion.p 
            className="text-lg md:text-xl mb-6 max-w-2xl mx-auto text-primary-foreground/80" // Reduced mb
            variants={itemVariants} custom={1}
          >
            Join thousands of users who are already benefiting from AI-powered health insights. Download LifeSync AI today and start your journey to a healthier you.
          </motion.p>
          <motion.div variants={buttonHoverTapVariants} whileHover="hover" whileTap="tap" className="inline-block" custom={2} >
            <Button
              size="lg"
              asChild
              className="rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-soft-xl hover:shadow-2xl px-8 py-3.5 text-base font-semibold" // Enhanced shadow, py
            >
              <Link href="/download">
                <Download className="mr-2 h-5 w-5" /> Download The App Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

    