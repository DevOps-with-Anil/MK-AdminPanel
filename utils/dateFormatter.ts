// src/utils/date/dateFormatter.ts

export const formatDate = (
        value?: string
    ) => {
        if (!value) return '-';

        return new Date(
            value
        ).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };