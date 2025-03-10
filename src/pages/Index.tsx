
import React from 'react';
import { motion } from 'framer-motion';
import { Infinity } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import ThemeToggle from '@/components/ThemeToggle';
import { ThemeProvider } from '@/hooks/useTheme';
import { BeamsBackground } from '@/components/ui/beams-background';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        {/* Beams Background */}
        <BeamsBackground intensity="medium" />
        
        {/* Header */}
        <header className="fixed w-full top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-border/40 py-4 px-8">
          <div className="container mx-auto flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <Infinity className="text-primary-foreground h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                InfiBot
              </h1>
            </motion.div>
            
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 mt-24 relative z-10">
          {/* Left column - Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/3 space-y-6"
          >
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Welcome to InfiBot</h2>
              <p className="text-muted-foreground mb-4">
                Discover and book event tickets through a simple conversation with our AI assistant.
              </p>
              
              <div className="space-y-3 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Select a City</h3>
                    <p className="text-sm text-muted-foreground">
                      Tell our AI which Indian city you're interested in exploring events in.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Browse Event Categories</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose from cultural events, music concerts, comedy shows, and more.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Select an Event</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse through available events and pick one that interests you.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Book Your Ticket</h3>
                    <p className="text-sm text-muted-foreground">
                      Provide your information and receive your e-ticket instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Why Use InfiBot?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Natural conversation interface</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Discover events across India</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Instant e-tickets with QR codes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Seamless, intuitive booking experience</span>
                </li>
              </ul>
            </div>
          </motion.div>
          
          {/* Right column - Chat Interface */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:w-2/3 h-[600px] glass-panel rounded-2xl overflow-hidden shadow-xl"
          >
            <ChatInterface />
          </motion.div>
        </main>
        
        {/* Footer */}
        <footer className="py-6 px-8 border-t border-border/40 bg-white/30 dark:bg-black/20 backdrop-blur-sm relative z-10">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} InfiBot. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;
