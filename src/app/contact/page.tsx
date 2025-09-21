
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Send, HelpCircle, Users, MessageSquare, User, Edit3, Info, Globe, MessageCircleQuestion } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import Image from 'next/image';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const faqItems = [
  {
    id: "faq-1",
    question: "How do I get started with LifeSync AI?",
    answer: "Getting started is easy! Simply download the app from the Google Play Store, create an account, and you can begin exploring features like the AI Health Chatbot and Symptom Checker right away. Follow the in-app tutorial for a quick overview."
  },
  {
    id: "faq-2",
    question: "Is the LifeSync AI app free to use?",
    answer: "Yes, the core features of LifeSync AI are completely free. We believe essential health tools should be accessible to everyone. We may introduce optional premium features in the future for advanced functionalities."
  },
  {
    id: "faq-3",
    question: "How accurate is the AI Health Chatbot?",
    answer: "Our AI Health Chatbot is trained on a vast dataset of medical information and is designed to provide helpful guidance and information. However, it is not a substitute for professional medical advice. Always consult a doctor for diagnoses and treatment."
  },
  {
    id: "faq-4",
    question: "Can I suggest a new feature or report a bug?",
    answer: "Absolutely! We value user feedback. Please use the contact form on this page or email us directly at lifesync.help@gmail.com. Your input helps us improve LifeSync AI for everyone."
  }
];

const pageFadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const blockEntryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const faqSectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } },
};

const faqItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  }),
};


const cardHoverEffect = {
  rest: { scale: 1, y:0, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"}, 
  hover: { 
    scale: 1.03, 
    y: -5, 
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)", 
    transition: { type: "spring", stiffness: 300, damping: 15 }
  }
};

