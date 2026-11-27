import { useState, useEffect, useMemo } from 'react';
import { Category } from '../types/Category';
import { CategoryModel } from '../models/CategoryModel';
import { useCurrentUserId } from './useCurrentUserId';

export const useCategoryController = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // uid del usuario autenticado
  const currentUserId = useCurrentUserId();

  const categoryModel = useMemo(() => new CategoryModel(), []);

  // Suscripción en tiempo real: cualquier pantalla que use este hook
  // (Categorías, Movimientos) recibe las categorías nuevas al instante.
  useEffect(() => {
    if (!currentUserId) {
      setCategories([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const unsubscribe = categoryModel.subscribeToCategories(
      currentUserId,
      (data) => {
        setCategories(data);
        setError(null);
        setIsLoading(false);
      },
      () => {
        setError('No se pudieron cargar las categorías');
        setIsLoading(false);
      }
    );
    return unsubscribe;
  }, [categoryModel, currentUserId]);

  // Recarga manual (se mantiene por compatibilidad)
  const loadCategories = async () => {
    if (!currentUserId) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoryModel.getCategories(currentUserId);
      setCategories(data);
    } catch (err) {
      setError('No se pudieron cargar las categorías');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (name: string, description: string) => {
    if (!name) return;
    if (!currentUserId) {
      setError('Debes iniciar sesión para crear categorías');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      // No hace falta recargar: el listener en tiempo real actualiza la lista.
      await categoryModel.addCategory({ name, description, userId: currentUserId });
    } catch (err) {
      setError('Error al crear la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    isLoading,
    error,
    handleAddCategory,
    loadCategories,
  };
};
