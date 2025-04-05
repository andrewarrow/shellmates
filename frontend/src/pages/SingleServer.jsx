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
                          <div 
                            className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              const content = e.currentTarget.nextElementSibling;
                              const caret = e.currentTarget.querySelector('.caret');
                              if (content.style.maxHeight && content.style.maxHeight !== '0px') {
                                // Closing
                                content.style.maxHeight = '0px';
                                caret.style.transform = 'rotate(0deg)';
                              } else {
                                // Opening
                                content.style.maxHeight = content.scrollHeight + 'px';
                                caret.style.transform = 'rotate(90deg)';
                              }
                            }}
                          >
                            <h3 className="font-medium">Step {index + 1}</h3>
                            <span className="caret inline-block transform transition-transform duration-200">▶</span>
                          </div>
                          <div 
                            className="bg-white overflow-hidden transition-all duration-300" 
                            style={{ maxHeight: '0' }}
                          >
                            <div className="p-4">
                              {index === 0 && (
                                <pre>
                                dnf install epel-release -y<br/>
                                dnf install htop tar -y<br/>
                                mkdir fc<br/>
                                cd fc<br/>
                                wget https://github.com/firecracker-microvm/firecracker/releases/download/v1.11.0/firecracker-v1.11.0-x86_64.tgz<br/>
                                gunzip firecracker-v1.11.0-x86_64.tgz<br/>
                                tar -xf firecracker-v1.11.0-x86_64.tar<br/>
                                cd release-v1.11.0-x86_64<br/>
                                </pre>
                              )}
                              {index === 1 && (
                                <pre>
                                cp firecracker-v1.11.0-x86_64 /usr/local/bin/firecracker<br/>
                                cp jailer-v1.11.0-x86_64 /usr/local/bin/jailer<br/>
                                cd ..<br/>
                                {'setfacl -m u:${USER}:rw /dev/kvm<br/>'}
                                {'[ $(stat -c "%G" /dev/kvm) = kvm ] && sudo usermod -aG kvm ${USER} && echo "Access granted."'}<br/>
                                {'[ -r /dev/kvm ] && [ -w /dev/kvm ] && echo "OK" || echo "FAIL"<br/>'}<br/>
                                {'ARCH="$(uname -m)"'}<br/>
                                release_url="https://github.com/firecracker-microvm/firecracker/releases"<br/>
                                {'CI_VERSION=${latest_version%.*}'}<br/>
                                {'latest_kernel_key=$(curl "http://spec.ccfc.min.s3.amazonaws.com/?prefix=firecracker-ci/$CI_VERSION/$ARCH/vmlinux-&list-type=2" | grep -oP "(?<=<Key>)(firecracker-ci/$CI_VERSION/$ARCH/vmlinux-[0-9]+\.[0-9]+\.[0-9]{1,3})(?=</Key>)" | sort -V | tail -1)'}<br/>
                                {'wget "https://s3.amazonaws.com/spec.ccfc.min/${latest_kernel_key}"'}<br/>
                                </pre>
                              )}
                              {index === 2 && (
                                <pre>
                                {'latest_ubuntu_key=$(curl "http://spec.ccfc.min.s3.amazonaws.com/?prefix=firecracker-ci/$CI_VERSION/$ARCH/ubuntu-&list-type=2" | grep -oP "(?<=<Key>)(firecracker-ci/$CI_VERSION/$ARCH/ubuntu-[0-9]+\.[0-9]+\.squashfs)(?=</Key>)" | sort -V | tail -1)'}<br/>
                                {'ubuntu_version=$(basename $latest_ubuntu_key .sqashfs | grep -oE "[0-9]+\.[0-9]+")'}<br/>
                                {'wget -O ubuntu-$ubuntu_version.squashfs.upstream "https://s3.amazonaws.com/spec.ccfc.min/$latest_ubuntu_key"'}<br/>
                                {'unsquashfs ubuntu-$ubuntu_version.squashfs.upstream'}<br/>
                                {'ssh-keygen -f id_rsa -N ""'}<br/>
                                cp -v id_rsa.pub squashfs-root/root/.ssh/authorized_keys<br/>
                                {'mv -v id_rsa ./ubuntu-$ubuntu_version.id_rsa'}<br/>
                                {'sudo chown -R root:root squashfs-root'}<br/>
                                {'truncate -s 200G ubuntu-$ubuntu_version.ext4'}<br/>
                                {'sudo mkfs.ext4 -d squashfs-root -F ubuntu-$ubuntu_version.ext4'}<br/>
                                </pre>
                              )}
                              {index === 3 && (
                                <pre>
                                {'JAIL_ROOT="/srv/jailer/firecracker/hello-fc/root"'}<br/>
                                {'mkdir -p ${JAIL_ROOT}/rootfs'}<br/>
                                {'cp vmlinux-6.1.102 ${JAIL_ROOT}'}<br/>
                                {'cp ubuntu-24.04.ext4 ${JAIL_ROOT}/rootfs'}<br/>
                                {'chown -R fc_user:fc_user ${JAIL_ROOT}/rootfs'}<br/>
                                {'jailer --id hello-fc --uid $(id -u fc_user) --gid $(id -g fc_user) --chroot-base-dir /srv/jailer --exec-file firecracker -- --api-sock /run/api.sock'}<br/>
                                {''}<br/>
                                {''}<br/>
                                {''}<br/>
                                {''}<br/>
                                {''}<br/>
                                </pre>
                              )}
                              {index === 4 && (
                                <p>If this is your first time connecting, you'll see a fingerprint warning. Verify the fingerprint is correct before typing "yes" to continue.</p>
                              )}
                              {index === 5 && (
                                <p>Once connected, update the server packages with <code>sudo apt update && sudo apt upgrade -y</code> (for Ubuntu/Debian) or <code>sudo yum update -y</code> (for CentOS/RHEL).</p>
                              )}
                              {index === 6 && (
                                <p>Set up your environment by installing any required packages. For web servers, you might run <code>sudo apt install nginx</code> or similar commands based on your needs.</p>
                              )}
                              {index === 7 && (
                                <p>Configure the firewall if needed. For example, to allow HTTP/HTTPS traffic: <code>sudo ufw allow http</code> and <code>sudo ufw allow https</code>.</p>
                              )}
                              {index === 8 && (
                                <p>For better security, disable password authentication and root login by editing <code>/etc/ssh/sshd_config</code>. Set PasswordAuthentication and PermitRootLogin to no, then restart SSH with <code>sudo systemctl restart sshd</code>.</p>
                              )}
                            </div>
                          </div>
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
