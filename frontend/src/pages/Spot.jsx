import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/Layout'
import ContactModal from '../components/ContactModal'
import axios from 'axios'

function Spot() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const [spot, setSpot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  
  // For debugging
  const handleOpenContactModal = () => {
    setContactModalOpen(true);
  }

  // Helper function to ensure we have an email
  const getOwnerEmail = () => {
    if (!spot) return 'andrew@example.com';
    return spot.email || 'andrew@example.com';
  }

  // Parse URL query parameters for payment status messages
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    
    // Check for payment status parameters
    if (searchParams.has('payment')) {
      const status = searchParams.get('payment')
      const message = searchParams.get('message') || ''
      
      // Set payment status state
      setPaymentStatus({
        type: status,
        message: decodeURIComponent(message),
        isError: false
      })
    } 
    else if (searchParams.has('error')) {
      const errorType = searchParams.get('error')
      const message = searchParams.get('message') || 'An error occurred with your payment'
      
      // Set payment error state
      setPaymentStatus({
        type: errorType,
        message: decodeURIComponent(message),
        isError: true
      })
    }
    
    // Clean up the URL by removing the payment parameters
    if (searchParams.has('payment') || searchParams.has('error')) {
      // Use setTimeout to avoid immediate redirect during render
      setTimeout(() => {
        navigate(`/spot/${id}`, { replace: true })
      }, 100)
    }
  }, [location, navigate, id])

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await axios.get(`/api/spots/${id}`)
        
        // Ensure we have an email
        if (!response.data.email) {
          console.log('No email found in response, using default')
          response.data.email = 'andrew@example.com'
        }
        
        // Force a default email if we somehow get undefined
        const spotData = {
          ...response.data,
          email: response.data.email || 'andrew@example.com'
        };
        
        setSpot(spotData)
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
                
                {/* Payment Status Alert */}
                {paymentStatus && (
                  <div className={`mb-6 p-4 rounded-md ${
                    paymentStatus.isError 
                      ? 'bg-red-100 border border-red-400 text-red-700' 
                      : paymentStatus.type === 'success'
                        ? 'bg-green-100 border border-green-400 text-green-700'
                        : 'bg-blue-100 border border-blue-400 text-blue-700'
                  }`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {paymentStatus.isError ? (
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        ) : paymentStatus.type === 'success' ? (
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm leading-5 font-medium">
                          {paymentStatus.isError
                            ? 'Payment Error: '
                            : paymentStatus.type === 'success'
                              ? 'Payment Successful: '
                              : paymentStatus.type === 'cancelled'
                                ? 'Payment Cancelled: '
                                : 'Payment Status: '}
                          {paymentStatus.message || (
                            paymentStatus.type === 'success'
                              ? 'Your payment was processed successfully!'
                              : paymentStatus.type === 'cancelled'
                                ? 'Your payment was cancelled.'
                                : paymentStatus.type === 'incomplete'
                                  ? 'Your payment is being processed.'
                                  : 'There was a problem with your payment.'
                          )}
                        </p>
                      </div>
                      <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                          <button 
                            onClick={() => setPaymentStatus(null)} 
                            className={`inline-flex rounded-md p-1.5 ${
                              paymentStatus.isError 
                                ? 'text-red-500 hover:bg-red-200' 
                                : paymentStatus.type === 'success'
                                  ? 'text-green-500 hover:bg-green-200'
                                  : 'text-blue-500 hover:bg-blue-200'
                            } focus:outline-none`}
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
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
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          onClick={handleOpenContactModal}
                        >
                          Contact Owner
                        </button>
                        <button 
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          onClick={async () => {
                            if (!spot.guid) {
                              console.log('Missing guid for spot:', spot);
                              alert('Unable to process payment for this spot');
                              return;
                            }
                            
                            try {
                              // Call our backend first to set up the payment
                              const response = await axios.post('/api/stripe/initiate-payment', {
                                spotGuid: spot.guid
                              });
                              
                              // Redirect to the Stripe checkout page
                              if (response.data.buyUrl) {
                                console.log('Redirecting to payment page:', response.data.buyUrl);
                                window.location.href = response.data.buyUrl;
                              } else {
                                console.error('No buy URL returned from server');
                                alert('Unable to process payment at this time');
                              }
                            } catch (error) {
                              console.error('Error initiating payment:', error);
                              alert(error.response?.data?.message || 'Payment processing failed');
                            }
                          }}
                        >
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

export default Spot
