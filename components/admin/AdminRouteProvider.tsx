'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setAdminRoute } from '@/store/slices/uiSlice';

export default function AdminRouteProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAdminRoute(true));

    return () => {
      dispatch(setAdminRoute(false));
    };
  }, [dispatch]);

  return <>{children}</>;
}
