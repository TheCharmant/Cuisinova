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
            onAction={() => router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/RecipeDetail?recipeId=${recipeId}`)}
        />
    );
    return (
        <div className="mt-6 flex flex-col gap-4">
            {messages.length > 0 && (
                <div className="border border-violet-100 rounded-xl p-4 bg-white max-h-[400px] overflow-y-auto space-y-4 shadow-inner">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-xl text-sm max-w-[75%] shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-brand-100 to-violet-100 text-violet-800 border border-violet-200'
                                    : 'bg-white text-gray-800 border border-gray-200'
                                    }`}
                            >
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="text-sm text-violet-500 italic animate-pulse">Assistant is typing...</div>
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
                    className="flex-grow border border-violet-200 rounded-xl px-4 py-2 text-sm h-[80px] resize-none overflow-y-auto focus:ring-2 focus:ring-violet-300 focus:border-violet-300 focus:outline-none transition-all duration-300"
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
                    className="bg-gradient-to-r from-brand-500 to-violet-500 text-white px-4 py-2 rounded-xl text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                    aria-label="Send"
                >
                    <PaperAirplaneIcon className="h-14 w-8" />
                </button>
            </div>
        </div>
    );
}
