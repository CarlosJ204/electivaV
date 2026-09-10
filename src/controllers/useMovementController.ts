import { useState, useEffect } from 'react';
import { Movement } from '../types/Movement';
import { MovementModel } from '../models/MovementModel';

export const useMovementController = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Esto se reemplazará por el ID real cuando se implemente autenticación
  const currentUserId = 'mock-user-id';

  const movementModel = new MovementModel();

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
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
  };

  const handleAddMovement = async (movementData: Omit<Movement, 'id' | 'createdAt' | 'userId'>) => {
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