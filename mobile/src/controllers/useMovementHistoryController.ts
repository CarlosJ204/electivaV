import { useCallback, useEffect, useState } from 'react';

import { CategoryModel } from '../models/CategoryModel';
import { MovementModel } from '../models/MovementModel';

import { Category } from '../types/Category';
import { Movement } from '../types/Movement';
import {
  MovementFilter,
  MovementSortOrder,
} from '../types/MovementFilter';


const movementModel = new MovementModel();
const categoryModel = new CategoryModel();


export const useMovementHistoryController = (
  userId: string
) => {

  const [movements, setMovements] =
    useState<Movement[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string | undefined>(undefined);

  const [sortOrder, setSortOrder] =
    useState<MovementSortOrder>('desc');

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadCategories = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      const data =
        await categoryModel.getCategories(userId);

      setCategories(data);

    } catch (error) {
      console.error(
        'Error cargando categorías del historial: ',
        error
      );

      setError(
        'No se pudieron cargar las categorías'
      );
    }
  }, [userId]);


  const loadHistory = useCallback(async () => {
    if (!userId) {
      setMovements([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const filter: MovementFilter = {
        userId,
        sortOrder,
        ...(selectedCategoryId && {
          categoryId: selectedCategoryId,
        }),
      };

      const data =
        await movementModel.getMovementHistory(
          filter
        );

      setMovements(data);

    } catch (error) {
      console.error(
        'Error cargando historial de movimientos: ',
        error
      );

      setError(
        'No se pudo cargar el historial de movimientos'
      );

    } finally {
      setIsLoading(false);
    }
  }, [
    userId,
    selectedCategoryId,
    sortOrder,
  ]);


  const handleCategoryChange = (
    categoryId?: string
  ) => {
    setSelectedCategoryId(categoryId);
  };


  const handleSortOrderChange = (
    order: MovementSortOrder
  ) => {
    setSortOrder(order);
  };


  const clearCategoryFilter = () => {
    setSelectedCategoryId(undefined);
  };


  useEffect(() => {
    loadCategories();
  }, [loadCategories]);


  useEffect(() => {
    loadHistory();
  }, [loadHistory]);


  return {
    movements,
    categories,
    selectedCategoryId,
    sortOrder,
    isLoading,
    error,

    handleCategoryChange,
    handleSortOrderChange,
    clearCategoryFilter,
    loadHistory,
  };
};