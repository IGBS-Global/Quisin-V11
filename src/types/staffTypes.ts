export interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  shift: {
    start: string;
    end: string;
    days: string[];
  };
  username: string;
  password: string;
  createdAt: Date;
  status: 'active' | 'inactive';
}