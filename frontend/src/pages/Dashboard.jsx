import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showServiceMenu, setShowServiceMenu] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')
  const [sideMenuActive, setSideMenuActive] = useState('')

  const handleLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      setIsLoggingOut(false)
    }, 500) // Simulate a slight delay
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-gray-900 text-white">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left Side - Logo & Service Menu */}
          <div className="flex items-center space-x-6">
            <div className="text-xl font-bold">shellmates</div>
            
            {/* Service Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowServiceMenu(!showServiceMenu)}
                className="flex items-center space-x-1 px-3 py-1 hover:bg-gray-800 rounded-md"
              >
                <span>Services</span>
                <span className="text-xs">▼</span>
              </button>
              
              {showServiceMenu && (
                <div className="absolute left-0 mt-1 w-64 bg-white text-gray-800 shadow-lg rounded-md z-10">
                  <div className="p-3 border-b border-gray-200">
                    <input 
                      type="text" 
                      placeholder="Find a service" 
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="p-2">
                    <div className="font-bold px-2 py-1 text-sm text-gray-600">Recently visited</div>
                    <div className="flex items-start p-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => window.location.href = '/ec2'}>
                      <span className="text-xl mr-2">🖥️</span>
                      <div>
                        <div className="font-medium">EC2</div>
                        <div className="text-xs text-gray-500">Virtual servers in the cloud</div>
                      </div>
                    </div>
                    <div className="flex items-start p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                      <span className="text-xl mr-2">📦</span>
                      <div>
                        <div className="font-medium">S3</div>
                        <div className="text-xs text-gray-500">Scalable storage in the cloud</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - Search, Region, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block">
              <input 
                type="text" 
                placeholder="Search" 
                className="px-3 py-1 bg-gray-800 rounded-md text-white w-64"
              />
            </div>
            
            {/* Region Selector */}
            <div className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-800 rounded-md cursor-pointer">
              <span className="hidden sm:inline">US East (N. Virginia)</span>
              <span className="sm:hidden">us-east-1</span>
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)} 
                className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-800 rounded-md"
              >
                <span>{currentUser?.username || 'User'}</span>
                <span className="text-xs">▼</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white text-gray-800 shadow-lg rounded-md z-10">
                  <div className="p-2 border-b border-gray-200">
                    <div className="font-bold">{currentUser?.username || 'User'}</div>
                    <div className="text-xs text-gray-500">user-id</div>
                  </div>
                  <div className="py-1">
                    <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">Account</div>
                    <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">Security credentials</div>
                    <div 
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Sign out
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation - Breadcrumbs, Help */}
      <div className="bg-gray-800 text-white px-4 py-1 flex justify-between text-sm">
        <div className="flex space-x-4">
          <button className="hover:underline">Support</button>
          <button className="hover:underline">Documentation</button>
        </div>
      </div>

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recently Visited */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-medium">My Servers</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer" onClick={() => window.location.href = '/ec2'}>
                    <span className="text-xl">🖥️</span>
                    <span>EC2</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <span className="text-xl">📦</span>
                    <span>S3</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <span className="text-xl">λ</span>
                    <span>Lambda</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <span className="text-xl">🗄️</span>
                    <span>DynamoDB</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Favorites */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-medium">Spots Open</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer" onClick={() => window.location.href = '/ec2'}>
                    <span className="text-xl">🖥️</span>
                    <span>EC2</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <span className="text-xl">📦</span>
                    <span>S3</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                    <span className="text-xl">📊</span>
                    <span>CloudWatch</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CloudWatch Metrics */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-medium">My Shells</h2>
              </div>
              <div className="p-6 flex justify-center items-center h-48">
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-2">📊</div>
                  <div>No metrics to display</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4 px-6 text-sm text-gray-600 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">© 2025 shellmates or its affiliates. All rights reserved.</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Cookie Preferences</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
