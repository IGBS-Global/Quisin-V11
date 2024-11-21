import { useState } from 'react';
import { Calendar, Clock, Users, Check, X, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ReservationStatus } from '../types';

export default function ReservationsPanel() {
  const reservations = useStore(state => state.reservations);
  const updateReservationStatus = useStore(state => state.updateReservationStatus);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  const filteredReservations = reservations
    .filter(reservation => reservation.date === dateFilter)
    .sort((a, b) => a.time.localeCompare(b.time));

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Reservations</h2>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div className="grid gap-6">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reservations for this date</p>
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-800">
                      {reservation.customerName}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {reservation.time}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {reservation.guests} guests
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">{reservation.phone}</p>
                  <p className="text-sm text-gray-600">{reservation.email}</p>
                </div>
              </div>

              {reservation.specialRequests && (
                <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">{reservation.specialRequests}</p>
                </div>
              )}

              {reservation.preOrderItems && reservation.preOrderItems.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Pre-ordered Items:</h4>
                  <div className="space-y-2">
                    {reservation.preOrderItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {reservation.total && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${reservation.total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {reservation.status === 'pending' && (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Confirm
                  </button>
                </div>
              )}

              {reservation.status === 'confirmed' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => updateReservationStatus(reservation.id, 'completed')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}