import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/Layout'
import axios from 'axios'

function Spot() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [spot, setSpot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await axios.get(`/api/spots/${id}`)
        setSpot(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching spot:', err)
        setError('Failed to load spot details')
        setLoading(false)
      }
    }

    fetchSpot()
  }, [id])

  const handleBack = () => {
    navigate(-1) // Go back to previous page
  }

  return (
    <Layout hideNavLink>
      {/* Top Navigation Bar */}
      <header className="bg-gray-900 text-white">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left Side - Logo */}
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
          <button className="hover:underline" onClick={handleBack}>Back</button>
          <span>/</span>
          <span>Spot Details</span>
        </div>
      </div>

      <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center dark:text-gray-200">
                <div className="animate-pulse">Loading spot details...</div>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center text-red-500">
                {error}
                <div className="mt-4">
                  <button 
                    onClick={handleBack}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            ) : spot ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Spot Details {spot.id && `#${spot.id}`}</h1>
                  <button 
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white"
                  >
                    Go Back
                  </button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                  <div className="p-6 dark:text-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h2 className="text-lg font-medium mb-4 dark:text-white">Spot Information</h2>
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">Owner:</span>
                            <span className="ml-2">{spot.owner_name || "Andrew A."}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">Location:</span>
                            <span className="ml-2">{spot.location || "Germany"}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">Price:</span>
                            <span className="ml-2">${spot.price || "18.07"}/month</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h2 className="text-lg font-medium mb-4 dark:text-white">Hardware Specifications</h2>
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">Memory:</span>
                            <span className="ml-2">{spot.memory || "32GB RAM"}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">CPU Cores:</span>
                            <span className="ml-2">{spot.cpu_cores || "2"} cores</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">Storage:</span>
                            <span className="ml-2">{spot.hard_drive_size || "200GB SSD"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h2 className="text-lg font-medium mb-4 dark:text-white">About This Spot</h2>
                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                        <p>
                          {spot.description || "This spot is hosted on a powerful dedicated server in Germany. It offers excellent performance with 32GB of RAM, 2 CPU cores, and 200GB of SSD storage. Perfect for running applications, databases, or development environments."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h2 className="text-lg font-medium mb-4 dark:text-white">Owner Profile</h2>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-primary-300 overflow-hidden">
                          <img 
                            src={spot.owner_avatar || "https://avatars.githubusercontent.com/u/127054?v=4"} 
                            alt={spot.owner_name || "Andrew A."} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{spot.owner_name || "Andrew A."}</h3>
                          <p className="text-gray-600 dark:text-gray-400">Member since {spot.member_since || "January 2025"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h2 className="text-lg font-medium mb-4 dark:text-white">Actions</h2>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          Contact Owner
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                          Rent This Spot
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center dark:text-gray-200">
                <div className="text-lg dark:text-white">Spot not found</div>
                <div className="mt-4">
                  <button 
                    onClick={handleBack}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
    </Layout>
  )
}

export default Spot
