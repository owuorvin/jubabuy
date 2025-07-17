'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface ChatbaseWidgetProps {
  userId?: string;
  userHash?: string;
}

declare global {
  interface Window {
    chatbase: any;
  }
}

export default function ChatbaseWidget({ userId, userHash }: ChatbaseWidgetProps = {}) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Show welcome message after 3 seconds (desktop only)
    const timer = setTimeout(() => {
      if (!isMobile) {
        setShowWelcome(true);
      }
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  useEffect(() => {
    // Initialize Chatbase
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args: any[]) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      
      window.chatbase = new Proxy(window.chatbase, {
        get(target: any, prop: string) {
          if (prop === "q") {
            return target.q;
          }
          return (...args: any[]) => target(prop, ...args);
        }
      });
    }

    // Load the Chatbase script
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "NYZBtkSlaNopeEnLGvYMx";
    script.setAttribute("domain", "www.chatbase.co");
    script.async = true;
    
    script.onload = () => {
      // Configure identity verification if provided
      if (userId && userHash) {
        window.chatbase("boot", {
          userId: userId,
          userHash: userHash,
        });
      }
    };
    
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.getElementById("NYZBtkSlaNopeEnLGvYMx");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [userId, userHash]);

  const handleDismissWelcome = () => {
    setShowWelcome(false);
  };

  const handleOpenChat = () => {
    window.chatbase('open');
    setShowWelcome(false);
  };

  // Don't show welcome on mobile
  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Welcome notification - desktop only */}
      {showWelcome && !isMobile && (
        <div className="fixed bottom-24 right-4 z-40 animate-in slide-in-from-right duration-300 hidden md:block">
          <div className="bg-white rounded-lg shadow-2xl p-4 max-w-xs border border-gray-100">
            <button
              onClick={handleDismissWelcome}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <MessageCircle className="w-10 h-10 text-blue-600" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Need help? 👋
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  I'm your AI assistant. I can help you find properties, cars, or answer any questions about JUBABUY!
                </p>
                <button
                  onClick={handleOpenChat}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Chat with me
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}