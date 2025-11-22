import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { Bot, User, Copy, Check } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`w-full py-6 md:py-8 border-b border-black/5 dark:border-white/5 ${isUser ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-950'}`}>
      <div className="max-w-3xl mx-auto px-4 md:px-6 flex gap-4 md:gap-6">
        <div className="shrink-0 flex flex-col relative items-end">
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${isUser ? 'bg-gray-200 dark:bg-gray-700' : 'bg-green-600'}`}>
            {isUser ? <User size={18} className="text-gray-600 dark:text-gray-200" /> : <Bot size={18} className="text-white" />}
          </div>
        </div>
        
        <div className="relative flex-1 overflow-hidden min-w-0">
          <div className="font-semibold text-sm mb-1 opacity-90">
            {isUser ? 'You' : 'Assistant'}
          </div>
          <div className="markdown-content text-base leading-7 text-gray-800 dark:text-gray-100 break-words">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  const textContent = String(children).replace(/\n$/, '');

                  if (isInline) {
                    return (
                      <code className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm text-red-500 dark:text-red-400 font-mono break-all" {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div className="relative group my-4 rounded-lg overflow-hidden bg-white border border-gray-200 dark:bg-[#0d1117] dark:border-gray-700/50">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700/50">
                        <span>{match?.[1] || 'code'}</span>
                        <CopyButton text={textContent} />
                      </div>
                      <div className="overflow-x-auto p-4">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </div>
                    </div>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.isStreaming && (
               <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse align-middle" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors"
      title="Copy code"
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
};