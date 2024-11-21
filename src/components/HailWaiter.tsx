import { useState, useEffect } from 'react';
import { Bell, Phone } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function HailWaiter() {
  const tableId = useStore(state => state.tableId);
  const hailWaiter = useStore(state => state.hailWaiter);
  const staff = useStore(state => state.getStaff());
  const [isHailed, setIsHailed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [assignedWaiter, setAssignedWaiter] = useState<string | null>(null);

  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmation]);

  const getAvailableWaiter = () => {
    const availableWaiters = staff.filter(s => {
      if (s.status !== 'active') return false;
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const [startHour] = s.shift.start.split(':').map(Number);
      const [endHour] = s.shift.end.split(':').map(Number);
      
      return s.shift.days.includes(currentDay) && 
             currentHour >= startHour && 
             currentHour < endHour;
    });

    if (availableWaiters.length === 0) {
      // If no waiters are available during their shift, get any active waiter
      return staff.find(s => s.status === 'active')?.name || 'Next Available Waiter';
    }

    // Randomly select from available waiters
    const randomWaiter = availableWaiters[Math.floor(Math.random() * availableWaiters.length)];
    return randomWaiter.name;
  };

  const handleHailWaiter = () => {
    if (!isHailed && tableId) {
      const waiterName = getAvailableWaiter();
      setAssignedWaiter(waiterName);
      hailWaiter(tableId);
      setIsHailed(true);
      setShowConfirmation(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-4">
      {/* Assistance Info */}
      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
        <Phone className="w-4 h-4 text-orange-600" />
        <span className="text-gray-700">Need assistance? Call <span className="font-medium">1-800-QUISIN</span></span>
      </div>

      {/* Hail Waiter Button */}
      <button
        onClick={handleHailWaiter}
        disabled={isHailed}
        className={`group relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all ${
          isHailed 
            ? 'bg-green-100 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-700 hover:shadow-xl'
        }`}
      >
        <Bell className={`w-6 h-6 ${isHailed ? 'text-green-600' : 'text-white'}`} />
        
        {/* Tooltip */}
        <span className="absolute bottom-full mb-2 px-3 py-1 text-sm text-white bg-gray-900 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {isHailed ? 'Waiter has been called' : 'Call Waiter'}
        </span>
      </button>

      {/* Confirmation Message */}
      {showConfirmation && (
        <div className="absolute bottom-full right-0 mb-4 w-64 transform transition-all animate-fade-in">
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow-lg">
            <p className="font-medium">Waiter has been hailed!</p>
            <p className="text-sm">{assignedWaiter} will be with you shortly</p>
          </div>
        </div>
      )}
    </div>
  );
}