import { Link } from 'react-router-dom'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-primary-300">
          shellmates
        </Link>
      </div>
      {children}
    </div>
  )
}

export default Layout