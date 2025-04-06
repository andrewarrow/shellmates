import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import SplashPage from './pages/SplashPage'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SingleServer from './pages/SingleServer'
import Spot from './pages/Spot'

function App() {
  const { isAuthenticated } = useAuth()

  // Terms and Privacy pages are handled by static HTML outside of React
  // The appropriate HTML files are served directly from /terms/index.html and /privacy/index.html

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
        path="/server/:id" 
        element={isAuthenticated ? <SingleServer /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/spot/:id" 
        element={<Spot />} 
      />
      <Route 
        path="/spots/:id" 
        element={<Spot />} 
      />
    </Routes>
  )
}

export default App
