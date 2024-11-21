export interface User {
  id: string;
  name: string;
  role: 'customer' | 'waiter' | 'admin';
}