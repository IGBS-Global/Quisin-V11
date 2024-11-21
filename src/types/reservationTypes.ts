import { ReservationStatus } from './enums';
import { OrderItem } from './orderTypes';

export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: ReservationStatus;
  preOrderItems?: OrderItem[];
  total?: number;
  createdAt: Date;
}