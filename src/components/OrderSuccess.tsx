import { useState, useEffect } from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderSuccessProps {
  orderId: string;
  waiterName: string;
  estimatedTime: string;
}

export default function OrderSuccess({ orderId, waiterName, estimatedTime }: OrderSuccessProps) {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-6">
      <div className={`max-w-md w-full text-center transition-opacity duration-500 ${
        showAnimation ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-2">Order #{orderId}</p>
        
        <div className="bg-orange-50 rounded-lg p-6 mb-8">
          <p className="text-gray-600 mb-4">
            Your order has been assigned to:
          </p>
          <p className="text-xl font-semibold text-orange-600 mb-2">{waiterName}</p>
          <p className="text-gray-600">
            Estimated serving time: <span className="font-medium">{estimatedTime}</span>
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/status')}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Check Order Status
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}