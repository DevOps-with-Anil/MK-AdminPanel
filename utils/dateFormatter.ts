export const formatDate = (
    value?: string
) => {
    if (!value) return '-';

    return new Date(value)
        .toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
        .replace('am', 'AM')
        .replace('pm', 'PM');
};