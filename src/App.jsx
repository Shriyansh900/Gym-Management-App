import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardTrainer from './pages/DashboardTrainer';
import DashboardMember from './pages/DashboardMember';
import Members from './pages/Members';
import Classes from './pages/Classes';
import Payments from './pages/Payments';
import ProfileSettings from './pages/ProfileSettings';
import TrainersManagement from './pages/TrainersManagement';
import MyMembers from './pages/MyMembers';
import AttendanceManagement from './pages/AttendanceManagement';
import ProgressTracking from './pages/ProgressTracking';
import MyWorkouts from './pages/MyWorkouts';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Dashboard Router Component
const DashboardRouter = () => {
  const { user } = useAuth();

  if (user.role === 'admin') {
    return <DashboardAdmin />;
  } else if (user.role === 'trainer') {
    return <DashboardTrainer />;
  } else if (user.role === 'member') {
    return <DashboardMember />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <DashboardRouter />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/members" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout>
                      <Members />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/trainers" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout>
                      <TrainersManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/payments" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout>
                      <Payments />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/reports" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout>
                      <div className="text-center py-12 animate-on-scroll">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/leads" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout>
                      <div className="text-center py-12 animate-on-scroll">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Management</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Trainer Routes */}
                <Route path="/my-members" element={
                  <ProtectedRoute allowedRoles={['trainer']}>
                    <Layout>
                      <MyMembers />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/attendance" element={
                  <ProtectedRoute allowedRoles={['trainer']}>
                    <Layout>
                      <AttendanceManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/progress" element={
                  <ProtectedRoute allowedRoles={['trainer']}>
                    <Layout>
                      <ProgressTracking />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Member Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={['member']}>
                    <Layout>
                      <ProfileSettings />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/my-progress" element={
                  <ProtectedRoute allowedRoles={['member']}>
                    <Layout>
                      <div className="text-center py-12 animate-on-scroll">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Progress</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/workouts" element={
                  <ProtectedRoute allowedRoles={['member']}>
                    <Layout>
                      <MyWorkouts />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/membership" element={
                  <ProtectedRoute allowedRoles={['member']}>
                    <Layout>
                      <div className="text-center py-12 animate-on-scroll">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Membership Details</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Coming soon...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Shared Routes */}
                <Route path="/classes" element={
                  <ProtectedRoute>
                    <Layout>
                      <Classes />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Settings Routes - Available to all authenticated users */}
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfileSettings />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              
              {/* Toast Container */}
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                className="mt-16"
              />
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;