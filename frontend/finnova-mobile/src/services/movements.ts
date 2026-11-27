export type MovementType = 'ingreso' | 'gasto';

export type NewMovement = {
  type: MovementType;
  amount: number;
  date: number;
  categoryId: string;
  description?: string;
  userId: string;
};

export async function addMovement(movement: NewMovement, token?: string): Promise<void> {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!baseUrl) throw new Error('Falta configurar EXPO_PUBLIC_API_URL.');

  const response = await fetch(`${baseUrl}/api/movement`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(movement),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body.message === 'string' ? body.message : 'No se pudo guardar el movimiento.');
  }
}
