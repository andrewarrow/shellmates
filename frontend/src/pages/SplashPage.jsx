import { Link } from 'react-router-dom'

function SplashPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary-50 to-primary-100">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">Welcome to Traffic</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your simulator for AI agents on cloud providers
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-10">
            <Link 
              to="/login" 
              className="px-8 py-3 text-lg font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-3 text-lg font-medium rounded-md bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
        
        <div className="bg-primary-700 text-white p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">AWS</h3>
              <p>Same API calls as real AWS</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Google Cloud</h3>
              <p>Same API calls as real GCP</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Other</h3>
              <p>Same API calls as other clouds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplashPage
