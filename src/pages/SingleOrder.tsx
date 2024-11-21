import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Menu from '../components/Menu';
import Invoice from '../components/Invoice';
import OrderSuccess from '../components/OrderSuccess';

export default function SingleOrder() {
  const navigate = useNavigate();
  const tableId = useStore(state => state.tableId);
  const addOrder = useStore(state => state.addOrder);
  const menuItems = useStore(state => state.menuItems);
  const [step, setStep] = useState<'menu' | 'invoice' | 'success'>('menu');
  const [orderItems, setOrderItems] = useState<Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!tableId) {
    navigate('/scan');
    return null;
  }

  const handlePlaceOrder = () => {
    setStep('invoice');
  };

  const handleFinishOrder = () => {
    try {
      // Find complete menu item details for each ordered item
      const completeOrderItems = orderItems.map(orderItem => {
        const menuItem = menuItems.find(item => item.id === orderItem.id);
        if (!menuItem) {
          throw new Error(`Menu item not found: ${orderItem.id}`);
        }
        return {
          ...menuItem,
          quantity: orderItem.quantity
        };
      });

      const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      // Create new order with complete item information
      const newOrderId = addOrder({
        tableId,
        items: completeOrderItems,
        status: 'pending',
        subtotal,
        tax,
        total,
        estimatedTime: '15-20 minutes'
      });

      setOrderId(newOrderId);
      setStep('success');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {step === 'menu' && (
        <Menu
          tableNumber={tableId}
          orderItems={orderItems}
          setOrderItems={setOrderItems}
          onPlaceOrder={handlePlaceOrder}
        />
      )}
      
      {step === 'invoice' && (
        <Invoice
          tableNumber={tableId}
          orderItems={orderItems}
          onFinishOrder={handleFinishOrder}
        />
      )}

      {step === 'success' && orderId && (
        <OrderSuccess
          orderId={orderId}
          waiterName="Your assigned waiter"
          estimatedTime="15-20 minutes"
        />
      )}
    </div>
  );
}