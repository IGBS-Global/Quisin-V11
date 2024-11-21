import { Clock } from 'lucide-react';

export default function OrderPanel() {
  const orders = [
    {
      id: 1,
      table: 'Table 5',
      items: ['Classic Burger', 'Caesar Salad'],
      status: 'pending',
      time: '5 min ago'
    },
    // Add more orders as needed
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Active Orders</h2>
      
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-800">{order.table}</h3>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {order.time}
              </div>
            </div>
            <div className="space-y-1">
              {order.items.map((item, index) => (
                <div key={index} className="text-sm text-gray-600">{item}</div>
              ))}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded">
                View Details
              </button>
              <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Complete Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}