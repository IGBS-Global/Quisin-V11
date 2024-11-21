export interface WaiterCall {
  id: string;
  tableId: string;
  status: 'pending' | 'acknowledged';
  assignedWaiterId: string;
  createdAt: Date;
}