import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type ChatContextType = {
  isOpen: boolean;
  recipeId: string | null;
  openChat: (recipeId: string) => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipeId, setRecipeId] = useState<string | null>(null);

  const value = useMemo<ChatContextType>(
    () => ({
      isOpen,
      recipeId,
      openChat: (id: string) => {
        setRecipeId(id);
        setIsOpen(true);
      },
      closeChat: () => setIsOpen(false),
    }),
    [isOpen, recipeId]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

