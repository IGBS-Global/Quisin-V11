import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '../store/useStore';
import MenuCard from './MenuCard';
import Cart from './Cart';

interface MenuProps {
  tableNumber: string;
  orderItems: Array<{ id: number; name: string; price: number; quantity: number }>;
  setOrderItems: React.Dispatch<React.SetStateAction<Array<{ id: number; name: string; price: number; quantity: number }>>>;
  onPlaceOrder: () => void;
}

export default function Menu({ tableNumber, orderItems, setOrderItems, onPlaceOrder }: MenuProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Main Course');
  const menuItems = useStore(state => state.menuItems);

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

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
  const filteredItems = menuItems.filter(item => 
    item.category === activeCategory && item.available
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8 mt-16">
        <h1 className="text-3xl font-bold text-gray-800">Menu</h1>
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart ({totalItems})
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeCategory === category
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-600 hover:bg-orange-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={() => addToCart({
              id: item.id,
              name: item.name,
              price: item.price
            })}
          />
        ))}
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