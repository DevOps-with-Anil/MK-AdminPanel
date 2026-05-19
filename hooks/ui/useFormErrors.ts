'use client';

import { useState } from 'react';

export function useFormErrors() {

    const [errors, setErrors] = useState<
        Record<string, string>
    >({});

    const setFieldError = (
        field: string,
        message: string
    ) => {
        setErrors((prev) => ({
            ...prev,
            [field]: message,
        }));
    };

    const clearFieldError = (
        field: string
    ) => {
        setErrors((prev) => {
            const updated = { ...prev };

            delete updated[field];

            return updated;
        });
    };

    const clearErrors = () => {
        setErrors({});
    };

    return {
        errors,
        setErrors,
        setFieldError,
        clearFieldError,
        clearErrors,
    };
}