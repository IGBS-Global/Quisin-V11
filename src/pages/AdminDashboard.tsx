import { useState } from 'react';
import { useStore } from '../store/useStore';
import AdminNavbar from '../components/AdminNavbar';
import MenuManagementPanel from '../components/MenuManagementPanel';
import ReservationsPanel from '../components/ReservationsPanel';
import TableManagementPanel from '../components/TableManagementPanel';
import StaffManagementPanel from '../components/StaffManagementPanel';
import { Users, Utensils, DollarSign, TrendingUp, Receipt } from 'lucide-react';

export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState('overview');
  const orders = useStore(state => state.getFilteredOrders());
  const tables = useStore(state => state.getTables());
  const staff = useStore(state => state.getStaff());
  const reservations = useStore(state => state.reservations);

  const renderPanel = () => {
    switch (activePanel) {
      case 'menu':
        return <MenuManagementPanel />;
      case 'reservations':
        return <ReservationsPanel />;
      case 'tables':
        return <TableManagementPanel />;
      case 'staff':
        return <StaffManagementPanel />;
      default:
        return (
          <div className="p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">
                      ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Receipt className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">Active Staff</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {staff.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">Today's Reservations</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {reservations.filter(r => 
                        r.date === new Date().toISOString().split('T')[0] &&
                        r.status === 'confirmed'
                      ).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              </div>
              <div className="divide-y">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800">Table {order.tableId}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'ready' ? 'bg-green-100 text-green-800' :
                            order.status === 'served' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Order #{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Tax: ${order.tax.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Assigned to {order.waiterName}</span>
                      <span className="text-gray-600">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar activePanel={activePanel} setActivePanel={setActivePanel} />
      {renderPanel()}
    </div>
  );
}