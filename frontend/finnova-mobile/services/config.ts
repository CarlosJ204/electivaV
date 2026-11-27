
import { Platform } from "react-native";

export const DEMO_MODE =
  process.env.EXPO_PUBLIC_DEMO_MODE === "true";

const fromEnv = process.env.EXPO_PUBLIC_API_URL;

export const API_URL = (
  fromEnv ??
  (Platform.OS === "web"
    ? "http://localhost:3000/api"
    : "http://10.0.2.2:3000/api")
).replace(/\/$/, "");
