export default function KitchenPanel() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Kitchen Display</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Order #123</h3>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              In Progress
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Classic Burger</span>
              <span className="text-xs text-gray-500">x1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Caesar Salad</span>
              <span className="text-xs text-gray-500">x1</span>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Mark as Ready
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}