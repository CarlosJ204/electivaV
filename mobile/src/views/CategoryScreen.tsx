import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useCategoryController } from '../controllers/useCategoryController';
import { theme } from '../theme/theme';

export const CategoryScreen = () => {
  const { categories, isLoading, error, handleAddCategory } = useCategoryController();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onAddPress = () => {
    if (name) {
      handleAddCategory(name, description);
      setName('');
      setDescription('');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
      <Text style={styles.title}>Categorías</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de categoría"
          value={name}
          onChangeText={setName}
          placeholderTextColor={theme.colors.textMuted}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción (opcional)"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={theme.colors.textMuted}
        />
        <Button 
          title="Agregar Categoría" 
          color={theme.colors.primary} 
          onPress={onAddPress} 
          disabled={isLoading || !name} 
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} />}

      {categories.map((item, index) => (
        <View key={item.id ?? index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          {item.description ? <Text style={styles.cardDesc}>{item.description}</Text> : null}
        </View>
      ))}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    color: theme.colors.textDark,
  },
  inputContainer: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textDark,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: theme.colors.primary,
  },
  cardTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.textDark,
  },
  cardDesc: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    fontSize: theme.fontSizes.md,
  },
  error: {
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    fontSize: theme.fontSizes.md,
  },
});
