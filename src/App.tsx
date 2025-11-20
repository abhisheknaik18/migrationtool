import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const { user, checkAuth } = useAuthStore();

  // 🚀 DEMO MODE - Authentication disabled for testing
  const DEMO_MODE = true;

  useEffect(() => {
    if (!DEMO_MODE) {
      checkAuth();
    }
  }, [checkAuth]);

  // Skip auth in demo mode
  if (DEMO_MODE || user) {
    return <Dashboard />;
  }

  return (
    <div className="app">
      {showLogin ? (
        <Login onToggleMode={() => setShowLogin(false)} />
      ) : (
        <Register onToggleMode={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default App;
