import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/Layout'
import AccountEditModal from '../components/AccountEditModal'
import SSHKeyModal from '../components/SSHKeyModal'
import axios from 'axios'

function Dashboard() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showServiceMenu, setShowServiceMenu] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')
  const [sideMenuActive, setSideMenuActive] = useState('')
  const [showAddServerModal, setShowAddServerModal] = useState(false)
  const [showEditServerModal, setShowEditServerModal] = useState(false)
  // Add Spot modal is now on SingleServer page
  const [showStripeModal, setShowStripeModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showSSHKeyModal, setShowSSHKeyModal] = useState(false)
  const [servers, setServers] = useState([])
  const [spots, setSpots] = useState([])
  const [stripeSettings, setStripeSettings] = useState({
    sk_key: '',
    pk_key: '',
    buy_url: ''
  })
  const [newServer, setNewServer] = useState({
    name: '',
    ip_address: '',
    latitude: '',
    longitude: '',
    memory: '',
    cpu_cores: '',
    hard_drive_size: ''
  })
  // newSpot state moved to SingleServer component
  const [editingServer, setEditingServer] = useState(null)
  const [editingSpot, setEditingSpot] = useState(null)
  const [showEditSpotModal, setShowEditSpotModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [spotsLoading, setSpotsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [spotsError, setSpotsError] = useState(null)

  // Fetch user's servers, spots, and stripe settings on component mount
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
        // Fetch spots rented by current user
        const response = await axios.get('/api/spots/rented')
        setSpots(response.data)
        setSpotsLoading(false)
      } catch (err) {
        console.error('Error fetching spots:', err)
        setSpotsError('Failed to load spots')
        setSpotsLoading(false)
      }
    }

    const fetchStripeSettings = async () => {
      try {
        const response = await axios.get('/api/stripe')
        if (response.data && !response.data.message) {
          setStripeSettings({
            sk_key: response.data.sk_key || '',
            pk_key: response.data.pk_key || '',
            buy_url: response.data.buy_url || ''
          })
        }
      } catch (err) {
        console.error('Error fetching stripe settings:', err)
      }
    }

    fetchServers()
    fetchSpots()
    fetchStripeSettings()
  }, [])
  
  // This effect is no longer needed as the Add Spot modal is moved to SingleServer page

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

  const handleDeleteServer = async (serverId) => {
    if (!confirm('Are you sure you want to delete this server? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`/api/servers/${serverId}`)
      setServers(prev => prev.filter(server => server.id !== serverId))
      setEditingServer(null)
      setShowEditServerModal(false)
    } catch (err) {
      console.error('Error deleting server:', err)
      setError('Failed to delete server')
    }
  }

  // handleSpotInputChange moved to SingleServer component

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

  // handleAddSpot moved to SingleServer component
  
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

  const handleDeleteSpot = async (spotId) => {
    if (!confirm('Are you sure you want to delete this spot? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`/api/spots/${spotId}`)
      setSpots(prev => prev.filter(spot => spot.id !== spotId))
      setEditingSpot(null)
      setShowEditSpotModal(false)
    } catch (err) {
      console.error('Error deleting spot:', err)
      setSpotsError('Failed to delete spot')
    }
  }

  const handleStripeInputChange = (e) => {
    const { name, value } = e.target
    setStripeSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveStripeSettings = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/stripe', stripeSettings)
      setStripeSettings(response.data)
      setShowStripeModal(false)
    } catch (err) {
      console.error('Error saving stripe settings:', err)
      alert('Failed to save Stripe settings')
    }
  }

  const handleDeleteStripeSettings = async () => {
    if (!confirm('Are you sure you want to delete your Stripe settings? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete('/api/stripe')
      setStripeSettings({ sk_key: '', pk_key: '' })
      setShowStripeModal(false)
    } catch (err) {
      console.error('Error deleting stripe settings:', err)
      alert('Failed to delete Stripe settings')
    }
  }

  return (
    <Layout hideNavLink>
      {/* Top Navigation Bar */}
      <header className="bg-gray-900 text-white">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left Side - Logo & Service Menu */}
          <div className="flex items-center space-x-6">
            <div className="text-xl font-bold"><a href="/">shellmates</a></div>
          </div>
            
          {/* Right Side - Search, Region, User Menu */}
          <div className="flex items-center space-x-4">
            
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
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg rounded-md z-10">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-bold dark:text-white">{currentUser?.username || 'User'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">user-id</div>
                  </div>
                  <div className="py-1">
                    <div 
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setShowAccountModal(true);
                        setShowUserMenu(false);
                      }}
                    >
                      Account
                    </div>
                    <div 
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setShowSSHKeyModal(true);
                        setShowUserMenu(false);
                      }}
                    >
                      SSH Key
                    </div>
                    <div 
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setShowStripeModal(true);
                        setShowUserMenu(false);
                      }}
                    >
                      Stripe Settings
                    </div>
                    <div 
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <h2 className="font-medium dark:text-white">My Servers</h2>
                <button 
                  className="text-sm text-blue-300 hover:underline"
                  onClick={() => setShowAddServerModal(true)}
                >
                  Add New +
                </button>
              </div>
              <div className="p-6 dark:text-gray-200">
                {loading ? (
                  <div className="text-center py-4 dark:text-gray-300">Loading...</div>
                ) : error ? (
                  <div className="text-center py-4 text-red-500">{error}</div>
                ) : servers.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">No servers added yet</div>
                ) : (
                  <div className="space-y-4">
                    {servers.map(server => (
                      <div
                        key={server.id}
                        className="flex items-start justify-between space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border-b border-gray-100 dark:border-gray-700 cursor-pointer"
                        onClick={() => {
                          navigate(`/server/${server.id}`);
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-xl mt-1">🖥️</span>
                          <div>
                            <div className="font-medium dark:text-white">{server.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">IP: {server.ip_address}</div>
                            <div className="mt-1 space-y-1">
                              {server.memory && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  <span className="font-medium">Memory:</span> {server.memory}
                                </div>
                              )}
                              {server.cpu_cores && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  <span className="font-medium">CPU:</span> {server.cpu_cores} cores
                                </div>
                              )}
                              {server.hard_drive_size && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  <span className="font-medium">Storage:</span> {server.hard_drive_size}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(server);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/server/${server.id}`);
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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium dark:text-white">Add New Server</h3>
                    <button 
                      onClick={() => setShowAddServerModal(false)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleAddServer}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Server Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newServer.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          IP Address
                        </label>
                        <input
                          type="text"
                          name="ip_address"
                          value={newServer.ip_address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Latitude
                          </label>
                          <input
                            type="text"
                            name="latitude"
                            value={newServer.latitude}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Longitude
                          </label>
                          <input
                            type="text"
                            name="longitude"
                            value={newServer.longitude}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Memory
                        </label>
                        <input
                          type="text"
                          name="memory"
                          value={newServer.memory}
                          onChange={handleInputChange}
                          placeholder="e.g. 8GB"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CPU Cores
                        </label>
                        <input
                          type="number"
                          name="cpu_cores"
                          value={newServer.cpu_cores}
                          onChange={handleInputChange}
                          placeholder="e.g. 4"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hard Drive Size
                        </label>
                        <input
                          type="text"
                          name="hard_drive_size"
                          value={newServer.hard_drive_size}
                          onChange={handleInputChange}
                          placeholder="e.g. 256GB"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddServerModal(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Edit Server</h3>
                    <button 
                      onClick={() => {
                        setShowEditServerModal(false);
                        setEditingServer(null);
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleEditServer}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Server Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editingServer.name}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          IP Address
                        </label>
                        <input
                          type="text"
                          name="ip_address"
                          value={editingServer.ip_address}
                          onChange={handleEditInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Latitude
                          </label>
                          <input
                            type="text"
                            name="latitude"
                            value={editingServer.latitude || ''}
                            onChange={handleEditInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Longitude
                          </label>
                          <input
                            type="text"
                            name="longitude"
                            value={editingServer.longitude || ''}
                            onChange={handleEditInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Memory
                        </label>
                        <input
                          type="text"
                          name="memory"
                          value={editingServer.memory || ''}
                          onChange={handleEditInputChange}
                          placeholder="e.g. 8GB"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CPU Cores
                        </label>
                        <input
                          type="number"
                          name="cpu_cores"
                          value={editingServer.cpu_cores || ''}
                          onChange={handleEditInputChange}
                          placeholder="e.g. 4"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hard Drive Size
                        </label>
                        <input
                          type="text"
                          name="hard_drive_size"
                          value={editingServer.hard_drive_size || ''}
                          onChange={handleEditInputChange}
                          placeholder="e.g. 256GB"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={() => handleDeleteServer(editingServer.id)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                      >
                        Delete Server
                      </button>
                      
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowEditServerModal(false);
                            setEditingServer(null);
                          }}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add Spot Modal removed - now in SingleServer component */}

            {/* Stripe Settings Modal */}
            {showStripeModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium dark:text-white">Stripe Settings</h3>
                    <button 
                      onClick={() => setShowStripeModal(false)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleSaveStripeSettings}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Stripe Secret Key (sk_)
                        </label>
                        <input
                          type="text"
                          name="sk_key"
                          value={stripeSettings.sk_key}
                          onChange={handleStripeInputChange}
                          placeholder="sk_test_123..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          This key is used to interact with the Stripe API and process payments.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Stripe Publishable Key (pk_)
                        </label>
                        <input
                          type="text"
                          name="pk_key"
                          value={stripeSettings.pk_key}
                          onChange={handleStripeInputChange}
                          placeholder="pk_test_123..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          This key is used to initialize Stripe elements on your website.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Buy URL
                        </label>
                        <input
                          type="text"
                          name="buy_url"
                          value={stripeSettings.buy_url}
                          onChange={handleStripeInputChange}
                          placeholder="https://buy.stripe.com/your-product-page"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          URL for customers to purchase your product directly from Stripe.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      {stripeSettings.sk_key || stripeSettings.pk_key ? (
                        <button
                          type="button"
                          onClick={handleDeleteStripeSettings}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                          Delete Settings
                        </button>
                      ) : (
                        <div></div>
                      )}
                      
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowStripeModal(false)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Save Settings
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Edit Spot Modal */}
            {showEditSpotModal && editingSpot && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Edit Spot</h3>
                    <button 
                      onClick={() => {
                        setShowEditSpotModal(false);
                        setEditingSpot(null);
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleEditSpot}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Select Server
                        </label>
                        <select
                          name="server_id"
                          value={editingSpot.server_id}
                          onChange={handleEditSpotInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Memory
                        </label>
                        <input
                          type="text"
                          name="memory"
                          value={editingSpot.memory || ''}
                          onChange={handleEditSpotInputChange}
                          placeholder="e.g. 8GB"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CPU Cores
                        </label>
                        <input
                          type="number"
                          name="cpu_cores"
                          value={editingSpot.cpu_cores || ''}
                          onChange={handleEditSpotInputChange}
                          placeholder="e.g. 4"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hard Drive Size
                        </label>
                        <input
                          type="text"
                          name="hard_drive_size"
                          value={editingSpot.hard_drive_size || ''}
                          onChange={handleEditSpotInputChange}
                          placeholder="e.g. 256GB"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={() => handleDeleteSpot(editingSpot.id)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                      >
                        Delete Spot
                      </button>
                      
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowEditSpotModal(false);
                            setEditingSpot(null);
                          }}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* My Spots Card */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <h2 className="font-medium dark:text-white">My Rented Spots</h2>
                <Link to="/browse-spots" className="text-sm text-blue-300 hover:underline">
                  Browse Spots
                </Link>
              </div>
              <div className="p-6 dark:text-gray-200">
                {spotsLoading ? (
                  <div className="text-center py-4 dark:text-gray-300">Loading...</div>
                ) : spotsError ? (
                  <div className="text-center py-4 text-red-500">{spotsError}</div>
                ) : spots.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">No spots rented yet</div>
                ) : (
                  <div className="space-y-4">
                    {spots.map(spot => (
                      <div
                        key={spot.id}
                        className="flex items-start justify-between space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border-b border-gray-100 dark:border-gray-700 cursor-pointer"
                        onClick={() => navigate(`/rented-spot/${spot.guid}`)}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-xl mt-1">☁️</span>
                          <div>
                            <div className="font-medium dark:text-white">{spot.server_name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">IP: {spot.ip_address}</div>
                            <div className="mt-1 space-y-1">
                              {spot.memory && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  <span className="font-medium">Memory:</span> {spot.memory}
                                </div>
                              )}
                              {spot.cpu_cores && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  <span className="font-medium">CPU:</span> {spot.cpu_cores} cores
                                </div>
                              )}
                              {spot.hard_drive_size && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  <span className="font-medium">Storage:</span> {spot.hard_drive_size}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/rented-spot/${spot.guid}`);
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
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="font-medium dark:text-white">Getting Started</h2>
              </div>
              <div className="p-6 flex justify-center items-center h-48 dark:text-gray-300">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div>Do you want to rent the server and be the sysop?&nbsp;
    <a href="https://www.hetzner.com/?ref=shellmates" class="text-sm text-blue-300 hover:underline">Hetzner</a> <a href="https://www.ovhcloud.com/?ref=shellmates" class="text-sm text-blue-300 hover:underline">OVH</a> <a href="https://www.liquidweb.com/?ref=shellmates" class="text-sm text-blue-300 hover:underline">Liquid Web</a>

    </div>
                  <div className="text-3xl mb-2">☯️</div>
                  <div>Or do you want to rent just a VM spot and be the tenant.&nbsp;
                  <Link to="/browse-spots" className="text-sm text-blue-300 hover:underline">
                    Browse Spots
                  </Link>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>

      {/* Account Edit Modal */}
      <AccountEditModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)} 
      />
      
      {/* SSH Key Modal */}
      <SSHKeyModal
        isOpen={showSSHKeyModal}
        onClose={() => setShowSSHKeyModal(false)}
      />
    </Layout>
  )
}

export default Dashboard
