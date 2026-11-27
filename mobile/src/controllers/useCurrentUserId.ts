import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

// Devuelve el uid del usuario autenticado en Firebase (o null si no hay sesión).
// Se actualiza automáticamente al iniciar o cerrar sesión.
export const useCurrentUserId = (): string | null => {
  const [userId, setUserId] = useState<string | null>(auth.currentUser?.uid ?? null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null);
    });
    return unsubscribe;
  }, []);

  return userId;
};
