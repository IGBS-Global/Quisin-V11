import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import MenuCard from './MenuCard';
import Cart from './Cart';

interface SingleOrderProps {
  tableNumber: string;
  orderItems: Array<{ id: number; name: string; price: number; quantity: number }>;
  setOrderItems: React.Dispatch<React.SetStateAction<Array<{ id: number; name: string; price: number; quantity: number }>>>;
  onPlaceOrder: () => void;
}

export default function SingleOrder({ tableNumber, orderItems, setOrderItems, onPlaceOrder }: SingleOrderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const menuItems = [
    {
      id: 1,
      name: 'Classic Burger',
      price: 12.99,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&h=200'
    },
    {
      id: 2,
      name: 'Caesar Salad',
      price: 8.99,
      category: 'Starters',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=300&h=200'
    }
  ];

  const addToCart = (item: { id: number; name: string; price: number }) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setOrderItems(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Menu</h1>
            <p className="text-orange-600">Table {tableNumber}</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart ({totalItems})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={() => addToCart(item)}
            />
          ))}
        </div>
      </div>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={orderItems}
        updateQuantity={updateQuantity}
        onPlaceOrder={onPlaceOrder}
        tableNumber={tableNumber}
      />
    </div>
  );
}