export interface Reimbursement {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}