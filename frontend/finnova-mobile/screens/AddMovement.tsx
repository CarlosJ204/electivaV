import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Field, Button } from "../components/ui";
import { api } from "../services/api";
import { errorMessage } from "../utils/errors";
import { notify } from "../utils/notify";
import { C } from "../utils/theme";
import type { Category, MovementType } from "../types";

export default function AddMovement({ categories, onSaved, goCategories }: { categories: Category[]; onSaved: () => void; goCategories: () => void }) {
  const [type, setType] = useState<MovementType>("gasto");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    const n = Number(amount.replace(/\D/g, ""));
    if (!n) return notify("Falta el monto", "Escribe un valor mayor a 0.");
    if (!cat) return notify("Falta la categoría", "Elige una categoría para el movimiento.");
    setLoading(true);
    try { await api.addMovement({ type, amount: n, categoryId: cat, description: desc, date: Date.now() });
      setAmount(""); setDesc(""); setCat(null); onSaved();
    } catch (e) { notify("No se guardó", errorMessage(e)); }
    setLoading(false);
  };
  const tone = type === "gasto" ? C.expense : C.income;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingTop: 70, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
      <Text style={{ fontSize: 28, fontWeight: "800", color: C.text, marginBottom: 20 }}>Nuevo movimiento</Text>
      <View style={{ flexDirection: "row", backgroundColor: "#E4E6F2", borderRadius: 16, padding: 4, marginBottom: 22 }}>
        {(["gasto", "ingreso"] as const).map((t) => (
          <Pressable key={t} onPress={() => setType(t)} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", backgroundColor: type === t ? C.card : "transparent" }}>
            <Text style={{ fontWeight: "700", color: type === t ? (t === "gasto" ? C.expense : C.income) : C.muted }}>{t === "gasto" ? "Gasto" : "Ingreso"}</Text>
          </Pressable>))}
      </View>
      <Field label="Monto" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0" style={{ fontSize: 30, fontWeight: "800", color: tone }} />
      <Text style={{ color: C.muted, fontSize: 13, fontWeight: "600", marginBottom: 8 }}>Categoría</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {categories.map((c) => (
          <Pressable key={c._id} onPress={() => setCat(c._id)} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: cat === c._id ? C.brand : C.card, borderWidth: 1, borderColor: cat === c._id ? C.brand : C.line }}>
            <Text style={{ fontWeight: "600", color: cat === c._id ? "#fff" : C.text }}>{c.name}</Text>
          </Pressable>))}
        <Pressable onPress={goCategories} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderStyle: "dashed", borderColor: C.brand }}>
          <Text style={{ color: C.brand, fontWeight: "600" }}>+ Crear categoría</Text></Pressable>
      </View>
      <Field label="Descripción (opcional)" value={desc} onChangeText={setDesc} placeholder="Ej: almuerzo con Ana" />
      <Button title={type === "gasto" ? "Guardar gasto" : "Guardar ingreso"} onPress={save} loading={loading} tone={tone} />
    </ScrollView>);
}
