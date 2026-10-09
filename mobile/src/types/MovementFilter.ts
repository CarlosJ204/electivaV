export type MovementSortOrder = 'asc' | 'desc';

export interface MovementFilter {
  userId: string;
  categoryId?: string;
  sortOrder: MovementSortOrder;
}