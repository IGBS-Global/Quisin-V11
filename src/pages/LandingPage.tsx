import { Users, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const tableId = useStore(state => state.tableId);

  const handleNavigation = (path: string) => {
    if (!tableId) {
      navigate('/scan');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="w-full max-w-lg text-center mb-12">
        <h1 className="text-5xl font-bold text-orange-600 mb-4">Quisin</h1>
        {tableId && <p className="text-xl text-orange-700">Table {tableId}</p>}
        <p className="text-lg text-orange-600 mt-2">Welcome to your dining experience</p>
      </div>
      
      <div className="w-full max-w-lg space-y-4">
        <button 
          onClick={() => handleNavigation('/single-order')}
          className="w-full flex items-center justify-center gap-4 p-6 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <User className="w-8 h-8" />
          <div className="text-left">
            <h2 className="text-xl font-semibold">Single Order</h2>
            <p className="text-orange-100">Place an order for yourself</p>
          </div>
        </button>

        <button 
          onClick={() => handleNavigation('/group-order')}
          className="w-full flex items-center justify-center gap-4 p-6 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
        >
          <Users className="w-8 h-8" />
          <div className="text-left">
            <h2 className="text-xl font-semibold">Group Order</h2>
            <p className="text-orange-100">Order together with friends</p>
          </div>
        </button>

        <button 
          onClick={() => handleNavigation('/reservations')}
          className="w-full flex items-center justify-center gap-4 p-6 bg-orange-400 text-white rounded-xl hover:bg-orange-500 transition-colors shadow-lg hover:shadow-xl"
        >
          <Calendar className="w-8 h-8" />
          <div className="text-left">
            <h2 className="text-xl font-semibold">Reservations</h2>
            <p className="text-orange-100">Book a table in advance</p>
          </div>
        </button>
      </div>

      {/* Status button */}
      <button 
        onClick={() => handleNavigation('/status')}
        className="mt-8 px-6 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors shadow"
      >
        Check Order Status
      </button>
    </div>
  );
}