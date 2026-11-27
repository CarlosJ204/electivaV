import React from "react";
import { View, Text, ScrollView, RefreshControl, Pressable, Platform } from "react-native";
import Icon from "../components/Icon";
import { C, money } from "../utils/theme";

import type { User, Movement, Category } from "../types";

interface Props { user: User; movements: Movement[]; categories: Category[]; refreshing: boolean; onRefresh: () => void; onLogout: () => void }
export default function Home({ user, movements, categories, refreshing, onRefresh, onLogout }: Props) {
  const inc = movements.filter((m) => m.type === "ingreso").reduce((a, m) => a + m.amount, 0);
  const exp = movements.filter((m) => m.type === "gasto").reduce((a, m) => a + m.amount, 0);
  const total = inc + exp || 1;
  const catName = (id: string) => categories.find((c) => c._id === id)?.name || "Sin categoría";

  return (
    <ScrollView style={{ flex: 1 }} refreshControl={Platform.OS !== "web" ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" /> : undefined}>
      <View style={{ backgroundColor: C.brand, paddingTop: 64, paddingHorizontal: 24, paddingBottom: 32, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: "#C9CCFF", fontSize: 16 }}>Hola, {user.username}</Text>
          <View style={{ flexDirection: "row", gap: 18 }}>
          <Pressable accessibilityLabel="Actualizar movimientos" onPress={onRefresh} disabled={refreshing}><Icon name="refresh" size={24} color="#C9CCFF" /></Pressable>
          <Pressable accessibilityLabel="Cerrar sesión" onPress={onLogout} hitSlop={12}><Icon name="log-out-outline" size={24} color="#C9CCFF" /></Pressable>
          </View>
        </View>
        <Text style={{ color: "#C9CCFF", marginTop: 22, fontSize: 14 }}>Balance total</Text>
        <Text style={{ color: "#fff", fontSize: 46, fontWeight: "800", letterSpacing: -1.5 }}>
          {inc - exp < 0 ? "-" : ""}{money(inc - exp)}</Text>
        <View style={{ flexDirection: "row", height: 8, borderRadius: 4, overflow: "hidden", marginTop: 22, backgroundColor: "#ffffff33" }}>
          <View style={{ flex: inc / total, backgroundColor: "#7BE0A3" }} /><View style={{ flex: exp / total, backgroundColor: "#FF8F92" }} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          <Text style={{ color: "#7BE0A3", fontWeight: "700" }}>Ingresos {money(inc)}</Text>
          <Text style={{ color: "#FF8F92", fontWeight: "700" }}>Gastos {money(exp)}</Text>
        </View>
      </View>

      <View style={{ padding: 24, paddingBottom: 120 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: C.text, marginBottom: 14 }}>Últimos movimientos</Text>
        {movements.length === 0 && (
          <View style={{ backgroundColor: C.card, borderRadius: 20, padding: 28, alignItems: "center" }}>
            <Icon name="wallet-outline" size={36} color={C.brand} />
            <Text style={{ color: C.muted, marginTop: 10, textAlign: "center" }}>Aún no registras nada. Toca “Nuevo” para añadir tu primer ingreso o gasto.</Text>
          </View>)}
        {movements.map((m) => {
          const up = m.type === "ingreso";
          return (
            <View key={m._id} style={{ flexDirection: "row", alignItems: "center", backgroundColor: C.card, borderRadius: 18, padding: 14, marginBottom: 10 }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: up ? C.incomeSoft : C.expenseSoft }}>
                <Icon name={up ? "arrow-down" : "arrow-up"} size={20} color={up ? C.income : C.expense} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: "700", color: C.text, fontSize: 15 }}>{m.description || catName(m.categoryId)}</Text>
                <Text style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>
                  {catName(m.categoryId)} · {new Date(m.date).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}</Text>
              </View>
              <Text style={{ fontWeight: "800", fontSize: 16, color: up ? C.income : C.expense }}>{up ? "+" : "-"}{money(m.amount)}</Text>
            </View>);
        })}
      </View>
    </ScrollView>);
}
