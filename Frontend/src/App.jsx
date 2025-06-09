import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Outlet, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import { Signup } from './components/Signup';
import Dashboard from './pages/Dashboard';
import PendingPage from './pages/PendingPage';
import CompletePage from './pages/CompletePage';
import Profile from './components/Profile';

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleAuthSubmit = (data) => {
    const user = {
      name: data.name || 'User',
      email: data.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
    };
    setCurrentUser(user);
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  const ProtectedLayout = () => (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );

  return (
    <Routes>


      <Route element={currentUser ? <ProtectedLayout /> : <Navigate to='/login' replace />} >
        <Route path="/" element={<Dashboard />} />
        <Route path='/pending' element={<PendingPage/>}/>
        <Route path='/complete' element={<CompletePage/>}/>
        <Route path='/profile' element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout}/>}/>
      </Route >
      <Route path='*' element={<Navigate to={currentUser ? '/' : '/login'} replace />} />

      <Route
        path="/login"
        element={
          <Login
            onSubmit={handleAuthSubmit}
            onSwitch={() => navigate('/signUp')}
          />
        }
      />

      <Route
        path="/signUp"
        element={
          <Signup
            onSubmit={handleAuthSubmit}
            onSwitch={() => navigate('/login')}
          />
        }
      />
    </Routes>
  );
}

export default App;