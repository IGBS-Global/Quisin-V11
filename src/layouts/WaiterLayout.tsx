import { Outlet, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function WaiterLayout() {
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);

  if (!user || user.role !== 'waiter') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 right-0 p-4">
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 shadow-sm"
        >
          Logout
        </button>
      </div>
      <Outlet />
    </div>
  );
}