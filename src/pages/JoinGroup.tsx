import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Loader2 } from 'lucide-react';

export default function JoinGroup() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const setTableId = useStore(state => state.setTableId);

  useEffect(() => {
    if (groupId) {
      // Extract table ID from group ID (format: tableId-timestamp)
      const tableId = groupId.split('-')[0];
      setTableId(tableId);
      // Redirect to single order page after setting table ID
      navigate('/single-order');
    }
  }, [groupId, setTableId, navigate]);

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Joining group order...</p>
      </div>
    </div>
  );
}