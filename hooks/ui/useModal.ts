// hooks/ui/useModal.ts

'use client';

import { useState } from 'react';

export function useModal(
    initial = false
) {
    const [open, setOpen] =
        useState(initial);

    const openModal = () =>
        setOpen(true);

    const closeModal = () =>
        setOpen(false);

    const toggleModal = () =>
        setOpen((prev) => !prev);

    return {
        open,
        setOpen,
        openModal,
        closeModal,
        toggleModal,
    };
}