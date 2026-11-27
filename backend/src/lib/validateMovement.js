export function validateMovement({ type, amount, date, categoryId, userId, description }) {
    if (!type) return "Type is required";
    if (type !== "ingreso" && type !== "gasto") return "El tipo debe ser ingreso o gasto";
    if (amount === undefined || amount === null || amount === "") return "Amount is required";
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) return "El monto debe ser mayor que cero";
    if (date === undefined || date === null || date === "") return "La fecha es obligatoria";
    if (typeof date !== "number" || !Number.isFinite(date) || Number.isNaN(new Date(date).getTime())) return "La fecha no es válida";
    if (typeof categoryId !== "string" || !categoryId.trim()) return "CategoryId is required";
    if (typeof userId !== "string" || !userId.trim()) return "El usuario es obligatorio";
    if (description !== undefined && typeof description !== "string") return "La descripción debe ser texto";
    return null;
}
