import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      setIsLoggingOut(false)
    }, 500) // Simulate a slight delay
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-primary-800">Traffic Simulator</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {currentUser?.username}</span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to Traffic</h2>
          <p className="text-gray-600 mb-6">
            This simulator will help you learn how to handle system scaling challenges.
            Stay tuned for interactive simulations and learning modules.  
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-primary-700 mb-2">Beginner Challenges</h3>
              <p className="text-gray-600">Learn the basics of handling increased traffic.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-primary-700 mb-2">Intermediate Scenarios</h3>
              <p className="text-gray-600">Practice more complex scaling patterns.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-primary-700 mb-2">Advanced Simulations</h3>
              <p className="text-gray-600">Master complex scaling architectures.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
