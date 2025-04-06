import { Link } from 'react-router-dom'

function SplashPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-primary-300">
          shellmates
        </Link>
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
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="max-w-5xl w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-300 mb-4">shellmates!</h1>
            <p className="text-xl text-gray-300 mb-4">
              Rent bare metal servers and create your own micro-cloud with friends.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              Split costs, maximize resources, and build a community of developers.
            </p>
            
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-gray-700 rounded-lg p-6 text-left">
                <h2 className="text-2xl font-semibold text-primary-300 mb-4">How shellmates Works</h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">1.</span>
                    <span>Rent a powerful bare metal server from providers like Hetzner or OVH at prices starting from $34.50/month</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">2.</span>
                    <span>We help you setup Firecracker VMs to divide your server into smaller VMs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">3.</span>
                    <span>Keep what you need and rent out the rest to other developers at fair prices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">4.</span>
                    <span>Save up to 90% compared to cloud providers like AWS while building relationships with other developers</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-300 mb-4">Why Choose shellmates?</h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-gray-700 rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold text-primary-400 mb-2">Cost Efficiency</h3>
                  <p className="text-gray-300">Split a $34.50 server into two $17.25 VMs or make a profit renting them at $25 each</p>
                </div>
                <div className="bg-gray-700 rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold text-primary-400 mb-2">Community</h3>
                  <p className="text-gray-300">Connect with other developers who share your server - put faces to IPs</p>
                </div>
                <div className="bg-gray-700 rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold text-primary-400 mb-2">Flexibility</h3>
                  <p className="text-gray-300">Be a landlord, tenant, or both - create the perfect VM for your needs</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
              <Link 
                to="/login" 
                className="px-8 py-3 text-lg font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="px-8 py-3 text-lg font-medium rounded-md bg-gray-700 text-primary-300 border border-primary-600 hover:bg-gray-600 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
          
          <div className="bg-primary-700 text-white p-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Bare Metal Servers You Can Split</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-primary-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2"><a className="link hover:underline" href="https://hetzner.cloud/?ref=rROuQ1YPYg9q">Hetzner</a></h3>
                <p>64 GB RAM, Intel Core i7-6700, 2x SSD 512 GB for $34.50</p>
                <p className="mt-2 text-primary-200">Split into 2 VMs with 32GB RAM each</p>
              </div>
              <div className="text-center bg-primary-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2"><a className="link hover:underline" href="https://us.ovhcloud.com/bare-metal/rise/">OVH Rise</a></h3>
                <p>32 GB RAM, Intel Xeon-E 2386G - 6c/12t - 3.5GHz/4.7GHz, 2x 4TB HDD for $66.50</p>
                <p className="mt-2 text-primary-200">Split into 3 VMs with 10GB RAM each</p>
              </div>
              <div className="text-center bg-primary-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2"><a className="link hover:underline" href="https://www.liquidweb.com/dedicated-server-hosting/bare-metal/">LiquidWeb</a></h3>
                <p>16 GB memory, Intel E-2134 4 core @ 3.5 GHz, 2×480 GB SSD for $44.00</p>
                <p className="mt-2 text-primary-200">Split into 2 VMs with 8GB RAM each</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-center mb-6">Available Spots from Our Community</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-primary-800 rounded-lg p-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary-300 mb-3 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/12.jpg" alt="Sarah K." className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold">Sarah K. offers:</h3>
                <p className="text-center">16GB RAM, 2 cores, 128GB SSD</p>
                <p className="text-primary-300 mt-1">$15/month - Berlin</p>
              </div>
              <div className="bg-primary-800 rounded-lg p-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary-300 mb-3 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="David T." className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold">David T. offers:</h3>
                <p className="text-center">32GB RAM, 4 cores, 256GB SSD</p>
                <p className="text-primary-300 mt-1">$22/month - San Francisco</p>
              </div>
              <div className="bg-primary-800 rounded-lg p-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary-300 mb-3 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/36.jpg" alt="Mia L." className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold">Mia L. offers:</h3>
                <p className="text-center">8GB RAM, 1 core, 64GB SSD</p>
                <p className="text-primary-300 mt-1">$8/month - Tokyo</p>
              </div>
            </div>
            
            <div className="bg-gray-800 text-white p-8 mt-12 rounded-lg">
              <h2 className="text-2xl font-semibold text-center mb-6">Technical Details</h2>
              <div className="max-w-4xl mx-auto text-gray-300">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-300 mb-2">Firecracker Technology</h3>
                  <p className="mb-3">
                    Our platform runs on <a href="https://firecracker-microvm.github.io/" className="text-primary-400 hover:underline">Firecracker</a>, an open-source virtualization technology developed by AWS for serverless computing. Firecracker enables us to create lightweight micro-VMs that boot in under 125ms and have a minimal memory footprint.
                  </p>
                  <p>
                    Firecracker VMs provide strong isolation with a reduced attack surface compared to traditional VMs, while maintaining excellent performance characteristics that approach bare metal speeds.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-300 mb-2">Security Architecture</h3>
                  <p className="mb-3">
                    We employ Firecracker's built-in jailer component, which leverages Linux namespaces, cgroups, and seccomp-bpf to create an additional security boundary. The jailer runs each VM with minimum privileges in a chroot environment, providing defense-in-depth against potential vulnerabilities.
                  </p>
                  <p>
                    This multi-layered security approach means your workloads run in isolation from both the host system and other VMs, protecting your data and applications from potential noisy neighbor issues or security breaches.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-300 mb-2">Operating System Environment</h3>
                  <p className="mb-3">
                    Our host systems run <span className="font-semibold">Rocky Linux 9</span>, an enterprise-grade, community-driven Linux distribution that provides long-term stability and security updates. Rocky Linux is binary-compatible with Red Hat Enterprise Linux, offering enterprise-level reliability.
                  </p>
                  <p>
                    Guest VMs run <span className="font-semibold">Ubuntu 24.04 LTS</span>, providing a familiar, modern environment with long-term support. This combination gives you the security of an enterprise-grade host OS with the flexibility and wide software compatibility of Ubuntu for your applications.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-primary-300 mb-2">Resource Allocation</h3>
                  <p className="mb-3">
                    Each VM is allocated dedicated CPU cores, memory, and storage resources with guaranteed performance. Unlike traditional cloud providers that often oversubscribe resources, your allocated resources are yours alone, with no hidden throttling or noisy neighbor effects.
                  </p>
                  <p>
                    Network virtualization ensures your VM gets fair bandwidth allocation while maintaining isolation from other tenants' network traffic for both security and performance reasons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-900 py-12 mt-16">
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
              <a href="/terms" className="text-gray-400 hover:text-primary-300">Terms</a>
              <a href="/privacy" className="text-gray-400 hover:text-primary-300">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplashPage
