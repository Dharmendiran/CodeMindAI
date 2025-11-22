import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, ArrowUp } from 'lucide-react';

interface InputAreaProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, onStop }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-6 pb-4 md:pb-6 pt-2">
      <div className="relative flex items-end w-full p-3 bg-white dark:bg-gray-800 border border-black/10 dark:border-gray-700 rounded-2xl shadow-sm focus-within:ring-1 focus-within:ring-gray-300 dark:focus-within:ring-gray-600 focus-within:border-transparent transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your code..."
          rows={1}
          className="w-full max-h-[200px] py-2 pr-10 pl-1 bg-transparent border-none focus:ring-0 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 scrollbar-hide leading-6"
          style={{ minHeight: '44px' }}
        />
        <div className="absolute right-3 bottom-3">
          {isLoading ? (
             <button
              onClick={onStop}
              className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
              title="Stop generating"
            >
              <StopCircle size={16} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                input.trim() 
                  ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
      <div className="text-center mt-2 hidden md:block">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          CodeMind can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};