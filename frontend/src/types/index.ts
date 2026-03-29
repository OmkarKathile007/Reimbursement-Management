export interface Reimbursement {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}
export type ExpenseCategory = 'FOOD' | 'TRAVEL' | 'ACCOMMODATION' | 'OFFICE' | 'OTHER';
export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Expense {
  id: string;
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  category: ExpenseCategory;
  description: string;
  expenseDate: string;
  status: ExpenseStatus;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // Current page index
}