import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
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
  }, [id])

  const handleBack = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
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
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <div className="animate-pulse">Loading server details...</div>
            </div>
          ) : error ? (
            <div className="bg-white shadow rounded-lg p-6 text-center text-red-500">
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
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Back to Dashboard
                </button>
              </div>
              
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-lg font-medium mb-4">Server Information</h2>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 font-medium">Name:</span>
                          <span className="ml-2">{server.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">IP Address:</span>
                          <span className="ml-2">{server.ip_address}</span>
                        </div>
                        {(server.latitude && server.longitude) && (
                          <div>
                            <span className="text-gray-600 font-medium">Location:</span>
                            <span className="ml-2">{server.latitude}, {server.longitude}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-lg font-medium mb-4">Hardware Specifications</h2>
                      <div className="space-y-3">
                        {server.memory && (
                          <div>
                            <span className="text-gray-600 font-medium">Memory:</span>
                            <span className="ml-2">{server.memory}</span>
                          </div>
                        )}
                        {server.cpu_cores && (
                          <div>
                            <span className="text-gray-600 font-medium">CPU Cores:</span>
                            <span className="ml-2">{server.cpu_cores}</span>
                          </div>
                        )}
                        {server.hard_drive_size && (
                          <div>
                            <span className="text-gray-600 font-medium">Storage:</span>
                            <span className="ml-2">{server.hard_drive_size}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Server Spots</h2>
                      <button 
                        onClick={() => navigate(`/dashboard?showAddSpotModal=true&serverId=${id}`)}
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
                            className="p-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-lg mb-2">Spot #{spot.id}</div>
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
                    <h2 className="text-lg font-medium mb-4">SSH Steps</h2>
                    <div className="space-y-2">
                      {[...Array(9)].map((_, index) => (
                        <div key={index} className="border border-gray-300 rounded-md overflow-hidden">
                          <a 
                            href={`/step${index}.txt`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer hover:bg-gray-200"
                          >
                            <h3 className="font-medium">Step {index + 1}</h3>
                            <span className="text-blue-600">View Instructions</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h2 className="text-lg font-medium mb-4">Actions</h2>
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
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <div className="text-lg">Server not found</div>
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

export default SingleServer
