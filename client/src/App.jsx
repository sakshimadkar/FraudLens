import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import History from './pages/History';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/scanner" element={
            <PrivateRoute>
              <Scanner />
            </PrivateRoute>
          } />
          
          <Route path="/history" element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#121212',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
