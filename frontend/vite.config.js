import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-static-html',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/terms') {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(/* html */`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service - shellmates</title>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: {
              100: '#d5e9ff',
              200: '#acc3ff',
              300: '#83b0ff',
              400: '#5a8dfc',
              500: '#316afc',
              600: '#0847e5',
              700: '#0035b0',
              800: '#00238a',
            },
          }
        }
      }
    }
  </script>
</head>
<body class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <a href="/" class="text-xl font-bold text-primary-300">shellmates</a>
    </div>
    
    <div class="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-primary-300 mb-6">Terms of Service</h1>
      
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using shellmates ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">2. Description of Service</h2>
          <p>shellmates is a platform that enables users to rent bare metal servers and create micro-clouds by dividing servers into smaller virtual machines (VMs) using Firecracker technology. Users can keep portions of servers for their own use and rent the remainder to other users.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">3. User Accounts</h2>
          <p>To use the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account and keep this information updated.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">4. User Responsibilities</h2>
          <p>As a user of shellmates, you agree to:</p>
          <ul class="list-disc pl-6 mt-2 space-y-2">
            <li>Use the Service in compliance with all applicable laws and regulations</li>
            <li>Not use the Service for any illegal or unauthorized purpose</li>
            <li>Not attempt to gain unauthorized access to any part of the Service</li>
            <li>Not interfere with or disrupt the integrity or performance of the Service</li>
            <li>Not engage in any activity that could harm the Service or other users</li>
          </ul>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">5. Server and VM Usage</h2>
          <p>When renting server space or VMs through shellmates:</p>
          <ul class="list-disc pl-6 mt-2 space-y-2">
            <li>You must adhere to the acceptable use policies of both shellmates and the underlying server providers</li>
            <li>You are responsible for the content and activities hosted on your server or VM</li>
            <li>You must not use server resources for mining cryptocurrency, running botnets, spam operations, or other resource-intensive activities that may impact other users</li>
            <li>You must implement reasonable security measures to protect your server or VM from unauthorized access</li>
          </ul>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">6. Payments and Billing</h2>
          <p>Payment terms for server rentals are as follows:</p>
          <ul class="list-disc pl-6 mt-2 space-y-2">
            <li>All fees are charged in advance on a monthly basis</li>
            <li>Payments are non-refundable unless the Service fails to meet our uptime guarantees</li>
            <li>We reserve the right to change pricing with 30 days notice</li>
            <li>Failure to pay may result in suspension or termination of your service</li>
          </ul>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">7. Service Availability and Performance</h2>
          <p>While we strive to maintain high availability, shellmates cannot guarantee 100% uptime. We will make reasonable efforts to ensure the Service operates smoothly and to provide notice of scheduled maintenance. Performance of individual VMs will depend on the specifications you select and purchase.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">8. Intellectual Property</h2>
          <p>The Service, including all content, features, and functionality, is owned by shellmates and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on the Service without explicit permission.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">9. Limitation of Liability</h2>
          <p>shellmates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, resulting from your use of the Service or any related third-party services.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">10. Termination</h2>
          <p>We reserve the right to suspend or terminate your access to the Service at any time for violation of these Terms, failure to pay, or any other reason we deem appropriate. Upon termination, your right to use the Service will immediately cease.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">11. Changes to Terms</h2>
          <p>We may modify these Terms at any time. We will provide notice of significant changes through the Service or by email. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">12. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which shellmates is registered, without regard to its conflict of law provisions.</p>
        </section>
      </div>
      
      <div class="mt-8 pt-6 border-t border-gray-700">
        <p>Last Updated: April 6, 2025</p>
        <p class="mt-4">If you have any questions about these Terms, please contact us at <a href="mailto:support@shellmates.com" class="text-primary-300 hover:underline">support@shellmates.com</a>.</p>
      </div>
    </div>
    
    <div class="mt-8 text-center">
      <p>© 2025 shellmates. All rights reserved.</p>
      <div class="flex justify-center space-x-4 mt-2">
        <a href="/" class="text-gray-400 hover:text-primary-300">Home</a>
        <a href="/terms" class="text-primary-300">Terms</a>
        <a href="/privacy" class="text-gray-400 hover:text-primary-300">Privacy</a>
      </div>
    </div>
  </div>
</body>
</html>
            `)
            return
          }
          
          if (req.url === '/privacy') {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(/* html */`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - shellmates</title>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: {
              100: '#d5e9ff',
              200: '#acc3ff',
              300: '#83b0ff',
              400: '#5a8dfc',
              500: '#316afc',
              600: '#0847e5',
              700: '#0035b0',
              800: '#00238a',
            },
          }
        }
      }
    }
  </script>
</head>
<body class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <a href="/" class="text-xl font-bold text-primary-300">shellmates</a>
    </div>
    
    <div class="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-primary-300 mb-6">Privacy Policy</h1>
      
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">1. Introduction</h2>
          <p>shellmates ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">2. Information We Collect</h2>
          <p class="mb-3">We collect the following types of information:</p>
          
          <h3 class="text-xl font-semibold text-primary-300 mb-2">Personal Information</h3>
          <ul class="list-disc pl-6 space-y-2">
            <li>Name and contact information (email address, phone number)</li>
            <li>Account credentials</li>
            <li>Billing information and payment details</li>
            <li>Profile information (such as profile pictures)</li>
          </ul>
          
          <h3 class="text-xl font-semibold text-primary-300 mb-2 mt-4">Technical Information</h3>
          <ul class="list-disc pl-6 space-y-2">
            <li>IP address and location data</li>
            <li>Device information and identifiers</li>
            <li>Browser type and settings</li>
            <li>System logs and usage data</li>
            <li>Server and VM performance metrics</li>
          </ul>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">3. How We Use Your Information</h2>
          <p class="mb-3">We use your information for the following purposes:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To process payments and billing</li>
            <li>To monitor and improve service performance</li>
            <li>To communicate with you about your account and service updates</li>
            <li>To respond to your requests and inquiries</li>
            <li>To detect and prevent fraudulent or unauthorized activity</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">5. Data Retention</h2>
          <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. We will securely delete your information when it is no longer needed for these purposes.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">6. Sharing Your Information</h2>
          <p class="mb-3">We may share your information with:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>Service providers who help us deliver our services (payment processors, cloud hosting providers)</li>
            <li>Other users, but only to the extent necessary for the functioning of the service (such as displaying your profile to users who share your server)</li>
            <li>Legal authorities when required by law or to protect our rights</li>
          </ul>
          <p class="mt-3">We do not sell your personal information to third parties.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">7. Your Rights</h2>
          <p class="mb-3">Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>Right to access the personal information we have about you</li>
            <li>Right to rectification of inaccurate personal information</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing of your personal information</li>
            <li>Right to data portability</li>
            <li>Right to object to processing of your personal information</li>
          </ul>
          <p class="mt-3">To exercise these rights, please contact us using the information provided at the end of this policy.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">8. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to collect information about your browsing activities and to remember your preferences. You can manage your cookie preferences through your browser settings.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">9. Children's Privacy</h2>
          <p>Our service is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.</p>
        </section>
        
        <section>
          <h2 class="text-2xl font-semibold text-primary-400 mb-3">10. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
        </section>
      </div>
      
      <div class="mt-8 pt-6 border-t border-gray-700">
        <p>Last Updated: April 6, 2025</p>
        <p class="mt-4">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@shellmates.com" class="text-primary-300 hover:underline">privacy@shellmates.com</a>.</p>
      </div>
    </div>
    
    <div class="mt-8 text-center">
      <p>© 2025 shellmates. All rights reserved.</p>
      <div class="flex justify-center space-x-4 mt-2">
        <a href="/" class="text-gray-400 hover:text-primary-300">Home</a>
        <a href="/terms" class="text-gray-400 hover:text-primary-300">Terms</a>
        <a href="/privacy" class="text-primary-300">Privacy</a>
      </div>
    </div>
  </div>
</body>
</html>
            `)
            return
          }
          
          next()
        })
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
