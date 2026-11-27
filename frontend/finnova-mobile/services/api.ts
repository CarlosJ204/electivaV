import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, DEMO_MODE } from "./config";
import type { Category, Movement, MovementType, Session, User } from "../types";

const SESSION_KEY = "finova.session";
let current: Session | null = null;

/* ---------------- Sesión ---------------- */
export async function saveSession(token: string, user: User) {
  current = { token, user };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(current));
}

export async function loadSession(): Promise<Session | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    current = raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    current = null;
  }
  return current;
}

export async function clearSession() {
  current = null;
  await AsyncStorage.removeItem(SESSION_KEY);
}

const requireUser = (): User => {
  if (!current) throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
  return current.user;
};

/* ---------------- HTTP ---------------- */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(current ? { Authorization: `Bearer ${current.token}` } : {}),
        ...(init.headers as Record<string, string> | undefined),
      },
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
  } finally {
    clearTimeout(timer);
  }

  let data: any = null;
  try { data = await res.json(); } catch { /* respuesta sin JSON */ }
  if (!res.ok) throw new Error(data?.message ?? `Error ${res.status}`);
  return data as T;
}

/* ---------------- Modo demo (sin backend) ---------------- */
const demo = { categories: [] as Category[], movements: [] as Movement[] };
const demoUser: User = { _id: "demo", username: "demo", email: "demo@finova.app" };
const uid = () => Math.random().toString(36).slice(2, 10);

/* ---------------- API ---------------- */
type AuthResponse = { message: string; token: string; user: User };

export const api = {
  login: (body: { email: string; password: string }) =>
    DEMO_MODE
      ? Promise.resolve<AuthResponse>({ message: "ok", token: "demo", user: demoUser })
      : request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  register: (body: { username: string; email: string; password: string }) =>
    DEMO_MODE
      ? Promise.resolve<AuthResponse>({ message: "ok", token: "demo", user: { ...demoUser, username: body.username, email: body.email } })
      : request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  getCategories: async (): Promise<Category[]> => {
    const user = requireUser();
    if (DEMO_MODE) return [...demo.categories];
    return request<Category[]>(`/category?userId=${encodeURIComponent(user._id)}`);
  },

  addCategory: async (body: { name: string; description?: string }) => {
    const user = requireUser();
    if (DEMO_MODE) {
      demo.categories.push({ _id: uid(), userId: user._id, ...body });
      return;
    }
    await request("/category", { method: "POST", body: JSON.stringify({ ...body, userId: user._id }) });
  },

  getMovements: async (): Promise<Movement[]> => {
    const user = requireUser();
    if (DEMO_MODE) return [...demo.movements].reverse();
    return request<Movement[]>(`/movement/get-movements-desc/${encodeURIComponent(user._id)}`);
  },

  addMovement: async (body: { type: MovementType; amount: number; categoryId: string; description?: string; date: number }) => {
    const user = requireUser();
    if (DEMO_MODE) {
      demo.movements.push({ _id: uid(), userId: user._id, ...body });
      return;
    }
    await request("/movement", { method: "POST", body: JSON.stringify({ ...body, userId: user._id }) });
  },
};
