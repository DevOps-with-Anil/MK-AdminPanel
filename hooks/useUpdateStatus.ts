// hooks/useUpdateStatus.ts
'use client';
import { useState } from 'react';
import { updateStatus } from '@/services/auth.service';

type StatusPayload = { status: 'ACTIVE' | 'INACTIVE' };

export const useUpdateStatus = (p0: string, userId: string, p1: { status: string; }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUpdateStatus = async (
    type: string,
    id: string,
    status: StatusPayload
  ) => {
    try {
      setLoadingId(id);
      return await updateStatus(type, id, status);
    } finally {
      setLoadingId(null);
    }
  };

  return { updateStatus: handleUpdateStatus, loadingId };
};