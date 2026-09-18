import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, ActivityIndicator, Pressable, TouchableWithoutFeedback, Keyboard, Modal, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; // <-- 1. Importamos el Picker que instalaste
import { useMovementController } from '../controllers/useMovementController';
import { useCategoryController } from '../controllers/useCategoryController';
import { theme } from '../theme/theme';

// <-- 2. Creamos tus categorías predefinidas (RF05)
const categoriasPredefinidas = [
  { id: 'pre-1', name: 'Alimentación' },
  { id: 'pre-2', name: 'Transporte' },
  { id: 'pre-3', name: 'Vivienda' },
  { id: 'pre-4', name: 'Servicios' },
  { id: 'pre-5', name: 'Entretenimiento' },
];

export const MovementScreen = () => {
  const { movements, isLoading, error, handleAddMovement } = useMovementController();
  const { categories, isLoading: isLoadingCategories } = useCategoryController();

  const [type, setType] = useState<'ingreso' | 'gasto'>('ingreso');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  // <-- 3. Unimos tus categorías predefinidas con las que vienen de la base de datos (RF06)
  const todasLasCategorias = [...categoriasPredefinidas, ...categories];

  const formattedDate = date.toISOString().split('T')[0];

  const openDatePicker = () => {
    Keyboard.dismiss();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        onValueChange: (event, selectedDate) => {
          if (selectedDate) setDate(selectedDate);
        },
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onAddPress = () => {
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (!parsedAmount || parsedAmount <= 0 || !categoryId) return;
    handleAddMovement({
      type,
      amount: parsedAmount,
      date: date.getTime(),
      categoryId,
      ...(description ? { description } : {}),
    });
    setAmount('');
    setDescription('');
    setCategoryId(null);
    setDate(new Date());
  };

  const canSubmit = !isLoading && !!parseFloat(amount.replace(',', '.')) && !!categoryId;

  // <-- 4. Simplificamos esta función para usar el Picker
  const renderCategorySelector = () => {
    if (isLoadingCategories) {
      return <ActivityIndicator size="small" color={theme.colors.primary} style={styles.categoryLoader} />;
    }
    
    return (
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoryId || ''}
          onValueChange={(itemValue) => setCategoryId(itemValue || null)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona una categoría..." value="" color={theme.colors.textMuted} />
          {todasLasCategorias.map((cat) => (
            <Picker.Item 
              key={cat.id ?? cat.name} 
              label={cat.name} 
              value={cat.id} 
              color={theme.colors.textDark}
            />
          ))}
        </Picker>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
      <Text style={styles.title}>Nuevo Movimiento</Text>

      <View style={styles.inputContainer}>
        <View style={styles.typeRow}>
          <Pressable
            style={[styles.typeButton, type === 'ingreso' && styles.typeButtonActive]}
            onPress={() => {
              Keyboard.dismiss();
              setType('ingreso');
            }}
          >
            <Text style={[styles.typeButtonText, type === 'ingreso' && styles.typeButtonTextActive]}>Ingreso</Text>
          </Pressable>
          <Pressable
            style={[styles.typeButton, type === 'gasto' && styles.typeButtonActive]}
            onPress={() => {
              Keyboard.dismiss();
              setType('gasto');
            }}
          >
            <Text style={[styles.typeButtonText, type === 'gasto' && styles.typeButtonTextActive]}>Gasto</Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Monto"
          placeholderTextColor={theme.colors.textMuted}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Pressable style={styles.dateButton} onPress={openDatePicker}>
          <Text style={styles.dateButtonText}>Fecha: {formattedDate}</Text>
        </Pressable>
        {Platform.OS !== 'android' && showDatePicker && (
          <Modal
            transparent
            animationType="fade"
            visible={showDatePicker}
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="inline"
                  onChange={onChangeDate}
                />
                <Button
                  title="Listo"
                  color={theme.colors.primary}
                  onPress={() => setShowDatePicker(false)}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* Aquí se dibuja el menú desplegable que armamos arriba */}
        {renderCategorySelector()}

        <TextInput
          style={styles.input}
          placeholder="Descripción (opcional)"
          placeholderTextColor={theme.colors.textMuted}
          value={description}
          onChangeText={setDescription}
        />

        <Button
          title="Agregar Movimiento"
          color={theme.colors.primary}
          onPress={onAddPress}
          disabled={!canSubmit}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} />}

      <Text style={styles.listTitle}>Movimientos registrados</Text>
      {movements.map((item, index) => (
        <View key={item.id ?? index} style={[styles.card, item.type === 'gasto' && styles.cardGasto]}>
          <View style={styles.cardHeader}>
            <Text style={item.type === 'gasto' ? styles.amountGasto : styles.amountIngreso}>
              {item.type === 'gasto' ? '-' : '+'}${item.amount.toFixed(2)}
            </Text>
            <Text style={styles.cardDate}>{new Date(item.date).toISOString().split('T')[0]}</Text>
          </View>
          <Text style={styles.cardCategory}>
            {todasLasCategorias.find((c) => c.id === item.categoryId)?.name ?? item.categoryId}
          </Text>
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
  typeRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  typeButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeButtonText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
  },
  typeButtonTextActive: {
    color: theme.colors.textLight,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  dateButtonText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textDark,
  },
  categoryLoader: {
    marginBottom: theme.spacing.md,
  },
  // <-- 5. Estilos para el nuevo Picker (Reemplazan todo el código CSS que sobraba del diseño anterior)
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    marginBottom: theme.spacing.md,
    overflow: 'hidden', 
  },
  picker: {
    height: 55,
    width: '100%',
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
  cardGasto: {
    borderLeftColor: theme.colors.error,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  amountIngreso: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  amountGasto: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.error,
  },
  cardDate: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
  },
  cardCategory: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.textDark,
  },
  cardDesc: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    fontSize: theme.fontSizes.md,
  },
  listTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.textDark,
    marginBottom: theme.spacing.md,
  },
  error: {
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    fontSize: theme.fontSizes.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
});