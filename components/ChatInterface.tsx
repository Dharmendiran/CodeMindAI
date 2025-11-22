import React, { useState, useRef, useEffect } from 'react';
import { Menu, PanelLeftOpen } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { InputArea } from './InputArea';
import { ChatSession, Message } from '../types';
import { streamChatResponse } from '../services/geminiService';
import { generateId } from '../utils';

interface ChatInterfaceProps {
  session: ChatSession | undefined;
  onUpdateMessages: (messages: Message[]) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  session, 
  onUpdateMessages,
  isSidebarOpen,
  toggleSidebar
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!session) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    const newMessages = [...session.messages, userMessage];
    onUpdateMessages(newMessages);
    setIsLoading(true);

    const botMessageId = generateId();
    const botMessage: Message = {
        id: botMessageId,
        role: 'model',
        content: '',
        timestamp: Date.now(),
        isStreaming: true
    };
    
    onUpdateMessages([...newMessages, botMessage]);

    try {
      let currentContent = '';
      await streamChatResponse(
        newMessages.slice(0, -1), 
        text, 
        (chunk) => {
           currentContent = chunk;
           onUpdateMessages([...newMessages, { ...botMessage, content: currentContent }]);
        }
      );
      onUpdateMessages([...newMessages, { ...botMessage, content: currentContent, isStreaming: false }]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: generateId(),
        role: 'model',
        content: error instanceof Error ? `Error: ${error.message}` : "Sorry, I encountered an error.",
        timestamp: Date.now()
      };
      onUpdateMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
      setIsLoading(false);
  };

  if (!session) {
    return (
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 relative">
      {/* Mobile Header - Sticky at top */}
      <div className="sticky top-0 z-20 flex items-center p-3 text-gray-600 bg-white/80 dark:bg-gray-900/90 backdrop-blur-md md:hidden border-b border-gray-100 dark:border-gray-800">
        <button onClick={toggleSidebar} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <Menu size={20} />
        </button>
        <span className="ml-2 font-semibold text-gray-800 dark:text-gray-100 truncate flex-1 text-center pr-8">
          {session.title}
        </span>
      </div>

      {/* Desktop Sidebar Toggle - Absolute positioned */}
      {!isSidebarOpen && (
        <div className="hidden md:block absolute top-3 left-3 z-20">
          <button 
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors shadow-sm"
            title="Open sidebar"
          >
            <PanelLeftOpen size={20} />
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto w-full custom-scrollbar relative">
        {session.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl mb-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800 dark:text-gray-100"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">CodeMind AI</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              Your intelligent coding companion. Ask me to debug code, explain concepts, or build something new.
            </p>
          </div>
        ) : (
          <div className="flex flex-col pb-4 pt-2 md:pt-0">
            {session.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom of flex container */}
      <div className="w-full bg-white dark:bg-gray-900 z-20">
        <InputArea 
            onSend={handleSendMessage} 
            isLoading={isLoading} 
            onStop={handleStop}
        />
      </div>
    </div>
  );
};