import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { addMovement, type MovementType } from '../services/movements';

type Category = { _id: string; name: string };
type Props = {
  categories: Category[];
  userId: string;
  token?: string;
  onSaved: () => void;
  goCategories: () => void;
};

function today() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function validDate(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  const normalized = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
  return normalized === value ? parsed.getTime() : null;
}

export default function AddMovement({ categories, userId, token, onSaved, goCategories }: Props) {
  const [type, setType] = useState<MovementType>('gasto');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (saving) return;
    const normalized = amount.trim().replace(',', '.');
    const parsedAmount = Number(normalized);
    const timestamp = validDate(date.trim());
    if (type !== 'ingreso' && type !== 'gasto') return setError('Selecciona ingreso o gasto.');
    if (!/^\d+(?:\.\d{1,2})?$/.test(normalized) || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return setError('Escribe un monto mayor que cero, con máximo dos decimales.');
    }
    if (timestamp === null) return setError('Escribe una fecha real con formato AAAA-MM-DD.');
    if (!categoryId || !categories.some((category) => category._id === categoryId)) return setError('Selecciona una categoría.');
    if (!userId?.trim()) return setError('Inicia sesión antes de guardar un movimiento.');

    setSaving(true);
    setError(null);
    try {
      await addMovement({ type, amount: parsedAmount, date: timestamp, categoryId, userId, ...(description.trim() ? { description: description.trim() } : {}) }, token);
      setAmount('');
      setDate(today());
      setCategoryId(null);
      setDescription('');
      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el movimiento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Nuevo movimiento</Text>
      <View style={styles.row}>
        {(['gasto', 'ingreso'] as const).map((option) => (
          <Pressable key={option} accessibilityRole="button" onPress={() => setType(option)} style={[styles.choice, type === option && styles.selected]}>
            <Text style={styles.choiceText}>{option === 'gasto' ? 'Gasto' : 'Ingreso'}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>Monto</Text>
      <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="Ej: 25000" />
      <Text style={styles.label}>Fecha (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" placeholder="AAAA-MM-DD" />
      <Text style={styles.label}>Categoría</Text>
      <View style={styles.wrap}>
        {categories.map((category) => (
          <Pressable key={category._id} accessibilityRole="button" onPress={() => setCategoryId(category._id)} style={[styles.choice, categoryId === category._id && styles.selected]}>
            <Text style={styles.choiceText}>{category.name}</Text>
          </Pressable>
        ))}
        <Pressable accessibilityRole="button" onPress={goCategories} style={styles.choice}>
          <Text style={styles.choiceText}>+ Crear categoría</Text>
        </Pressable>
      </View>
      <Text style={styles.label}>Descripción (opcional)</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Ej: almuerzo" />
      {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <Pressable accessibilityRole="button" disabled={saving} onPress={save} style={styles.submit}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Guardar {type}</Text>}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 56, paddingBottom: 80, backgroundColor: '#f5f6fc' },
  title: { fontSize: 28, fontWeight: '800', color: '#171a33', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#363a58', marginTop: 18, marginBottom: 8 },
  input: { backgroundColor: '#fff', borderColor: '#c8cbe0', borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
  row: { flexDirection: 'row', gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  choice: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderColor: '#c8cbe0', borderWidth: 1, borderRadius: 12 },
  selected: { borderColor: '#3438a8', backgroundColor: '#e6e8ff' },
  choiceText: { color: '#232659', fontWeight: '600' },
  error: { color: '#b22222', marginTop: 20 },
  submit: { backgroundColor: '#3438a8', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 28 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
