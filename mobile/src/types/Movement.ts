export type MovementType = 'ingreso' | 'gasto';

export interface Movement {
  id?: string;
  type: MovementType;
  amount: number;
  date: number;
  categoryId: string;
  description?: string;
  userId?: string;
  createdAt?: number;
}