import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useEffect, useState } from 'react'
import SplashPage from './pages/SplashPage'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SingleServer from './pages/SingleServer'
import Spot from './pages/Spot'
import RentedSpot from './pages/RentedSpot'
import BrowseSpots from './pages/BrowseSpots'
import AdminPage from './pages/AdminPage'
import IceBreakerPage from './pages/IceBreakerPage'

// Component to handle Stripe redirect and forward to backend
function StripeRedirect() {
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  
  useEffect(() => {
    // Get the search params from the URL (like session_id)
    const queryParams = location.search
    const searchParams = new URLSearchParams(queryParams)
    
    // If we have a session_id, forward to backend
    if (searchParams.has('session_id')) {
      // Forward to backend /api/stripe/callback endpoint with the same query parameters
      window.location.href = `/api/stripe/callback${queryParams}`
    } else {
      // Set error state if no session_id
      setError(true)
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 3000)
    }
  }, [location, navigate])
  
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">Payment Error</h2>
        <p className="text-gray-600 text-center mb-6">
          We couldn't process your payment. Missing session information.
        </p>
        <p className="text-gray-500 text-center text-sm">
          Redirecting to dashboard...
        </p>
      </div>
    )
  }
  
  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-blue-500 mb-4">
        <svg className="animate-spin h-12 w-12 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-center mb-4">Processing Payment</h2>
      <p className="text-gray-600 text-center">
        Please wait while we verify your payment with Stripe...
      </p>
    </div>
  )
}

function App() {
  const { isAuthenticated } = useAuth()

  // Terms and Privacy pages are handled by static HTML outside of React
  // Create components to redirect to the static pages
  const TermsPage = () => {
    useEffect(() => {
      window.location.href = '/terms/index.html';
    }, []);
    return <div className="text-center p-10">Redirecting to Terms of Service...</div>;
  };

  const PrivacyPage = () => {
    useEffect(() => {
      window.location.href = '/privacy/index.html';
    }, []);
    return <div className="text-center p-10">Redirecting to Privacy Policy...</div>;
  };

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SplashPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route path="/icebreaker" element={<IceBreakerPage />} />
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
      <Route
        path="/stripe"
        element={<StripeRedirect />}
      />
      <Route 
        path="/browse-spots" 
        element={<BrowseSpots />} 
      />
      <Route 
        path="/rented-spot/:guid" 
        element={isAuthenticated ? <RentedSpot /> : <Navigate to="/login" />} 
      />
      <Route
        path="/admin"
        element={<AdminPage />}
      />
      {/* Routes for Terms and Privacy pages */}
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
    </Routes>
  )
}

export default App
