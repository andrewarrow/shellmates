import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'

function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showServiceMenu, setShowServiceMenu] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')
  const [sideMenuActive, setSideMenuActive] = useState('')
  const [showAddServerModal, setShowAddServerModal] = useState(false)
  const [showEditServerModal, setShowEditServerModal] = useState(false)
  const [showAddSpotModal, setShowAddSpotModal] = useState(false)
  const [servers, setServers] = useState([])
  const [spots, setSpots] = useState([])
  const [newServer, setNewServer] = useState({
    name: '',
    ip_address: '',
    latitude: '',
    longitude: '',
    memory: '',
    cpu_cores: '',
    hard_drive_size: ''
  })
  const [newSpot, setNewSpot] = useState({
    server_id: '',
    memory: '',
    cpu_cores: '',
    hard_drive_size: ''
  })
  const [editingServer, setEditingServer] = useState(null)
  const [editingSpot, setEditingSpot] = useState(null)
  const [showEditSpotModal, setShowEditSpotModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [spotsLoading, setSpotsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [spotsError, setSpotsError] = useState(null)

  // Fetch user's servers and spots on component mount
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axios.get('/api/servers')
        setServers(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching servers:', err)
        setError('Failed to load servers')
        setLoading(false)
      }
    }

    const fetchSpots = async () => {
      try {
        const response = await axios.get('/api/spots')
        setSpots(response.data)
        setSpotsLoading(false)
      } catch (err) {
        console.error('Error fetching spots:', err)
        setSpotsError('Failed to load spots')
        setSpotsLoading(false)
      }
    }

    fetchServers()
    fetchSpots()
  }, [])

  const handleLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      setIsLoggingOut(false)
    }, 500) // Simulate a slight delay
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewServer(prev => ({ ...prev, [name]: value }))
  }

  const handleAddServer = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/servers', newServer)
      setServers(prev => [...prev, response.data])
      setNewServer({
        name: '',
        ip_address: '',
        latitude: '',
        longitude: '',
        memory: '',
        cpu_cores: '',
        hard_drive_size: ''
      })
      setShowAddServerModal(false)
    } catch (err) {
      console.error('Error adding server:', err)
      setError('Failed to add server')
    }
  }

  const openEditModal = (server) => {
    setEditingServer({...server})
    setShowEditServerModal(true)
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditingServer(prev => ({ ...prev, [name]: value }))
  }

  const handleEditServer = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`/api/servers/${editingServer.id}`, editingServer)
      setServers(prev => prev.map(server => 
        server.id === editingServer.id ? response.data : server
      ))
      setEditingServer(null)
      setShowEditServerModal(false)
    } catch (err) {
      console.error('Error updating server:', err)
      setError('Failed to update server')
    }
  }

  const handleSpotInputChange = (e) => {
    const { name, value } = e.target
    setNewSpot(prev => ({ ...prev, [name]: value }))
  }

  const handleEditSpotInputChange = (e) => {
    const { name, value } = e.target
    
    // If changing the server, we need to update server_name and ip_address
    if (name === 'server_id') {
      const selectedServer = servers.find(server => server.id === parseInt(value) || server.id === value)
      if (selectedServer) {
        setEditingSpot(prev => ({ 
          ...prev, 
          [name]: value,
          server_name: selectedServer.name,
          ip_address: selectedServer.ip_address
        }))
        return
      }
    }
    
    // Handle other field updates normally
    setEditingSpot(prev => ({ ...prev, [name]: value }))
  }

  const openEditSpotModal = (spot) => {
    // Find the server ID based on the server_name if it's not already in the spot object
    let server_id = spot.server_id;
    
    // If server_id isn't already set properly
    if (!server_id || typeof server_id !== 'number') {
      // Try to find the server based on name or IP address
      const matchingServer = servers.find(
        server => server.name === spot.server_name || server.ip_address === spot.ip_address
      );
      
      if (matchingServer) {
        server_id = matchingServer.id;
      }
    }
    
    // Make sure we preserve server_name and ip_address when editing
    setEditingSpot({
      ...spot,
      server_id: server_id,
      // Ensure these properties are preserved for display after update
      server_name: spot.server_name,
      ip_address: spot.ip_address
    })
    setShowEditSpotModal(true)
  }

  const handleAddSpot = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/spots', newSpot)
      setSpots(prev => [...prev, response.data])
      setNewSpot({
        server_id: '',
        memory: '',
        cpu_cores: '',
        hard_drive_size: ''
      })
      setShowAddSpotModal(false)
    } catch (err) {
      console.error('Error adding spot:', err)
      setSpotsError('Failed to add spot')
    }
  }
  
  const handleEditSpot = async (e) => {
    e.preventDefault()
    try {
      // Create a copy of editingSpot to send to the server
      const spotToUpdate = {...editingSpot}
      
      // Store server_name, ip_address, and server_id for the updated spot
      const server_name = editingSpot.server_name
      const ip_address = editingSpot.ip_address
      const server_id = editingSpot.server_id
      
      const response = await axios.put(`/api/spots/${editingSpot.id}`, spotToUpdate)
      
      // Merge the response with stored display values
      const updatedSpot = {
        ...response.data,
        server_name,
        ip_address,
        server_id
      }
      
      setSpots(prev => prev.map(spot => 
        spot.id === editingSpot.id ? updatedSpot : spot
      ))
      setEditingSpot(null)
      setShowEditSpotModal(false)
    } catch (err) {
      console.error('Error updating spot:', err)
      setSpotsError('Failed to update spot')
    }
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
            {/* My Servers Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-medium">My Servers</h2>
                <button 
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setShowAddServerModal(true)}
                >
                  Add New +
                </button>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : error ? (
                  <div className="text-center py-4 text-red-500">{error}</div>
                ) : servers.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No servers added yet</div>
                ) : (
                  <div className="space-y-4">
                    {servers.map(server => (
                      <div
                        key={server.id}
                        className="flex items-start justify-between space-x-3 p-3 hover:bg-gray-50 rounded-md border-b border-gray-100"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-xl mt-1">🖥️</span>
                          <div>
                            <div className="font-medium">{server.name}</div>
                            <div className="text-sm text-gray-600">IP: {server.ip_address}</div>
                            <div className="mt-1 space-y-1">
                              {server.memory && (
                                <div className="text-xs text-gray-500">
                                  <span className="font-medium">Memory:</span> {server.memory}
                                </div>
                              )}
                              {server.cpu_cores && (
                                <div className="text-xs text-gray-500">
                                  <span className="font-medium">CPU:</span> {server.cpu_cores} cores
                                </div>
                              )}
                              {server.hard_drive_size && (
                                <div className="text-xs text-gray-500">
                                  <span className="font-medium">Storage:</span> {server.hard_drive_size}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(server);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-xs text-gray-600 hover:text-gray-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/my-server/${server.id}`;
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Add Server Modal */}
            {showAddServerModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Add New Server</h3>
                    <button 
                      onClick={() => setShowAddServerModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleAddServer}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Server Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newServer.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IP Address
                        </label>
                        <input
                          type="text"
                          name="ip_address"
                          value={newServer.ip_address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Latitude
                          </label>
                          <input
                            type="text"
                            name="latitude"
                            value={newServer.latitude}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Longitude
                          </label>
                          <input
                            type="text"
                            name="longitude"
                            value={newServer.longitude}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Memory
                        </label>
                        <input
                          type="text"
                          name="memory"
                          value={newServer.memory}
                          onChange={handleInputChange}
                          placeholder="e.g. 8GB"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CPU Cores
                        </label>
                        <input
                          type="number"
                          name="cpu_cores"
                          value={newServer.cpu_cores}
                          onChange={handleInputChange}
                          placeholder="e.g. 4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hard Drive Size
                        </label>
                        <input
                          type="text"
                          name="hard_drive_size"
                          value={newServer.hard_drive_size}
                          onChange={handleInputChange}
                          placeholder="e.g. 256GB"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddServerModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add Server
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Server Modal */}
            {showEditServerModal && editingServer && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Edit Server</h3>
                    <button 
                      onClick={() => {
                        setShowEditServerModal(false);
                        setEditingServer(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleEditServer}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Server Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editingServer.name}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IP Address
                        </label>
                        <input
                          type="text"
                          name="ip_address"
                          value={editingServer.ip_address}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Latitude
                          </label>
                          <input
                            type="text"
                            name="latitude"
                            value={editingServer.latitude || ''}
                            onChange={handleEditInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Longitude
                          </label>
                          <input
                            type="text"
                            name="longitude"
                            value={editingServer.longitude || ''}
                            onChange={handleEditInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Memory
                        </label>
                        <input
                          type="text"
                          name="memory"
                          value={editingServer.memory || ''}
                          onChange={handleEditInputChange}
                          placeholder="e.g. 8GB"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CPU Cores
                        </label>
                        <input
                          type="number"
                          name="cpu_cores"
                          value={editingServer.cpu_cores || ''}
                          onChange={handleEditInputChange}
                          placeholder="e.g. 4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hard Drive Size
                        </label>
                        <input
                          type="text"
                          name="hard_drive_size"
                          value={editingServer.hard_drive_size || ''}
                          onChange={handleEditInputChange}
                          placeholder="e.g. 256GB"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditServerModal(false);
                          setEditingServer(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add Spot Modal */}
            {showAddSpotModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Add New Spot</h3>
                    <button 
                      onClick={() => setShowAddSpotModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleAddSpot}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Server
                        </label>
                        <select
                          name="server_id"
                          value={newSpot.server_id}
                          onChange={handleSpotInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select a server...</option>
                          {servers.map(server => (
                            <option key={server.id} value={server.id}>
                              {server.name} ({server.ip_address})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Memory
                        </label>
                        <input
                          type="text"
                          name="memory"
                          value={newSpot.memory}
                          onChange={handleSpotInputChange}
                          placeholder="e.g. 8GB"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CPU Cores
                        </label>
                        <input
                          type="number"
                          name="cpu_cores"
                          value={newSpot.cpu_cores}
                          onChange={handleSpotInputChange}
                          placeholder="e.g. 4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hard Drive Size
                        </label>
                        <input
                          type="text"
                          name="hard_drive_size"
                          value={newSpot.hard_drive_size}
                          onChange={handleSpotInputChange}
                          placeholder="e.g. 256GB"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddSpotModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add Spot
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Spot Modal */}
            {showEditSpotModal && editingSpot && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Edit Spot</h3>
                    <button 
                      onClick={() => {
                        setShowEditSpotModal(false);
                        setEditingSpot(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleEditSpot}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Server
                        </label>
                        <select
                          name="server_id"
                          value={editingSpot.server_id}
                          onChange={handleEditSpotInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select a server...</option>
                          {servers.map(server => (
                            <option key={server.id} value={server.id}>
                              {server.name} ({server.ip_address})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Memory
                        </label>
                        <input
                          type="text"
                          name="memory"
                          value={editingSpot.memory || ''}
                          onChange={handleEditSpotInputChange}
                          placeholder="e.g. 8GB"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CPU Cores
                        </label>
                        <input
                          type="number"
                          name="cpu_cores"
                          value={editingSpot.cpu_cores || ''}
                          onChange={handleEditSpotInputChange}
                          placeholder="e.g. 4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hard Drive Size
                        </label>
                        <input
                          type="text"
                          name="hard_drive_size"
                          value={editingSpot.hard_drive_size || ''}
                          onChange={handleEditSpotInputChange}
                          placeholder="e.g. 256GB"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditSpotModal(false);
                          setEditingSpot(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* My Spots Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-medium">My Spots</h2>
                <button 
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setShowAddSpotModal(true)}
                >
                  Add New +
                </button>
              </div>
              <div className="p-6">
                {spotsLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : spotsError ? (
                  <div className="text-center py-4 text-red-500">{spotsError}</div>
                ) : spots.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No spots added yet</div>
                ) : (
                  <div className="space-y-4">
                    {spots.map(spot => (
                      <div
                        key={spot.id}
                        className="flex items-start justify-between space-x-3 p-3 hover:bg-gray-50 rounded-md border-b border-gray-100"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-xl mt-1">☁️</span>
                          <div>
                            <div className="font-medium">{spot.server_name}</div>
                            <div className="text-sm text-gray-600">IP: {spot.ip_address}</div>
                            <div className="mt-1 space-y-1">
                              {spot.memory && (
                                <div className="text-xs text-gray-500">
                                  <span className="font-medium">Memory:</span> {spot.memory}
                                </div>
                              )}
                              {spot.cpu_cores && (
                                <div className="text-xs text-gray-500">
                                  <span className="font-medium">CPU:</span> {spot.cpu_cores} cores
                                </div>
                              )}
                              {spot.hard_drive_size && (
                                <div className="text-xs text-gray-500">
                                  <span className="font-medium">Storage:</span> {spot.hard_drive_size}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditSpotModal(spot);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-xs text-gray-600 hover:text-gray-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/spot/${spot.id}`;
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* CloudWatch Metrics */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-medium">My Shells</h2>
              </div>
              <div className="p-6 flex justify-center items-center h-48">
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-2">☯️</div>
                  <div>8GB RAM at 45.11.123.44</div>
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
