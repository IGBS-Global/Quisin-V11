import { Plus } from 'lucide-react';

export default function MenuPanel() {
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
    },
    // Add more items as needed
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Menu Items</h2>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-semibold text-indigo-600">${item.price}</span>
                <button className="text-sm text-indigo-600 hover:text-indigo-700">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}