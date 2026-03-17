import { useState } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useChat } from '../contexts/ChatContext';
import ChatBox from './ChatBox';
import FloatingWidget from './FloatingWidget';

const FloatingChat = () => {
  const { isOpen, recipeId, closeChat } = useChat();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!recipeId) return null;

  return (
    <FloatingWidget
      storageKey="floating-chat"
      defaultPos={{ x: 16, y: 120 }}
      defaultSize={{ width: 360, height: 280 }}
      minWidth={300}
      minHeight={220}
      className="bg-minimalist-sky/70 backdrop-blur-md rounded-2xl shadow-soft border border-minimalist-blue/60"
      header={
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-minimalist-slate" />
            <div className="text-sm font-semibold text-minimalist-slate truncate">AI chat</div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsExpanded((v) => !v)}
              className="p-2 rounded-full text-minimalist-slate/70 hover:text-minimalist-slate transition-colors"
              aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
            >
              {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={closeChat}
              className="p-2 rounded-full text-minimalist-slate/70 hover:text-minimalist-slate transition-colors"
              aria-label="Close chat"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      }
    >
      <div className="px-3 pb-1">
        {isOpen && isExpanded ? (
          <ChatBox recipeId={recipeId} compact />
        ) : (
          <div className="text-sm text-minimalist-slate/70">Chat is closed.</div>
        )}
      </div>
    </FloatingWidget>
  );
};

export default FloatingChat;

