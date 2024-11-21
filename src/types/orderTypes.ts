import { OrderStatus } from './enums';
import { MenuItem } from './menuTypes';

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  tax: number;
  subtotal: number;
  waiterId: string;
  waiterName: string;
  estimatedTime: string;
  createdAt: Date;
  updatedAt: Date;
}