import { Link } from 'react-router-dom'
import Footer from './Footer'

function Layout({ children, hideNavLink = false }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {!hideNavLink && (
        <div className="flex justify-between items-center p-4 bg-gray-900">
          <Link to="/" className="text-xl font-bold text-white hover:text-primary-300">
            shellmates
          </Link>
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
