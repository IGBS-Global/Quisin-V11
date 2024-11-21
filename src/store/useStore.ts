import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { 
  Order, 
  MenuItem, 
  Staff, 
  Table, 
  Reservation,
  WaiterCall,
  OrderStatus
} from '../types';

interface Store {
  // Auth
  user: { id: string; name: string; role: 'customer' | 'waiter' | 'admin' } | null;
  loginStaff: (username: string, password: string) => boolean;
  loginAdmin: () => void;
  logout: () => void;

  // Tables
  tables: Table[];
  getTables: () => Table[];
  addTable: (tableData: { number: string; seats: number; location?: string }) => void;
  deleteTable: (tableId: string) => void;
  updateTableStatus: (tableId: string, status: Table['status']) => void;

  // Menu
  menuItems: MenuItem[];
  getMenuItems: () => MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: number, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: number) => void;

  // Orders
  orders: Order[];
  currentOrder: Order | null;
  addOrder: (orderData: Omit<Order, 'id' | 'waiterId' | 'waiterName' | 'createdAt' | 'updatedAt'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getFilteredOrders: () => Order[];
  deleteOrder: (orderId: string) => void;

  // Staff
  staff: Staff[];
  getStaff: () => Staff[];
  addStaff: (staffData: { 
    name: string; 
    email: string; 
    phone: string; 
    shift: { start: string; end: string; days: string[] } 
  }) => { username: string; password: string };
  updateStaffStatus: (staffId: string, status: Staff['status']) => void;
  deleteStaff: (staffId: string) => void;

  // Reservations
  reservations: Reservation[];
  addReservation: (reservationData: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => string;
  updateReservationStatus: (reservationId: string, status: Reservation['status']) => void;

  // Table ID for customer session
  tableId: string | null;
  setTableId: (id: string | null) => void;

  // Waiter Calls
  waiterCalls: WaiterCall[];
  hailWaiter: (tableId: string) => string;
  acknowledgeWaiterCall: (callId: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      loginStaff: (username, password) => {
        const staff = get().staff.find(s => 
          s.username === username && 
          s.password === password &&
          s.status === 'active'
        );
        if (staff) {
          set({ user: { id: staff.id, name: staff.name, role: 'waiter' } });
          return true;
        }
        return false;
      },
      loginAdmin: () => {
        set({ user: { id: 'admin', name: 'Admin', role: 'admin' } });
      },
      logout: () => set({ user: null }),

      // Tables
      tables: [],
      getTables: () => get().tables,
      addTable: (tableData) => set(state => ({
        tables: [...state.tables, {
          id: nanoid(),
          status: 'available',
          createdAt: new Date(),
          ...tableData
        }]
      })),
      deleteTable: (tableId) => set(state => ({
        tables: state.tables.filter(table => table.id !== tableId)
      })),
      updateTableStatus: (tableId, status) => set(state => ({
        tables: state.tables.map(table =>
          table.id === tableId ? { ...table, status } : table
        )
      })),

      // Menu
      menuItems: [],
      getMenuItems: () => get().menuItems,
      addMenuItem: (item) => set(state => ({
        menuItems: [...state.menuItems, { ...item, id: state.menuItems.length + 1 }]
      })),
      updateMenuItem: (id, updates) => set(state => ({
        menuItems: state.menuItems.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      })),
      deleteMenuItem: (id) => set(state => ({
        menuItems: state.menuItems.filter(item => item.id !== id)
      })),

      // Orders
      orders: [],
      currentOrder: null,
      addOrder: (orderData) => {
        const availableWaiters = get().staff.filter(s => {
          if (s.status !== 'active') return false;
          
          const now = new Date();
          const currentHour = now.getHours();
          const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
          const [startHour] = s.shift.start.split(':').map(Number);
          const [endHour] = s.shift.end.split(':').map(Number);
          
          return s.shift.days.includes(currentDay) && 
                 currentHour >= startHour && 
                 currentHour < endHour;
        });

        const assignedWaiter = availableWaiters[Math.floor(Math.random() * availableWaiters.length)] || 
                             get().staff.find(s => s.status === 'active');

        if (!assignedWaiter) {
          throw new Error('No available waiters');
        }

        const orderId = nanoid();
        const newOrder = {
          id: orderId,
          waiterId: assignedWaiter.id,
          waiterName: assignedWaiter.name,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...orderData
        };

        set(state => ({
          orders: [...state.orders, newOrder],
          currentOrder: newOrder
        }));

        return orderId;
      },
      updateOrderStatus: (orderId, status) => set(state => ({
        orders: state.orders.map(order =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date() }
            : order
        )
      })),
      getFilteredOrders: () => get().orders,
      deleteOrder: (orderId) => set(state => ({
        orders: state.orders.filter(order => order.id !== orderId)
      })),

      // Staff
      staff: [],
      getStaff: () => get().staff,
      addStaff: (staffData) => {
        const username = staffData.email.split('@')[0];
        const password = nanoid(8);
        const newStaff = {
          id: nanoid(),
          username,
          password,
          status: 'active' as const,
          createdAt: new Date(),
          ...staffData
        };

        set(state => ({
          staff: [...state.staff, newStaff]
        }));

        return { username, password };
      },
      updateStaffStatus: (staffId, status) => set(state => ({
        staff: state.staff.map(staff =>
          staff.id === staffId ? { ...staff, status } : staff
        )
      })),
      deleteStaff: (staffId) => set(state => ({
        staff: state.staff.filter(staff => staff.id !== staffId)
      })),

      // Reservations
      reservations: [],
      addReservation: (reservationData) => {
        const reservationId = nanoid();
        set(state => ({
          reservations: [...state.reservations, {
            id: reservationId,
            status: 'pending',
            createdAt: new Date(),
            ...reservationData
          }]
        }));
        return reservationId;
      },
      updateReservationStatus: (reservationId, status) => set(state => ({
        reservations: state.reservations.map(reservation =>
          reservation.id === reservationId ? { ...reservation, status } : reservation
        )
      })),

      // Table ID
      tableId: null,
      setTableId: (id) => set({ tableId: id }),

      // Waiter Calls
      waiterCalls: [],
      hailWaiter: (tableId) => {
        const availableWaiters = get().staff.filter(s => {
          if (s.status !== 'active') return false;
          
          const now = new Date();
          const currentHour = now.getHours();
          const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
          const [startHour] = s.shift.start.split(':').map(Number);
          const [endHour] = s.shift.end.split(':').map(Number);
          
          return s.shift.days.includes(currentDay) && 
                 currentHour >= startHour && 
                 currentHour < endHour;
        });

        const assignedWaiter = availableWaiters[Math.floor(Math.random() * availableWaiters.length)] || 
                             get().staff.find(s => s.status === 'active');

        if (!assignedWaiter) {
          throw new Error('No available waiters');
        }

        set(state => ({
          waiterCalls: [...state.waiterCalls, {
            id: nanoid(),
            tableId,
            status: 'pending',
            assignedWaiterId: assignedWaiter.id,
            createdAt: new Date()
          }]
        }));

        return assignedWaiter.name;
      },
      acknowledgeWaiterCall: (callId) => set(state => ({
        waiterCalls: state.waiterCalls.map(call =>
          call.id === callId ? { ...call, status: 'acknowledged' } : call
        )
      }))
    }),
    {
      name: 'quisin-storage',
      partialize: (state) => ({
        menuItems: state.menuItems,
        orders: state.orders,
        staff: state.staff,
        tables: state.tables,
        reservations: state.reservations,
        waiterCalls: state.waiterCalls
      })
    }
  )
);