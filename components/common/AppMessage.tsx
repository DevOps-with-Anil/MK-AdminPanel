// components/common/AppMessage.tsx

'use client';

import {
    AlertCircle,
    CheckCircle,
    Info,
    AlertTriangle,
    X,
} from 'lucide-react';

interface Props {
    visible: boolean;
    message: string;
    type?: 'success' | 'danger' | 'warning' | 'info';
    onClose?: () => void;
}

export function AppMessage({
    visible,
    message,
    type = 'success',
    onClose,
}: Props) {
    if (!visible || !message) return null;

    const styles = {
        success:
            'bg-green-50/95 border-green-200 text-green-700',
        danger:
            'bg-red-50/95 border-red-200 text-red-700',
        warning:
            'bg-yellow-50/95 border-yellow-200 text-yellow-700',
        info:
            'bg-blue-50/95 border-blue-200 text-blue-700',
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        danger: <AlertCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
    };

    return (
        <div className="fixed top-5 right-5 z-[9999] animate-in slide-in-from-top-2 fade-in duration-300">

            <div
                className={`min-w-[320px] max-w-md rounded-2xl border shadow-2xl backdrop-blur-md px-4 py-3 ${styles[type]}`}
            >
                <div className="flex items-start gap-3">

                    {/* ICON */}
                    <div className="mt-0.5 shrink-0">
                        {icons[type]}
                    </div>

                    {/* MESSAGE */}
                    <div className="flex-1">
                        <div className="font-medium text-sm">
                            {message}
                        </div>
                    </div>

                    {/* CLOSE */}
                    <button
                        onClick={onClose}
                        className="opacity-60 hover:opacity-100 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}