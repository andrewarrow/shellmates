import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

function SplashPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-primary-300">
          shellmates
        </Link>
        <div>
          <Link 
            to="/icebreaker" 
            className="px-4 py-2 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-lg transform hover:scale-105 transition-all"
          >
            Start Icebreak
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="max-w-5xl w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-300 mb-4">shellmates!</h1>
            <p className="text-xl text-gray-300 mb-4">
              The first date for your next startup - meet your technical co-founder.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              Share a server, build together, and find your perfect technical match.
            </p>
            
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-gray-700 rounded-lg p-6 text-left">
                <h2 className="text-2xl font-semibold text-primary-300 mb-4">How shellmates Works</h2>
                <p className="text-gray-300 mb-3">
                  For teams of two, a single powerful bare metal server is all you need during the early phases. It's cost-effective and handles any load while you focus on building your product.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">1.</span>
                    <span>Rent a powerful bare metal server from providers like Hetzner or OVH - your first project together</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">2.</span>
                    <span>We help you split the server into two VMs - one for each technical co-founder</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">3.</span>
                    <span>Collaborate on server management and build your first project on shared infrastructure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 font-bold mr-2">4.</span>
                    <span>From shellmates to co-founders - launch your startup with someone whose technical skills you already trust</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-300 mb-4">Why Choose shellmates?</h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-gray-700 rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold text-primary-400 mb-2">Technical Match</h3>
                  <p className="text-gray-300">Both partners must be technical - build with someone who speaks your language</p>
                </div>
                <div className="bg-gray-700 rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold text-primary-400 mb-2">Real Collaboration</h3>
                  <p className="text-gray-300">Work on actual code and infrastructure together before committing to a startup</p>
                </div>
                <div className="bg-gray-700 rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold text-primary-400 mb-2">Cost Benefits</h3>
                  <p className="text-gray-300">Cut your server costs in half while finding your perfect co-founder match</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center mt-10 mb-6">
              <h3 className="text-xl text-primary-300 mb-4">Ready to find your perfect technical match?</h3>
              <Link 
                to="/icebreaker" 
                className="px-10 py-4 text-xl font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-xl transform hover:scale-105"
              >
                Start Icebreak
              </Link>
              <div className="mt-4 text-gray-400 text-sm">
                Take our 9-question quiz to find your ideal shellmate
              </div>
            </div>
          </div>
          
          <div className="bg-primary-700 text-white p-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Start Your Co-Founder Journey With These Servers</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-primary-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2"><a className="link hover:underline" href="https://hetzner.com/?ref=shellmates">Hetzner</a></h3>
                <p>64 GB RAM, Intel Core i7-6700, 2x SSD 512 GB for $34.50</p>
                <p className="mt-2 text-primary-200">Split into 2 VMs with 32GB RAM each</p>
              </div>
              <div className="text-center bg-primary-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2"><a className="link hover:underline" href="https://us.ovhcloud.com/bare-metal/rise?ref=shellmates">OVH Rise</a></h3>
                <p>32 GB RAM, Intel Xeon-E 2386G - 6c/12t - 3.5GHz/4.7GHz, 2x 4TB HDD for $66.50</p>
                <p className="mt-2 text-primary-200">Split into 3 VMs with 10GB RAM each</p>
              </div>
              <div className="text-center bg-primary-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2"><a className="link hover:underline" href="https://www.liquidweb.com/dedicated-server-hosting/bare-metal?ref=shellmates">LiquidWeb</a></h3>
                <p>16 GB memory, Intel E-2134 4 core @ 3.5 GHz, 2×480 GB SSD for $44.00</p>
                <p className="mt-2 text-primary-200">Split into 2 VMs with 8GB RAM each</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-center mb-6">Meet Your Potential Co-Founders</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/spots/c8f3c470-f353-4804-bd5c-a5c30bba7dbb" className="bg-primary-800 rounded-lg p-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary-300 mb-3 overflow-hidden">
                  <img src="https://avatars.githubusercontent.com/u/127054?v=4" alt="Andrew A." className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold">Andrew A.</h3>
                <p className="text-center">Backend Dev & DevOps Engineer</p>
                <p className="text-center mt-1 text-xs">Looking for frontend partner to build new SaaS product</p>
                <p className="text-primary-300 mt-1">$18.07/month - Germany</p>
              </Link>
              <div className="bg-primary-800 rounded-lg p-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary-300 mb-3 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="David T." className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold">David T.</h3>
                <p className="text-center">Full-Stack Developer</p>
                <p className="text-center mt-1 text-xs">Looking for ML/AI expert to build data analysis platform</p>
                <p className="text-primary-300 mt-1">$22/month - San Francisco</p>
              </div>
              <div className="bg-primary-800 rounded-lg p-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary-300 mb-3 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/36.jpg" alt="Mia L." className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold">Mia L.</h3>
                <p className="text-center">Mobile App Developer</p>
                <p className="text-center mt-1 text-xs">Seeking backend partner to build e-commerce solution</p>
                <p className="text-primary-300 mt-1">$8/month - Tokyo</p>
              </div>
            </div>
            
            <div className="bg-gray-800 text-white p-8 mt-12 rounded-lg">
              <h2 className="text-2xl font-semibold text-center mb-6">Why Technical Co-Founders Thrive on shellmates</h2>
              <div className="max-w-4xl mx-auto text-gray-300">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-300 mb-2">Perfect for Teams of Two</h3>
                  <p className="mb-3">
                    When starting out, one bare metal server is the best choice for a team of 2. During the prototyping and product-market fit phase, this single beefy server will handle any load you could possibly need while costing 90% less than equivalent cloud servers.
                  </p>
                  <p>
                    You don't need to worry about availability zones, geo-location, backups, or other enterprise concerns yet. Those become important after you get funding and scale, but for now, focus on building your product.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-300 mb-2">Build on a Solid Foundation</h3>
                  <p className="mb-3">
                    Our platform runs on <a href="https://firecracker-microvm.github.io/" className="text-primary-400 hover:underline">Firecracker</a>, an open-source virtualization technology developed by AWS. This gives you and your co-founder a professional-grade environment to work on projects together from day one.
                  </p>
                  <p>
                    Building your startup partnership around a shared infrastructure project creates deeper technical bonds than coffee meetings or hackathons can provide.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-300 mb-2">Test Your Compatibility</h3>
                  <p className="mb-3">
                    Managing a shared server provides real insight into how you and your potential co-founder handle technical decisions, solve problems, and collaborate on infrastructure.
                  </p>
                  <p>
                    This practical collaboration reveals compatibility in ways that resumes and coffee chats never could. Find out if you're truly in sync before committing to building a company together.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary-300 mb-2">All Technical, No Business Fluff</h3>
                  <p className="mb-3">
                    Unlike typical co-founder matching platforms, we ensure <span className="font-semibold">both partners are technical</span>. No more "idea person seeking coder" - just technical people seeking other technical people.
                  </p>
                  <p>
                    With shellmates, you're guaranteed to find someone who can contribute real code, not just business plans. Build your MVP together on shared infrastructure before seeking non-technical partners.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-primary-300 mb-2">From Server Mates to Co-Founders</h3>
                  <p className="mb-3">
                    Sharing a server is just the beginning. As you collaborate on infrastructure, you'll naturally start discussing other projects and ideas. Many of our shellmates have gone on to found successful startups together.
                  </p>
                  <p>
                    The best technical co-founder relationships are built on trust, shared experiences, and proven collaboration - exactly what shellmates helps you establish from day one.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 flex flex-col items-center justify-center pb-10">
        <div className="mb-10">
          <Link 
            to="/icebreaker" 
            className="px-8 py-3 text-lg font-semibold rounded-md bg-purple-600 text-white hover:bg-purple-700 shadow-lg transition-all transform hover:scale-105"
          >
            Take the Icebreaker Quiz
          </Link>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default SplashPage
