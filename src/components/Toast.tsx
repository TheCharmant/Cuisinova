import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { ToastType } from '../contexts/ToastContext';

interface ToastProps {
    message: string;
    type?: ToastType;
}

const Toast = ({ message, type = 'success' }: ToastProps) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />;
            case 'error':
                return <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />;
            case 'info':
                return <InformationCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />;
            default:
                return <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-green-50 border-green-200 text-green-800';
        }
    };

    return (
        <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg pointer-events-auto min-w-[200px] max-w-sm sm:min-w-[300px] animate-fadeInUp`}
            style={{
                animationDuration: '0.2s',
                animationFillMode: 'forwards'
            }}
            role="alert"
        >
            {getIcon()}
            <p className="text-sm font-medium truncate">{message}</p>
        </div>
    );
};

export default Toast;
