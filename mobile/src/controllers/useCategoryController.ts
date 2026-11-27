import { useState, useEffect, useMemo } from 'react';
import { Category } from '../types/Category';
import { CategoryModel } from '../models/CategoryModel';

export const useCategoryController = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Esto se reemplazará por el ID real cuando se implemente autenticación
  const currentUserId = 'mock-user-id';

  const categoryModel = useMemo(() => new CategoryModel(), []);

  // Suscripción en tiempo real: cualquier pantalla que use este hook
  // (Categorías, Movimientos) recibe las categorías nuevas al instante.
  useEffect(() => {
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
