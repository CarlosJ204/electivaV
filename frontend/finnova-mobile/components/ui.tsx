import React from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, TextInputProps, StyleProp, TextStyle } from "react-native";
import { C } from "../utils/theme";

type FieldProps = TextInputProps & { label: string; style?: StyleProp<TextStyle> };

export function Field({ label, style, ...rest }: FieldProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: C.muted, fontSize: 13, fontWeight: "600", marginBottom: 8 }}>{label}</Text>
      <TextInput
        placeholderTextColor="#A9ADC2"
        {...rest}
        style={[
          { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: C.text },
          style,
        ]}
      />
    </View>
  );
}

type ButtonProps = { title: string; onPress: () => void; loading?: boolean; tone?: string };

export function Button({ title, onPress, loading = false, tone = C.brand }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      style={{ backgroundColor: tone, borderRadius: 16, paddingVertical: 16, alignItems: "center", opacity: loading ? 0.7 : 1, marginTop: 4 }}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>{title}</Text>}
    </Pressable>
  );
}
