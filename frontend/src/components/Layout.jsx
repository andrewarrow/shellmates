import { Link } from 'react-router-dom'
import Footer from './Footer'
import { useAuth } from '../hooks/useAuth'

function Layout({ children, hideNavLink = false }) {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.id === 1
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {!hideNavLink && (
        <div className="flex justify-between items-center p-4 bg-gray-900">
          <Link to="/" className="text-xl font-bold text-white hover:text-primary-300">
            shellmates
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link 
                to="/admin" 
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
      
      <div className="flex-1">
        {children}
      </div>
      
      <Footer />
    </div>
  )
}

export default Layout
