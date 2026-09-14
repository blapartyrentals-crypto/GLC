export * from "./tenant.js";
export * from "./events.js";
export * from "./errors.js";

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface Entity {
  id: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}