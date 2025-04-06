import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/Layout'
import ContactModal from '../components/ContactModal'
import axios from 'axios'

function RentedSpot() {
  const { guid } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const [spot, setSpot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  
  // Helper function to ensure we have an email
  const getOwnerEmail = () => {
    if (!spot) return 'andrew@example.com';
    return spot.email || 'andrew@example.com';
  }

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await axios.get(`/api/spots/rented/${guid}`)
        
        // Ensure we have an email
        if (!response.data.email) {
          console.log('No email found in response, using default')
          response.data.email = 'andrew@example.com'
        }
        
        // Force a default email if we somehow get undefined
        const spotData = {
          ...response.data,
          email: response.data.email || 'andrew@example.com',
          rented_at: response.data.rented_at || new Date().toISOString()
        };
        
        console.log('Received rented spot data:', spotData)
        setSpot(spotData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching rented spot:', err)
        setError('Failed to load rented spot details')
        setLoading(false)
      }
    }

    fetchSpot()
  }, [guid])

  const handleBack = () => {
    navigate(-1) // Go back to previous page
  }
  
  const handleOpenContactModal = () => {
    setContactModalOpen(true);
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
            {currentUser ? (
              <div className="px-3 py-1 hover:bg-gray-800 rounded-md cursor-pointer">
                {currentUser.username}
              </div>
            ) : (
              <div className="flex gap-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-md bg-gray-700 text-primary-300 hover:bg-gray-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Secondary Navigation - Breadcrumbs */}
      <div className="bg-gray-800 text-white px-4 py-1 flex justify-between text-sm">
        <div className="flex space-x-4">
          <button className="hover:underline" onClick={handleBack}>Back</button>
          <span>/</span>
          <span>Rented Spot Details</span>
        </div>
      </div>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center dark:text-gray-200">
              <div className="animate-pulse">Loading rented spot details...</div>
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
                <h1 className="text-2xl font-bold">Rented Spot Details {spot.id && `#${spot.id}`}</h1>
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
                        <div>
                          <span className="text-gray-600 dark:text-gray-300 font-medium">Status:</span>
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-300 font-medium">Rented Since:</span>
                          <span className="ml-2">{new Date(spot.rented_at || Date.now()).toLocaleDateString()}</span>
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
                        <div>
                          <span className="text-gray-600 dark:text-gray-300 font-medium">IP Address:</span>
                          <span className="ml-2">{spot.ip_address || "192.168.1.1"}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-300 font-medium">SSH Port:</span>
                          <span className="ml-2">{spot.ssh_port || "2201"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h2 className="text-lg font-medium mb-4 dark:text-white">Connection Information</h2>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                      <div className="mb-3">
                        <h3 className="font-medium">SSH Connection Command:</h3>
                        <code className="block mt-1 p-2 bg-gray-800 text-white rounded overflow-x-auto">
                          ssh -p {spot.ssh_port || "2201"} user@{spot.ip_address || "192.168.1.1"}
                        </code>
                      </div>
                      <div>
                        <h3 className="font-medium">Access Credentials:</h3>
                        <p className="mt-1">Your SSH key has been installed on this system. Check your email for additional login information.</p>
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
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={handleOpenContactModal}
                      >
                        Contact Owner
                      </button>
                      <button 
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this spot rental? This action cannot be undone.')) {
                            // TODO: Implement cancellation logic
                            alert('Spot cancellation feature coming soon.');
                          }
                        }}
                      >
                        Cancel Rental
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center dark:text-gray-200">
              <div className="text-lg dark:text-white">Rented spot not found</div>
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

      {/* Contact Modal */}
      {spot && (
        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          email={getOwnerEmail()}
        />
      )}
    </Layout>
  )
}

export default RentedSpot
