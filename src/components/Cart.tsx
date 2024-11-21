import { Plus, Minus, X } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ id: number; name: string; price: number; quantity: number }>;
  updateQuantity: (id: number, delta: number) => void;
  onPlaceOrder: () => void;
  tableNumber: string;
}

export default function Cart({ isOpen, onClose, items, updateQuantity, onPlaceOrder }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="w-full max-w-md bg-white h-full">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b bg-orange-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Order</h2>
              <p className="text-sm text-orange-600 mt-1">Review your items</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-orange-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p>Your cart is empty</p>
                <p className="text-sm mt-2">Add some delicious items to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-orange-600">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 rounded-full hover:bg-orange-100 text-orange-600"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded-full hover:bg-orange-100 text-orange-600"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t shadow-lg">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={onPlaceOrder}
              disabled={items.length === 0}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-medium
                hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                transition-colors shadow-lg hover:shadow-xl"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}