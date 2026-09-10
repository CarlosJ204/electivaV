import { useState, useEffect } from 'react';
import { Category } from '../types/Category';
import { CategoryModel } from '../models/CategoryModel';

export const useCategoryController = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Esto se reemplazará por el ID real cuando se implemente autenticación
  const currentUserId = 'mock-user-id';

  const categoryModel = new CategoryModel();

  useEffect(() => {
    loadCategories();
  }, []);

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
      await categoryModel.addCategory({ name, description, userId: currentUserId });
      await loadCategories(); // Recargar después de añadir
    } catch (err) {
      setError('Error al crear la categoría');
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
