import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import SplashPage from './pages/SplashPage'
import Dashboard from './pages/Dashboard'
import EC2Dashboard from './pages/EC2Dashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SplashPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/ec2" 
        element={isAuthenticated ? <EC2Dashboard /> : <Navigate to="/login" />} 
      />
    </Routes>
  )
}

export default App
