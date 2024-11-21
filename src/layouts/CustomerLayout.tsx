import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import HailWaiter from '../components/HailWaiter';

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const tableId = useStore(state => state.tableId);

  const handleBack = () => {
    const pathMap: Record<string, string> = {
      '/single-order': '/',
      '/group-order': '/',
      '/status': '/',
      '/reservations': '/',
      '/join-group': '/group-order',
      '/invoice': '/single-order'
    };

    const defaultPath = '/';
    const nextPath = pathMap[location.pathname] || defaultPath;
    navigate(nextPath);
  };

  // Don't show back button on home page or scan page
  const showBackButton = !['/scan', '/'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-orange-50">
      {showBackButton && (
        <div className="fixed top-0 left-0 p-4 z-10">
          <button
            onClick={handleBack}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-orange-600" />
          </button>
        </div>
      )}

      {tableId && location.pathname !== '/scan' && (
        <div className="fixed top-0 left-0 right-0 flex justify-center p-4 z-10">
          <div className="px-6 py-2 bg-white rounded-full shadow-lg">
            <span className="text-orange-600 font-medium">Table {tableId}</span>
          </div>
        </div>
      )}

      {tableId && <HailWaiter />}
      <Outlet />
    </div>
  );
}