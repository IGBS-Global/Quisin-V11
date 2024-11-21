import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Activity, ArrowLeft, Clock, User } from 'lucide-react';

export default function OrderStatus() {
  const navigate = useNavigate();
  const tableId = useStore(state => state.tableId);
  const orders = useStore(state => state.orders);
  
  // Get the most recent order for this table
  const currentOrder = orders
    .filter(order => order.tableId === tableId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  if (!tableId) {
    navigate('/scan');
    return null;
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-orange-50 p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-orange-600 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Active Order</h1>
          <p className="text-gray-600">You don't have any active orders at the moment.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'preparing':
        return 'text-blue-600 bg-blue-50';
      case 'ready':
        return 'text-green-600 bg-green-50';
      case 'served':
        return 'text-orange-600 bg-orange-50';
      case 'closed':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-orange-600 mb-8 hover:text-orange-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Activity className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Order Status</h1>
          <p className="text-orange-600">Table {tableId}</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Order #{currentOrder.id}</span>
            <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(currentOrder.status)}`}>
              {currentOrder.status}
            </span>
          </div>

          <div className="border-t border-b py-4 space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Assigned Waiter</p>
                <p className="font-medium">{currentOrder.waiterName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Estimated Time</p>
                <p className="font-medium">{currentOrder.estimatedTime}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-medium text-gray-800">Order Items:</p>
            {currentOrder.items.map((item, index) => (
              <div key={index} className="flex justify-between text-gray-600">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-3 border-t flex justify-between font-semibold">
              <span>Total</span>
              <span>${currentOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}