import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import SkillsPage from './pages/SkillsPage';
import MatchesPage from './pages/MatchesPage';
import RequestsPage from './pages/RequestsPage';
import SessionsPage from './pages/SessionsPage';
import ProfilePage from './pages/ProfilePage';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Styles
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <ToastContainer position="top-right" autoClose={3000} />
   
            <Routes>
              {/* Public Routes */}
               
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Header />
                  <Dashboard />
                  <Footer />
                </ProtectedRoute>
              } />
              
              <Route path="/skills" element={
                <ProtectedRoute>
                  <Header />
                  <SkillsPage />
                  <Footer />
                </ProtectedRoute>
              } />
              
              <Route path="/matches" element={
                <ProtectedRoute>
                  <Header />
                  <MatchesPage />
                  <Footer />
                </ProtectedRoute>
              } />
              
              <Route path="/requests" element={
                <ProtectedRoute>
                  <Header />
                  <RequestsPage />
                  <Footer />
                </ProtectedRoute>
              } />
              
              <Route path="/sessions" element={
                <ProtectedRoute>
                  <Header />
                  <SessionsPage />
                  <Footer />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Header />
                  <ProfilePage />
                  <Footer />
                </ProtectedRoute>
              } />
              
              {/* Catch all - redirect to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;