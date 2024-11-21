import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function WaiterNotifications() {
  const [showNotifications, setShowNotifications] = useState(false);
  const user = useStore(state => state.user);
  const waiterCalls = useStore(state => state.waiterCalls);
  const acknowledgeWaiterCall = useStore(state => state.acknowledgeWaiterCall);

  // Filter calls for current waiter that are pending
  const pendingCalls = waiterCalls.filter(call => 
    call.status === 'pending' && 
    call.assignedWaiterId === user?.id
  );

  const handleAcknowledge = (callId: string) => {
    acknowledgeWaiterCall(callId);
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {pendingCalls.length > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {pendingCalls.length}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <h3 className="font-medium text-gray-800">Table Calls</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {pendingCalls.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No pending calls
              </div>
            ) : (
              <div className="divide-y">
                {pendingCalls.map((call) => (
                  <div key={call.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          Table {call.tableId} needs assistance
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(call.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAcknowledge(call.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        title="Acknowledge"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}