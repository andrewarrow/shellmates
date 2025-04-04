import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

function EC2Dashboard() {
  const { currentUser, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showServiceMenu, setShowServiceMenu] = useState(false)

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
            <div className="text-xl font-bold">Traffic</div>
            
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
                    <div className="flex items-start p-2 hover:bg-gray-100 rounded-md cursor-pointer">
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
        <div>
          <span className="text-gray-300">Traffic Console</span> / <span>EC2</span>
        </div>
        <div className="flex space-x-4">
          <button className="hover:underline">Support</button>
          <button className="hover:underline">Documentation</button>
        </div>
      </div>

      <main className="flex-1 p-0">
        <div className="flex h-full">
          {/* Left side menu - 20% of screen */}
          <div className="w-1/5 bg-gray-50 border-r border-gray-200 py-4 h-full">
            <div className="px-4 pb-4 mb-2 border-b border-gray-200">
              <h2 className="font-medium text-lg">EC2 Dashboard</h2>
            </div>
            <nav className="px-2">
              <ul className="space-y-1">
                <li>
                  <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md bg-blue-50 text-blue-700">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-100">
                    Instances
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-100">
                    Volumes
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-100">
                    Security Groups
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-100">
                    Load Balancers
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-100">
                    Auto Scaling Groups
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-100">
                    Key Pairs
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-100">
                    Elastic IPs
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-100">
                    Placement Groups
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-2 py-2 text-sm rounded-md hover:bg-gray-100">
                    Capacity Reservations
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Right side container - 80% of screen */}
          <div className="w-4/5 flex flex-col">
            {/* Main content area - 75% of right side */}
            <div className="h-3/4 p-6 overflow-y-auto">
              {/* Resources Card */}
              <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="font-medium text-lg">Resources</h2>
                </div>
                <div className="p-6">
                  <p className="mb-4">You are using the following Amazon EC2 resources in the United States (N. Virginia) Region:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Instances (running)</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Auto Scaling Groups</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Capacity Reservations</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Dedicated Hosts</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Elastic IPs</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Instances</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Key pairs</span>
                      <span className="font-medium">4</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Load balancers</span>
                      <span className="font-medium">13</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Placement groups</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Security groups</span>
                      <span className="font-medium">63</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Snapshots</span>
                      <span className="font-medium">4</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Volumes</span>
                      <span className="font-medium">36</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Instance Status Card */}
              <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="font-medium text-lg">Instance Status</h2>
                </div>
                <div className="p-6">
                  <div className="flex mb-4">
                    <div className="w-1/3 px-2">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">18</div>
                        <div className="text-sm text-gray-600">Running</div>
                      </div>
                    </div>
                    <div className="w-1/3 px-2">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-gray-400">0</div>
                        <div className="text-sm text-gray-600">Stopped</div>
                      </div>
                    </div>
                    <div className="w-1/3 px-2">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-gray-400">0</div>
                        <div className="text-sm text-gray-600">Terminated</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Events Card */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="font-medium text-lg">Recent Events</h2>
                </div>
                <div className="p-6">
                  <div className="text-center text-gray-500 py-8">
                    <p>No recent events to display</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom content area - 25% of right side */}
            <div className="h-1/4 bg-gray-50 border-t border-gray-200 p-6 overflow-y-auto">
              <h2 className="font-medium text-lg mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Instance i-a1b2c3d4 started</div>
                      <div className="text-sm text-gray-500">5 minutes ago</div>
                    </div>
                    <div className="text-green-500 text-sm">Success</div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Security group sg-1234 modified</div>
                      <div className="text-sm text-gray-500">1 hour ago</div>
                    </div>
                    <div className="text-green-500 text-sm">Success</div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Volume vol-5678 created</div>
                      <div className="text-sm text-gray-500">3 hours ago</div>
                    </div>
                    <div className="text-green-500 text-sm">Success</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4 px-6 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">© 2025, Traffic, Inc. or its affiliates. All rights reserved.</div>
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

export default EC2Dashboard