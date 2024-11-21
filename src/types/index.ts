export * from './enums';
export * from './menuTypes';
export * from './orderTypes';
export * from './userTypes';
export * from './reservationTypes';
export * from './waiterTypes';
export * from './staffTypes';

export interface Table {
  id: string;
  number: string;
  seats: number;
  location?: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  createdAt: Date;
  qrCode?: string;
}