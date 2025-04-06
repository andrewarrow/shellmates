import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary-300 mb-4">shellmates</h3>
            <p className="text-gray-400">Split costs, build community, save money on your cloud infrastructure.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-300 mb-4">Technologies</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://firecracker-microvm.github.io/" className="hover:text-primary-300 transition-colors">Firecracker</a></li>
              <li><a href="https://rockylinux.org/" className="hover:text-primary-300 transition-colors">Rocky Linux</a></li>
              <li><a href="https://ubuntu.com/" className="hover:text-primary-300 transition-colors">Ubuntu</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-300 mb-4">Providers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://www.hetzner.com/" className="hover:text-primary-300 transition-colors">Hetzner</a></li>
              <li><a href="https://www.ovhcloud.com/" className="hover:text-primary-300 transition-colors">OVH</a></li>
              <li><a href="https://www.liquidweb.com/" className="hover:text-primary-300 transition-colors">Liquid Web</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-300 mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/" className="hover:text-primary-300 transition-colors">AWS Firecracker Blog</a></li>
              <li><a href="https://github.com/firecracker-microvm/firecracker" className="hover:text-primary-300 transition-colors">Firecracker GitHub</a></li>
              <li><a href="https://docs.rockylinux.org/" className="hover:text-primary-300 transition-colors">Rocky Linux Docs</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2025 shellmates. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-400 hover:text-primary-300">Terms</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-primary-300">Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer