// hooks/useAppMessage.ts

'use client';

import { useCallback, useState } from 'react';

type MessageType = 'success' | 'danger' | 'warning' | 'info';

interface MessageState {
    message: string;
    type: MessageType;
}

export function useAppMessage(duration = 3000) {
    const [state, setState] = useState<MessageState | null>(null);

    const showMessage = useCallback(
        (
            message: string,
            type: MessageType = 'success'
        ) => {
            setState({
                message,
                type,
            });

            if (duration > 0) {
                setTimeout(() => {
                    setState(null);
                }, duration);
            }
        },
        [duration]
    );

    const clearMessage = () => {
        setState(null);
    };

    return {
        message: state?.message || '',
        type: state?.type || 'success',
        visible: !!state,
        showMessage,
        clearMessage,
    };
}