import { Link } from 'react-router-dom'

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
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">© 2025 shellmates or its affiliates. All rights reserved.</div>
          <div className="flex space-x-4">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
