import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { ChatPanel } from '@/components/layout/ChatPanel';
import { StickyChatbotProvider } from '@/components/layout/StickyChatbot';

export const metadata: Metadata = {
  title: 'LifeSync AI - Your AI-Powered Health Companion',
  description: 'LifeSync AI offers an AI-powered health chatbot, symptom checker, water intake tracker, and more to help you manage your health.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background">
        <StickyChatbotProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
          <ChatPanel />
        </StickyChatbotProvider>
      </body>
    </html>
  );
}
