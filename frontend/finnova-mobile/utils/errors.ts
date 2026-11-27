// Mensajes del backend (en inglés) traducidos para el usuario.
const TRANSLATIONS: Record<string, string> = {
  "All fields are required": "Completa todos los campos.",
  "Invalid credentials": "Correo o contraseña incorrectos.",
  "Email already exists": "Ese correo ya está registrado.",
  "Username already exists": "Ese nombre de usuario ya existe.",
  "Password should be at least 8 characters long": "La contraseña debe tener mínimo 8 caracteres.",
  "Username should be at least 3 characters long": "El usuario debe tener mínimo 3 caracteres.",
  "Internal server error": "Error del servidor. Intenta de nuevo en un momento.",
};

export function errorMessage(e: unknown): string {
  const raw = e instanceof Error ? e.message : String(e);
  return TRANSLATIONS[raw] ?? raw ?? "Ocurrió un error inesperado.";
}
