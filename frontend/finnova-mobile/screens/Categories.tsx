import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Icon from "../components/Icon";
import { Field, Button } from "../components/ui";
import { api } from "../services/api";
import { notify } from "../utils/notify";
import { errorMessage } from "../utils/errors";
import { C } from "../utils/theme";

import type { Category } from "../types";

export default function Categories({ categories, onSaved }: { categories: Category[]; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!name.trim()) return notify("Falta el nombre", "Escribe un nombre para la categoría.");
    setLoading(true);
    try { await api.addCategory({ name: name.trim(), description }); setName(""); setDescription(""); onSaved();
    } catch (e) { notify("No se guardó", errorMessage(e)); }
    setLoading(false);
  };
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingTop: 70, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
      <Text style={{ fontSize: 28, fontWeight: "800", color: C.text, marginBottom: 20 }}>Categorías</Text>
      <Field label="Nombre" value={name} onChangeText={setName} placeholder="Ej: Mercado, Transporte, Salario" />
      <Field label="Descripción (opcional)" value={description} onChangeText={setDescription} placeholder="Para qué la usas" />
      <Button title="Añadir categoría" onPress={save} loading={loading} />
      <View style={{ marginTop: 28 }}>
        {categories.map((c) => (
          <View key={c._id} style={{ flexDirection: "row", alignItems: "center", backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 10 }}>
            <Icon name="pricetag" size={18} color={C.brand} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontWeight: "700", color: C.text }}>{c.name}</Text>
              {!!c.description && <Text style={{ color: C.muted, marginTop: 2 }}>{c.description}</Text>}
            </View>
          </View>))}
      </View>
    </ScrollView>);
}
