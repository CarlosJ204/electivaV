export type MovementType = "ingreso" | "gasto";

export interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  userId: string;
}

export interface Movement {
  _id: string;
  type: MovementType;
  amount: number;
  date: number;
  categoryId: string;
  description?: string;
  userId: string;
  createdAt?: number;
}

export interface Session {
  token: string;
  user: User;
}