const buttonHoverTapVariants = {
 hover: { scale: 1.03, transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 10 } },
 tap: { scale: 0.97 }
};

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  function onSubmit(data: ContactFormValues) {
    console.log(data); 
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
      variant: "default",
    });
    form.reset();
  }

  return (
    <motion.div 
      className="container mx-auto max-w-6xl space-y-12 md:space-y-16 bg-gradient-to-b from-background via-slate-50 to-background min-h-screen py-12"
      variants={pageFadeInVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section 
        className="text-center"
        variants={blockEntryVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Card className="max-w-3xl mx-auto shadow-soft-lg rounded-2xl p-6 md:p-8 bg-card/90 backdrop-blur-sm border-border/50 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
          <CardHeader className="p-0">
            <div className="flex items-center justify-center text-primary mb-3">
              <Mail className="h-10 w-10 md:h-12 md:w-12 mr-4" />
              <h1 className="text-4xl md:text-5xl font-extrabold">Get In Touch</h1>
            </div>
            <CardDescription className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
              We're here to help! Whether you have a question, feedback, or need support, feel free to reach out.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 items-stretch">
        <motion.div
          className="lg:col-span-2"
          variants={blockEntryVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className="shadow-soft-lg rounded-2xl p-6 md:p-8 bg-card/90 backdrop-blur-sm border-border/50 h-full flex flex-col">
            <CardHeader className="p-0 mb-6 text-center md:text-left">
              <CardTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start text-foreground">
                <MessageSquare className="mr-3 h-7 w-7 text-primary" /> Send Us a Message
              </CardTitle>
              <CardDescription className="text-base mt-1.5">Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-grow flex flex-col">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex flex-col h-full">
                  <div className="flex-grow space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base flex items-center text-foreground"><User className="mr-2 h-4 w-4 text-primary/80"/>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="rounded-lg text-base py-5 px-4 bg-background/70 border-border focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/30" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base flex items-center text-foreground"><Mail className="mr-2 h-4 w-4 text-primary/80"/>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} className="rounded-lg text-base py-5 px-4 bg-background/70 border-border focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/30" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="flex flex-col flex-grow">
                          <FormLabel className="text-base flex items-center text-foreground"><Edit3 className="mr-2 h-4 w-4 text-primary/80"/>Your Message</FormLabel>
                          <FormControl className="flex-grow">
                            <Textarea
                              placeholder="Tell us how we can help..."
                              className="min-h-[120px] rounded-lg text-base p-4 bg-background/70 border-border focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/30 h-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <motion.div 
                    variants={buttonHoverTapVariants} 
                    whileHover="hover" 
                    whileTap="tap" 
                    className="pt-1 group mt-auto" 
                  >
                    <Button type="submit" className="w-full rounded-xl shadow-soft-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-primary-foreground px-6 py-3 text-lg font-semibold">
                      <Send className="mr-2 h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" /> Send Message
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-span-1 space-y-8 md:space-y-10 flex flex-col h-full">
          <motion.div 
            variants={blockEntryVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            whileHover={cardHoverEffect.hover} animate="rest"
          >
            <Card className="shadow-soft-lg rounded-2xl p-6 bg-card/90 backdrop-blur-md border-border/50">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-xl font-semibold flex items-center text-foreground">
                  <Info className="mr-2.5 h-5 w-5 text-primary" /> Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-muted-foreground p-0">
                <div className="flex items-start text-sm">
                  <Mail className="mr-2 h-4 w-4 text-primary/80 shrink-0 mt-0.5" /> <div><strong className="text-foreground/90 block">Support Email:</strong> lifesync.help@gmail.com</div>
                </div>
                <div className="flex items-start text-sm">
                  <Globe className="mr-2 h-4 w-4 text-primary/80 shrink-0 mt-0.5" /> <div><strong className="text-foreground/90 block">Location:</strong> Student Project (Online)</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            variants={blockEntryVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3, delay: 0.1 }}
            whileHover={cardHoverEffect.hover} animate="rest" className="flex-grow"
          >
             <Card className="shadow-soft-lg rounded-2xl p-6 bg-card/90 backdrop-blur-md border-border/50 h-full">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-xl font-semibold flex items-center text-foreground">
                  <Users className="mr-2.5 h-5 w-5 text-primary" /> Connect With Us
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-3 text-sm">Follow us on social media for updates:</p>
                <div className="flex space-x-2.5">
                  {[
                    {Icon: Instagram, label: "Instagram", href: "#"},
                    {Icon: Linkedin, label: "LinkedIn", href: "#"},
                    {Icon: Twitter, label: "Twitter", href: "#"}
                  ].map(social => (
                    <motion.a 
                      key={social.label} 
                      href={social.href} 
                      aria-label={social.label} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      variants={buttonHoverTapVariants} whileHover="hover" whileTap="tap"
                      className="p-2.5 bg-secondary/50 hover:bg-secondary rounded-full text-primary border border-transparent hover:border-primary/30 transition-colors"
                    >
                      <social.Icon className="h-5 w-5"/>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <motion.section 
        className="py-10 md:py-12" 
        variants={faqSectionVariants} // This section will stagger its children
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center text-primary mb-2">
            <MessageCircleQuestion className="h-8 w-8 md:h-10 md:h-10 mr-2" /> 
            <h2 className="text-3xl md:text-4xl font-bold">Help & Support FAQ</h2>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto bg-card/80 backdrop-blur-md p-2 md:p-4 rounded-2xl shadow-soft-lg border-border/50">
          {faqItems.map((item, index) => (
            <motion.div 
              key={item.id}
              custom={index} // For staggering delay
              variants={faqItemVariants} // Individual item animation
            >
              <AccordionItem value={item.id} className="border-b border-border/60 last:border-b-0 px-2 md:px-0">
                <AccordionTrigger className="py-4 text-md md:text-lg font-semibold hover:no-underline text-left text-foreground hover:text-primary data-[state=open]:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-0.5 text-sm md:text-base text-muted-foreground leading-relaxed">
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

    