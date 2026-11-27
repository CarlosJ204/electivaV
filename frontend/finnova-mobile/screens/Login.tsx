import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Pressable } from "react-native";
import { Field, Button } from "../components/ui";
import { api, saveSession } from "../services/api";
import { notify } from "../utils/notify";
import { errorMessage } from "../utils/errors";
import { C } from "../utils/theme";

import type { User } from "../types";
import { DEMO_MODE } from "../services/config";

export default function Login({ onLogged }: { onLogged: (user: User) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF(previous => ({ ...previous, [k]: v }));

  const submit = async () => {
    if (loading) return;

    const email = f.email.trim();
    if (!email || !f.password) {
      return notify("Faltan datos", "Escribe tu correo y contraseña.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return notify("Correo inválido", "Escribe una dirección de correo válida.");
    }
    if (mode === "register") {
      if (f.username.trim().length < 3) return notify("Usuario muy corto", "El usuario debe tener mínimo 3 caracteres.");
      if (f.password.length < 8) return notify("Contraseña muy corta", "La contraseña debe tener mínimo 8 caracteres.");
    }
    setLoading(true);
    try {
      const d = mode === "login"
        ? await api.login({ email, password: f.password })
        : await api.register({ username: f.username.trim(), email, password: f.password });
      await saveSession(d.token, d.user);
      onLogged(d.user);
    } catch (e) {
      notify("No pudimos continuar", errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const changeMode = () => {
    if (loading) return;
    setMode(previous => previous === "login" ? "register" : "login");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.brand }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ paddingTop: 90, paddingHorizontal: 28, paddingBottom: 48 }}>
          <Text style={{ color: "#fff", fontSize: 44, fontWeight: "800", letterSpacing: -1.5 }}>Finova</Text>
          <Text style={{ color: "#C9CCFF", fontSize: 17, marginTop: 8 }}>Tu plata, clara y en orden.</Text>
          {DEMO_MODE && <Text style={{ color: "#fff", marginTop: 12 }}>Modo demo: usa un correo y una contraseña ficticios.</Text>}
        </View>
        <View style={{ flex: 1, backgroundColor: C.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28 }}>
          <Text style={{ fontSize: 24, fontWeight: "800", color: C.text, marginBottom: 20 }}>
            {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}</Text>
          {mode === "register" && (
            <Field
              label="Usuario"
              value={f.username}
              onChangeText={set("username")}
              autoCapitalize="none"
              autoComplete="username"
              editable={!loading}
              placeholder="mínimo 3 letras"
            />
          )}
          <Field
            label="Correo"
            value={f.email}
            onChangeText={set("email")}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            editable={!loading}
            placeholder="tu@correo.com"
          />
          <Field
            label="Contraseña"
            value={f.password}
            onChangeText={set("password")}
            autoComplete="password"
            secureTextEntry
            editable={!loading}
            placeholder="mínimo 8 caracteres"
            onSubmitEditing={submit}
            returnKeyType="done"
          />
          <Button title={mode === "login" ? "Entrar" : "Crear cuenta"} onPress={submit} loading={loading} />
          <Pressable
            onPress={changeMode}
            disabled={loading}
            accessibilityRole="button"
            style={{ marginTop: 20, alignItems: "center", opacity: loading ? 0.6 : 1 }}
          >
            <Text style={{ color: C.brand, fontWeight: "600" }}>
              {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>);
}
