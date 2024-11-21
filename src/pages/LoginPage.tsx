import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const loginStaff = useStore(state => state.loginStaff);
  const loginAdmin = useStore(state => state.loginAdmin);
  const [role, setRole] = useState<'waiter' | 'admin'>('waiter');
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    
    if (role === 'admin') {
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        loginAdmin();
        navigate('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      const success = loginStaff(credentials.username, credentials.password);
      if (success) {
        navigate('/waiter');
      } else {
        setError('Invalid waiter credentials');
      }
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Staff Login</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'waiter' | 'admin')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="waiter">Waiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={role === 'admin' ? 'admin' : 'Enter your username'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={role === 'admin' ? '••••••••' : 'Enter your password'}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Login
          </button>

          <p className="text-sm text-center text-gray-600">
            Customer? <a href="/" className="text-orange-600 hover:text-orange-700">Go to ordering page</a>
          </p>
        </div>
      </div>
    </div>
  );
}