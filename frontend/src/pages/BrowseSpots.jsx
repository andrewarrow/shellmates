import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

function BrowseSpots() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Browse Available Spots</h1>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <p className="dark:text-gray-200 mb-4">
            Our community members offer various VM spots with different configurations to suit your needs.
            These spots are perfect for development, testing, or running small production workloads.
          </p>
        </div>
        
        <h2 className="text-xl font-semibold mb-6 dark:text-white">Available Spots from Our Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/spots/c8f3c470-f353-4804-bd5c-a5c30bba7dbb" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
            <div className="w-20 h-20 rounded-full bg-blue-300 mb-3 overflow-hidden">
              <img src="https://avatars.githubusercontent.com/u/127054?v=4" alt="Andrew A." className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold dark:text-white">Andrew A. offers:</h3>
            <p className="text-center dark:text-gray-300">32GB RAM, 2 cores, 200GB SSD</p>
            <p className="text-blue-600 dark:text-blue-400 mt-1">$18.07/month USD - Germany</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              View Details
            </button>
          </Link>
          
          <Link to="/spots" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
            <div className="w-20 h-20 rounded-full bg-blue-300 mb-3 overflow-hidden">
              <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="David T." className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold dark:text-white">David T. offers:</h3>
            <p className="text-center dark:text-gray-300">16GB RAM, 4 cores, 128GB HDD</p>
            <p className="text-blue-600 dark:text-blue-400 mt-1">$22/month - San Francisco</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              View Details
            </button>
          </Link>
          
          <Link to="/spots" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
            <div className="w-20 h-20 rounded-full bg-blue-300 mb-3 overflow-hidden">
              <img src="https://randomuser.me/api/portraits/women/36.jpg" alt="Mia L." className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold dark:text-white">Mia L. offers:</h3>
            <p className="text-center dark:text-gray-300">8GB RAM, 1 core, 64GB SSD</p>
            <p className="text-blue-600 dark:text-blue-400 mt-1">$8/month - Tokyo</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              View Details
            </button>
          </Link>
        </div>
        
        <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Want to offer your own spots?</h2>
          <p className="dark:text-gray-300 mb-4">
            If you have a bare metal server with extra resources, you can split it into VMs and rent them out to other developers.
          </p>
          <Link to="/dashboard" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default BrowseSpots