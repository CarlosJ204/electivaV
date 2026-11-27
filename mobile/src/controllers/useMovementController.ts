import { useState, useEffect, useMemo, useCallback } from 'react';
import { Movement } from '../types/Movement';
import { MovementModel } from '../models/MovementModel';
import { useCurrentUserId } from './useCurrentUserId';

export const useMovementController = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // uid del usuario autenticado
  const currentUserId = useCurrentUserId();

  const movementModel = useMemo(() => new MovementModel(), []);

  const loadMovements = useCallback(async () => {
    if (!currentUserId) {
      setMovements([]);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const data = await movementModel.getMovements(currentUserId);
      setMovements(data);
    } catch (err) {
      setError('No se pudieron cargar los movimientos');
    } finally {
      setIsLoading(false);
    }
  }, [movementModel, currentUserId]);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  const handleAddMovement = async (movementData: Omit<Movement, 'id' | 'createdAt' | 'userId'>) => {
    if (!currentUserId) {
      setError('Debes iniciar sesión para crear movimientos');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await movementModel.addMovement({ ...movementData, userId: currentUserId });
      await loadMovements(); // Recargar después de añadir
    } catch (err) {
      setError('Error al crear el movimiento');
      setIsLoading(false);
    }
  };

  return {
    movements,
    isLoading,
    error,
    handleAddMovement,
    loadMovements,
  };
};
