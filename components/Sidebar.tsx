import React from 'react';
import { MessageSquare, Plus, Trash2, X, Moon, Sun, PanelLeftClose } from 'lucide-react';
import { ChatSession, Theme } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onClearAll,
  isOpen,
  toggleSidebar,
  theme,
  toggleTheme
}) => {
  return (
    <>
      {/* Mobile overlay - Only visible on small screens when sidebar is open */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar container */}
      <aside 
        className={`
          fixed md:relative inset-y-0 left-0 z-50
          h-full bg-gray-50 dark:bg-black border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out flex flex-col flex-shrink-0 overflow-hidden
          ${isOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0 w-[260px] md:w-0 md:border-none'}
        `}
      >
        {/* Inner Content Wrapper - Fixed width prevents content from squashing during width transitions */}
        <div className="w-[260px] h-full flex flex-col relative">
          
          {/* Header Area */}
          <div className="p-3 flex items-center justify-between gap-2">
            <button
              onClick={onCreateSession}
              className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-200 shadow-sm"
            >
              <Plus size={16} className="shrink-0" />
              <span className="font-medium">New Chat</span>
            </button>
            
            {/* Desktop Close Button */}
            <button 
              onClick={toggleSidebar}
              className="hidden md:flex p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              title="Close sidebar"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-2 py-2 mb-1">Recent</div>
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group flex items-center gap-3 px-3 py-3 rounded-lg text-sm cursor-pointer transition-colors relative ${
                  currentSessionId === session.id 
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
              >
                <MessageSquare size={16} className="shrink-0 opacity-70" />
                <span className="truncate flex-1 pr-6">{session.title}</span>
                
                {/* Delete button - shows on hover or if active */}
                <button
                  onClick={(e) => onDeleteSession(session.id, e)}
                  className={`absolute right-2 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all ${
                    currentSessionId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  title="Delete chat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Footer Area */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
             <button
              onClick={onClearAll}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
             >
               <Trash2 size={16} className="shrink-0" />
               <span>Clear history</span>
             </button>

             <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-200"
             >
               {theme === 'dark' ? <Sun size={16} className="shrink-0" /> : <Moon size={16} className="shrink-0" />}
               <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
             </button>
          </div>
        </div>
        
        {/* Mobile Close Button (Floating outside the sidebar content) */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden absolute top-3 right-[-40px] p-2 bg-gray-800 text-white rounded-r-lg shadow-lg z-50 flex items-center justify-center border-l border-gray-700"
          style={{ display: isOpen ? 'flex' : 'none' }}
        >
          <X size={20} />
        </button>
      </aside>
    </>
  );
};