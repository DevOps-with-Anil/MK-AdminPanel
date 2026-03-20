// hooks/useDeleteEntity.ts
'use client';
import { useState } from 'react';
import { deleteEntity } from '@/services/auth.service';

export const useDeleteEntity = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDeleteEntity = async (type: string, id: string) => {
    try {
      setLoadingId(id);
      return await deleteEntity(type, id);
    } finally {
      setLoadingId(null);
    }
  };

  return { deleteEntity: handleDeleteEntity, loadingId };
};