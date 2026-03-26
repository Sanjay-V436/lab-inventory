import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import StudentForm from './pages/StudentForm';
import SubmitSuccess from './pages/SubmitSuccess';
import Login from './pages/Login';

// Dashboard pages
import DashboardLayout from './pages/dashboard/Layout';
import Requests from './pages/dashboard/Requests';
import RequestDetail from './pages/dashboard/RequestDetail';
import Returns from './pages/dashboard/Returns';
import ReturnDetail from './pages/dashboard/ReturnDetail';
import History from './pages/dashboard/History';
import HistoryDetail from './pages/dashboard/HistoryDetail';
import ComponentDB from './pages/dashboard/ComponentDB';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<StudentForm />} />
        <Route path="/success" element={<SubmitSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard/requests" replace />} />
          <Route path="requests" element={<Requests />} />
          <Route path="requests/:id" element={<RequestDetail />} />
          <Route path="returns" element={<Returns />} />
          <Route path="returns/:id" element={<ReturnDetail />} />
          <Route path="history" element={<History />} />
          <Route path="history/:id" element={<HistoryDetail />} />
          <Route path="components" element={<ComponentDB />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;