import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import LimitReached from './Recipe_Creation/LimitReached';
import { call_api } from '../utils/utils';
import { useRouter } from 'next/router';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type Props = {
    recipeId: string;
};

export default function ChatBox({ recipeId }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tokenTotal, setTokenTotal] = useState(0);
    const [limitReached, setLimitReached] = useState(false);

    const router = useRouter();
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const MAX_TOKENS = 3000;

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || tokenTotal >= MAX_TOKENS) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const { reply, totalTokens, reachedLimit } = await call_api({
                address: '/api/chat-assistant',
                method: 'post',
                payload: {
                    message: input,
                    recipeId,
                    history: newMessages,
                },
            });

            if (reachedLimit) {
                setLimitReached(true);
                return;
            }

            setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
            setTokenTotal((prev) => prev + (totalTokens || 0));
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Something went wrong. Please try again.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (limitReached) return (
        <LimitReached
            message="You've reached your usage limit for AI-powered features, including the chat assistant. To continue exploring this recipe, return to the recipe page."
            actionText="Back to Recipe"
            onAction={() => router.push(`/RecipeDetail?recipeId=${recipeId}`)}
        />
    );
    return (
        <div className="mt-6 flex flex-col gap-4">
            {messages.length > 0 && (
                <div className="border border-minimalist-blue/60 rounded-xl p-4 bg-minimalist-sky/40 max-h-[320px] overflow-y-auto space-y-4 shadow-inner">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-xl text-sm max-w-[75%] shadow-sm border ${
                                    msg.role === 'user'
                                        ? 'bg-minimalist-blue/60 text-minimalist-slate border-minimalist-blue/60'
                                        : 'bg-minimalist-sand text-minimalist-slate border-minimalist-blue/40'
                                }`}
                            >
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="text-sm text-minimalist-slate/70 italic animate-pulse">Assistant is typing...</div>
                    )}
                    {tokenTotal >= MAX_TOKENS && (
                        <div className="text-sm text-red-500 italic">
                            {`You've reached the token limit for this chat session.`}
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            )}

            <div className="flex items-center gap-2">
                <textarea
                    className="flex-grow border border-minimalist-blue/60 rounded-xl px-4 py-2 text-sm h-[80px] resize-none overflow-y-auto focus:ring-2 focus:ring-minimalist-blue/40 focus:border-minimalist-slate focus:outline-none transition-all duration-200 bg-minimalist-sky/40 text-minimalist-slate"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about this recipe..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    disabled={tokenTotal >= MAX_TOKENS}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim() || tokenTotal >= MAX_TOKENS}
                    className="bg-minimalist-slate text-minimalist-sand px-4 py-2 rounded-xl text-sm hover:bg-minimalist-slate/90 transition-colors disabled:opacity-50"
                    aria-label="Send"
                >
                    <PaperAirplaneIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
