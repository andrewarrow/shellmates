import IceBreaker from '../components/IceBreaker'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

function IceBreakerPage() {
  // Ensure page scrolls to top when this component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
    // Also use the direct DOM methods as a fallback
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="sticky top-0 z-10 bg-gray-900 bg-opacity-95 backdrop-blur-sm shadow-md">
        <div className="flex justify-between items-center p-4">
          <Link to="/" className="text-xl font-bold text-primary-300">
            shellmates
          </Link>
          <div className="flex gap-4">
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:from-blue-600 hover:to-teal-500 shadow-md transition-all"
            >
              Register
            </Link>
          </div>
        </div>
        
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-primary-300">Technical Co-Founder Icebreaker</h1>
          <p className="text-gray-300 text-sm">Answer 9 questions to find your perfect technical match</p>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto mb-12">
          <IceBreaker />
        </div>
      </div>
      
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}

export default IceBreakerPage