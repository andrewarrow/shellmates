import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/Layout'
import axios from 'axios'

function SingleServer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [server, setServer] = useState(null)
  const [spots, setSpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [spotsLoading, setSpotsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [spotsError, setSpotsError] = useState(null)
  const [showSpotModal, setShowSpotModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSpotId, setSelectedSpotId] = useState(null)
  const [newSpot, setNewSpot] = useState({
    server_id: id,
    memory: '',
    cpu_cores: '',
    hard_drive_size: ''
  })

  useEffect(() => {
    const fetchServer = async () => {
      try {
        const response = await axios.get(`/api/servers/${id}`)
        setServer(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching server:', err)
        setError('Failed to load server details')
        setLoading(false)
      }
    }

    const fetchSpots = async () => {
      try {
        const response = await axios.get(`/api/spots/server/${id}`)
        setSpots(response.data)
        setSpotsLoading(false)
      } catch (err) {
        console.error('Error fetching spots:', err)
        setSpotsError('Failed to load spots for this server')
        setSpotsLoading(false)
      }
    }

    fetchServer()
    fetchSpots()
    
    // Initialize newSpot with the current server ID
    setNewSpot(prev => ({
      ...prev,
      server_id: id
    }))
  }, [id])

  const handleBack = () => {
    navigate('/dashboard')
  }
  
  const handleSpotInputChange = (e) => {
    const { name, value } = e.target
    setNewSpot(prev => ({ ...prev, [name]: value }))
  }

  const handleOpenAddSpotModal = () => {
    setIsEditing(false)
    setSelectedSpotId(null)
    setNewSpot({
      server_id: id,
      memory: '',
      cpu_cores: '',
      hard_drive_size: ''
    })
    setShowSpotModal(true)
  }

  const handleOpenEditSpotModal = (spot) => {
    setIsEditing(true)
    setSelectedSpotId(spot.id)
    setNewSpot({
      server_id: id,
      memory: spot.memory || '',
      cpu_cores: spot.cpu_cores || '',
      hard_drive_size: spot.hard_drive_size || ''
    })
    setShowSpotModal(true)
  }

  const handleSubmitSpot = async (e) => {
    e.preventDefault()
    try {
      if (isEditing && selectedSpotId) {
        // Update existing spot
        const response = await axios.put(`/api/spots/${selectedSpotId}`, {
          memory: newSpot.memory,
          cpu_cores: newSpot.cpu_cores,
          hard_drive_size: newSpot.hard_drive_size
        })
        
        // Update the spots list with the edited spot
        setSpots(prev => prev.map(spot => 
          spot.id === selectedSpotId ? { ...spot, ...response.data } : spot
        ))
      } else {
        // Create new spot
        const response = await axios.post('/api/spots', newSpot)
        setSpots(prev => [...prev, response.data])
      }
      
      // Reset form and close modal
      setNewSpot({
        server_id: id,
        memory: '',
        cpu_cores: '',
        hard_drive_size: ''
      })
      setShowSpotModal(false)
      setIsEditing(false)
      setSelectedSpotId(null)
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} spot:`, err)
      setSpotsError(`Failed to ${isEditing ? 'update' : 'add'} spot`)
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
          
          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 hover:bg-gray-800 rounded-md cursor-pointer">
              {currentUser?.username || 'User'}
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation - Breadcrumbs */}
      <div className="bg-gray-800 text-white px-4 py-1 flex justify-between text-sm">
        <div className="flex space-x-4">
          <button className="hover:underline" onClick={handleBack}>Dashboard</button>
          <span>/</span>
          <span>Server Details</span>
        </div>
      </div>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center dark:text-gray-200">
              <div className="animate-pulse">Loading server details...</div>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center text-red-500">
              {error}
              <div className="mt-4">
                <button 
                  onClick={handleBack}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : server ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{server.name}</h1>
                <button 
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Back to Dashboard
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="p-6 dark:text-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-lg font-medium mb-4 dark:text-white">Server Information</h2>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 dark:text-gray-300 font-medium">Name:</span>
                          <span className="ml-2">{server.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-300 font-medium">IP Address:</span>
                          <span className="ml-2">{server.ip_address}</span>
                        </div>
                        {(server.latitude && server.longitude) && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">Location:</span>
                            <span className="ml-2">{server.latitude}, {server.longitude}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-medium mb-4 dark:text-white">Hardware Specifications</h2>
                      <div className="space-y-3">
                        {server.memory && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">Memory:</span>
                            <span className="ml-2">{server.memory}</span>
                          </div>
                        )}
                        {server.cpu_cores && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">CPU Cores:</span>
                            <span className="ml-2">{server.cpu_cores}</span>
                          </div>
                        )}
                        {server.hard_drive_size && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">Storage:</span>
                            <span className="ml-2">{server.hard_drive_size}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium dark:text-white">Server Spots</h2>
                      <button 
                        onClick={handleOpenAddSpotModal}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Add Spot +
                      </button>
                    </div>
                    {spotsLoading ? (
                      <div className="p-4 bg-gray-100 rounded-md flex justify-center">
                        <div className="animate-pulse">Loading spots...</div>
                      </div>
                    ) : spotsError ? (
                      <div className="p-4 bg-red-100 text-red-700 rounded-md">
                        {spotsError}
                      </div>
                    ) : spots.length === 0 ? (
                      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md flex items-center">
                        <span className="mr-2">⚠️</span>
                        <span>No spots are currently configured for this server</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {spots.map(spot => (
                          <div
                            key={spot.id}
                            className="p-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-lg mb-2 dark:text-white">Spot #{spot.id}</div>
                                <div className="space-y-1">
                                  {spot.memory && (
                                    <div className="text-sm">
                                      <span className="font-medium">Memory:</span> {spot.memory}
                                    </div>
                                  )}
                                  {spot.cpu_cores && (
                                    <div className="text-sm">
                                      <span className="font-medium">CPU:</span> {spot.cpu_cores} cores
                                    </div>
                                  )}
                                  {spot.hard_drive_size && (
                                    <div className="text-sm">
                                      <span className="font-medium">Storage:</span> {spot.hard_drive_size}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button 
                                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
                                  onClick={() => handleOpenEditSpotModal(spot)}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                                  onClick={() => navigate(`/spot/${spot.id}`)}
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <h2 className="text-lg font-medium mb-4 dark:text-white">SSH Steps</h2>
                  </div>
                  
                  <div className="mt-8">
                    <h2 className="text-lg font-medium mb-4 dark:text-white">Actions</h2>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Edit Server
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        Delete Server
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center dark:text-gray-200">
              <div className="text-lg dark:text-white">Server not found</div>
              <div className="mt-4">
                <button 
                  onClick={handleBack}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Spot Modal (Add/Edit) */}
      {showSpotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{isEditing ? 'Edit Spot' : 'Add New Spot'}</h3>
              <button 
                onClick={() => setShowSpotModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitSpot}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Server
                  </label>
                  <input
                    type="text"
                    value={server ? server.name : ''}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md shadow-sm"
                    disabled
                  />
                  <input type="hidden" name="server_id" value={id} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Memory
                  </label>
                  <input
                    type="text"
                    name="memory"
                    value={newSpot.memory}
                    onChange={handleSpotInputChange}
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
                    value={newSpot.cpu_cores}
                    onChange={handleSpotInputChange}
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
                    value={newSpot.hard_drive_size}
                    onChange={handleSpotInputChange}
                    placeholder="e.g. 256GB"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSpotModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isEditing ? 'Save Changes' : 'Add Spot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default SingleServer
