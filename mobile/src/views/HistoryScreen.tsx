import React from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import { useMovementHistoryController } from '../controllers/useMovementHistoryController';
import { auth } from '../services/firebaseConfig';
import { theme } from '../theme/theme';
import { Movement } from '../types/Movement';


export const HistoryScreen = () => {
  const userId = auth.currentUser?.uid ?? '';

  const {
    movements,
    categories,
    selectedCategoryId,
    sortOrder,
    isLoading,
    error,
    handleCategoryChange,
    handleSortOrderChange,
    clearCategoryFilter,
  } = useMovementHistoryController(userId);


  const getCategoryName = (
    categoryId: string
  ): string => {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    return category?.name ?? categoryId;
  };


  const formatDate = (
    timestamp: number
  ): string => {
    return new Date(timestamp).toLocaleDateString(
      'es-CO'
    );
  };


  const renderMovement = ({
    item,
  }: {
    item: Movement;
  }) => {
    const isExpense = item.type === 'gasto';

    return (
      <View
        style={[
          styles.movementCard,
          isExpense && styles.expenseCard,
        ]}
      >
        <View style={styles.cardHeader}>
          <Text
            style={
              isExpense
                ? styles.expenseAmount
                : styles.incomeAmount
            }
          >
            {isExpense ? '-' : '+'}
            ${item.amount.toFixed(2)}
          </Text>

          <Text style={styles.date}>
            {formatDate(item.date)}
          </Text>
        </View>

        <Text style={styles.category}>
          {getCategoryName(item.categoryId)}
        </Text>

        {item.description ? (
          <Text style={styles.description}>
            {item.description}
          </Text>
        ) : null}
      </View>
    );
  };


  if (!userId) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          No hay un usuario autenticado.
        </Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Historial de movimientos
      </Text>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>
          Categoría
        </Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={
              selectedCategoryId ?? ''
            }
            onValueChange={(value) => {
              if (value === '') {
                clearCategoryFilter();
                return;
              }

              handleCategoryChange(value);
            }}
          >
            <Picker.Item
              label="Todas las categorías"
              value=""
            />

            {categories.map((category) => (
              <Picker.Item
                key={category.id ?? category.name}
                label={category.name}
                value={category.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.filterTitle}>
          Ordenar por fecha
        </Text>

        <View style={styles.sortContainer}>
          <Pressable
            style={[
              styles.sortButton,
              sortOrder === 'asc' &&
                styles.sortButtonActive,
            ]}
            onPress={() =>
              handleSortOrderChange('asc')
            }
          >
            <Text
              style={[
                styles.sortButtonText,
                sortOrder === 'asc' &&
                  styles.sortButtonTextActive,
              ]}
            >
              Más antiguos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.sortButton,
              sortOrder === 'desc' &&
                styles.sortButtonActive,
            ]}
            onPress={() =>
              handleSortOrderChange('desc')
            }
          >
            <Text
              style={[
                styles.sortButtonText,
                sortOrder === 'desc' &&
                  styles.sortButtonTextActive,
              ]}
            >
              Más recientes
            </Text>
          </Pressable>
        </View>
      </View>

      {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
          />

          <Text style={styles.loadingText}>
            Cargando historial...
          </Text>
        </View>
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item, index) =>
            item.id ?? index.toString()
          }
          renderItem={renderMovement}
          contentContainerStyle={
            movements.length === 0
              ? styles.emptyList
              : styles.listContent
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No se encontraron movimientos.
            </Text>
          }
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },

  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },

  filtersContainer: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    elevation: 2,
  },

  filterTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.sm,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },

  sortContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  sortButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },

  sortButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  sortButtonText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
  },

  sortButtonTextActive: {
    color: theme.colors.textLight,
  },

  listContent: {
    paddingBottom: theme.spacing.lg,
  },

  movementCard: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 5,
    borderLeftColor: theme.colors.primary,
    elevation: 2,
  },

  expenseCard: {
    borderLeftColor: theme.colors.error,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },

  incomeAmount: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },

  expenseAmount: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.error,
  },

  date: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
  },

  category: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.textDark,
  },

  description: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.md,
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyText: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.md,
  },

  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontSize: theme.fontSizes.md,
  },
});