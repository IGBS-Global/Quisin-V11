import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import CustomerLayout from './layouts/CustomerLayout';
import WaiterLayout from './layouts/WaiterLayout';
import AdminLayout from './layouts/AdminLayout';
import LandingPage from './pages/LandingPage';
import QRScanner from './components/QRScanner';
import SingleOrder from './pages/SingleOrder';
import GroupOrder from './pages/GroupOrder';
import JoinGroup from './pages/JoinGroup';
import Reservations from './pages/Reservations';
import OrderStatus from './pages/OrderStatus';
import WaiterDashboard from './pages/WaiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  const user = useStore(state => state.user);
  const tableId = useStore(state => state.tableId);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={
            user?.role === 'waiter' ? <Navigate to="/waiter" /> :
            user?.role === 'admin' ? <Navigate to="/admin" /> :
            <LandingPage />
          } />
          <Route path="/scan" element={<QRScanner />} />
          <Route path="/single-order" element={
            tableId ? <SingleOrder /> : <Navigate to="/scan" />
          } />
          <Route path="/group-order" element={
            tableId ? <GroupOrder /> : <Navigate to="/scan" />
          } />
          <Route path="/join-group/:groupId" element={<JoinGroup />} />
          <Route path="/reservations" element={
            tableId ? <Reservations /> : <Navigate to="/scan" />
          } />
          <Route path="/status" element={
            tableId ? <OrderStatus /> : <Navigate to="/scan" />
          } />
        </Route>

        {/* Waiter Routes */}
        <Route element={<WaiterLayout />}>
          <Route path="/waiter" element={
            user?.role === 'waiter' ? <WaiterDashboard /> : <Navigate to="/login" />
          } />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={
            user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />
          } />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;