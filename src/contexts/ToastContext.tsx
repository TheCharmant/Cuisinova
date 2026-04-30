import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast from '../components/Toast';

type ToastType = 'success' | 'error' | 'info';
export type { ToastType };

interface ToastMessage {
    id: number;
    message: string;
    type?: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
