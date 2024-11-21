interface InvoiceProps {
  tableNumber: string;
  orderItems: Array<{ id: number; name: string; price: number; quantity: number }>;
  onFinishOrder: () => void;
}

export default function Invoice({ tableNumber, orderItems, onFinishOrder }: InvoiceProps) {
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
              <p className="text-orange-600">Table {tableNumber}</p>
            </div>
            <p className="text-gray-600">Order #123</p>
          </div>

          <div className="border-t border-b py-4 mb-4">
            {orderItems.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600 ml-2">x{item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onFinishOrder}
            className="w-full mt-8 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Finish Order
          </button>
        </div>
      </div>
    </div>
  );
}