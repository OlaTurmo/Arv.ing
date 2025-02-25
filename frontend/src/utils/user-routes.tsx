import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '../components/RootLayout';
import { UserGuard } from 'app';
import App from '../pages/App';
import Dashboard from '../pages/Dashboard';
import Documents from '../pages/Documents';
import EstateSetup from '../pages/EstateSetup';
import Files from '../pages/Files';
import Login from '../pages/Login';
import Logout from '../pages/Logout';

import Transactions from '../pages/Transactions';

export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Open routes */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route element={<UserGuard />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/estate-setup" element={<EstateSetup />} />
          <Route path="/files" element={<Files />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>
      </Route>
    </Routes>
  );
}
