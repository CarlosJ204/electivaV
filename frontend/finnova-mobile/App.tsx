import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";

import Login from "./screens/Login";
import Home from "./screens/Home";
import AddMovement from "./screens/AddMovement";
import Categories from "./screens/Categories";
import Icon from "./components/Icon";
import { api, clearSession, loadSession } from "./services/api";
import { notify } from "./utils/notify";
import { errorMessage } from "./utils/errors";
import { C } from "./utils/theme";
import type { Category, Movement, User } from "./types";

type Tab = "home" | "add" | "categories";

const TABS: { key: Tab; label: string; icon: React.ComponentProps<typeof Icon>["name"] }[] = [
  { key: "home", label: "Inicio", icon: "home" },
  { key: "add", label: "Nuevo", icon: "add-circle" },
  { key: "categories", label: "Categorías", icon: "pricetags" },
];

export default function App() {
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [movements, setMovements] = useState<Movement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Restaura la sesión guardada al abrir la app
  useEffect(() => {
    loadSession().then((s) => {
      if (s) setUser(s.user);
      setBooting(false);
    });
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [m, c] = await Promise.all([api.getMovements(), api.getCategories()]);
      setMovements(m);
      setCategories(c);
    } catch (e) {
      notify("No pudimos actualizar", errorMessage(e));
    }
    setRefreshing(false);
  }, []);

  // Carga los datos cada vez que hay un usuario autenticado
  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const onLogged = (u: User) => { setTab("home"); setUser(u); };

  const onLogout = async () => {
    await clearSession();
    setUser(null);
    setMovements([]);
    setCategories([]);
  };

  if (booting) {
    return (
      <View style={{ flex: 1, backgroundColor: C.brand, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <>
        <StatusBar style="light" />
        <Login onLogged={onLogged} />
      </>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style={tab === "home" ? "light" : "dark"} />
      <View style={{ flex: 1 }}>
        {tab === "home" && (
          <Home user={user} movements={movements} categories={categories} refreshing={refreshing} onRefresh={refresh} onLogout={onLogout} />
        )}
        {tab === "add" && (
          <AddMovement
            categories={categories}
            goCategories={() => setTab("categories")}
            onSaved={async () => { await refresh(); setTab("home"); }}
          />
        )}
        {tab === "categories" && <Categories categories={categories} onSaved={refresh} />}
      </View>

      <View style={{ flexDirection: "row", backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line, paddingBottom: 16, paddingTop: 8 }}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={{ flex: 1, alignItems: "center", paddingVertical: 6 }}>
              <Icon name={t.icon} size={24} color={active ? C.brand : C.muted} />
              <Text style={{ fontSize: 12, marginTop: 2, fontWeight: "600", color: active ? C.brand : C.muted }}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
