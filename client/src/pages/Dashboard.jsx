import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'

// Random data generation functions
const generateRandomData = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateTimeSeriesData = (points, min, max) => {
  return Array.from({ length: points }, () => generateRandomData(min, max));
}

// Time window options
const TIME_WINDOWS = [
  { label: '15 min', value: '15m' },
  { label: '1 hour', value: '1h' }, 
  { label: '4 hours', value: '4h' }, 
  { label: '12 hours', value: '12h' },
  { label: '24 hours', value: '24h' },
  { label: '7 days', value: '7d' },
];

// Status indicators
const StatusIndicator = ({ status }) => {
  const colors = {
    normal: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
    unknown: 'bg-gray-400'
  };
  
  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full ${colors[status]} mr-2`}></div>
      <span className="text-xs font-medium capitalize">{status}</span>
    </div>
  );
};

// Small stat card
const StatCard = ({ title, value, change, status = 'normal', icon }) => {
  const changeColor = parseFloat(change) >= 0 ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <div className="flex justify-between">
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center mt-1">
            <span className={`text-xs ${changeColor}`}>{change}%</span>
            <span className="text-xs text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div className="bg-primary-50 p-2 rounded-md">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <StatusIndicator status={status} />
      </div>
    </div>
  );
};

// Line chart component (simplified visual representation)
const LineChart = ({ data, title, subtitle, height = 120 }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * canvas.width;
      const normalizedValue = range === 0 ? 0.5 : (value - minValue) / range;
      const y = canvas.height - (normalizedValue * (canvas.height - 20)) - 10;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Add gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fillStyle = gradient;
    ctx.fill();
    
  }, [data]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
            +{generateRandomData(2, 15)}%
          </div>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        width="100%" 
        height={height}
        className="w-full"
      ></canvas>
    </div>
  );
};

// Alert component
const Alert = ({ level, message, time }) => {
  const colors = {
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    success: 'bg-green-100 text-green-800 border-green-200',
  };
  
  return (
    <div className={`px-4 py-3 rounded-md border ${colors[level]} mb-2 flex justify-between items-center`}>
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full bg-${level === 'info' ? 'blue' : level === 'warning' ? 'yellow' : level === 'error' ? 'red' : 'green'}-500 mr-2`}></div>
        <span className="text-sm">{message}</span>
      </div>
      <span className="text-xs opacity-70">{time}</span>
    </div>
  );
};

// Table row component for services
const ServiceRow = ({ name, status, cpu, memory, instances, region }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-gray-500">{region}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusIndicator status={status} />
      </td>
      <td className="px-4 py-3">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              parseFloat(cpu) < 60 ? 'bg-green-500' : 
              parseFloat(cpu) < 80 ? 'bg-yellow-500' : 'bg-red-500'
            }`} 
            style={{width: `${cpu}%`}}
          ></div>
        </div>
        <div className="text-xs mt-1">{cpu}%</div>
      </td>
      <td className="px-4 py-3">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              parseFloat(memory) < 60 ? 'bg-green-500' : 
              parseFloat(memory) < 80 ? 'bg-yellow-500' : 'bg-red-500'
            }`} 
            style={{width: `${memory}%`}}
          ></div>
        </div>
        <div className="text-xs mt-1">{memory}%</div>
      </td>
      <td className="px-4 py-3 text-center">{instances}</td>
      <td className="px-4 py-3 text-right">
        <button className="text-sm text-primary-600 hover:text-primary-800">Details</button>
      </td>
    </tr>
  );
};

function Dashboard() {
  const { currentUser, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [selectedTimeWindow, setSelectedTimeWindow] = useState('4h')
  const [alertsCount, setAlertsCount] = useState({ critical: 3, warning: 7, info: 12 })
  
  // Generate random system statistics
  const [stats, setStats] = useState({
    totalUsers: '4.32M',
    activeUsers: '152.4K',
    totalPosts: '18.7M',
    totalComments: '127.5M',
    redisNodes: 12,
    redisCpu: 68,
    kafkaNodes: 8,
    databaseConnections: 1842,
    activeMicroservices: 32,
    totalPods: 147,
    healthyPods: 142,
    availabilityPercent: 99.98,
    averageResponseTime: 187, // in ms
  })
  
  // Mock time series data - updated periodically
  const [timeSeriesData, setTimeSeriesData] = useState({
    userActivity: generateTimeSeriesData(50, 5000, 15000),
    cpuUsage: generateTimeSeriesData(50, 45, 85),
    memoryUsage: generateTimeSeriesData(50, 55, 78),
    responseTime: generateTimeSeriesData(50, 150, 220),
    errorRate: generateTimeSeriesData(50, 0, 3),
    throughput: generateTimeSeriesData(50, 2000, 5000),
  })
  
  // Mock alerts
  const [alerts, setAlerts] = useState([
    { level: 'error', message: 'Redis cluster node failure in us-west-2', time: '2 min ago' },
    { level: 'warning', message: 'High memory usage on recommendation service', time: '7 min ago' },
    { level: 'warning', message: 'Increased latency in auth service', time: '13 min ago' },
    { level: 'info', message: 'Auto-scaling added 5 new pods to handle load', time: '17 min ago' },
    { level: 'success', message: 'Database backup completed successfully', time: '25 min ago' },
  ])
  
  // Mock services data
  const [services, setServices] = useState([
    { name: 'Auth Service', status: 'normal', cpu: '45', memory: '62', instances: '6', region: 'us-west-2' },
    { name: 'User Service', status: 'normal', cpu: '38', memory: '51', instances: '4', region: 'us-west-2' },
    { name: 'Content API', status: 'warning', cpu: '78', memory: '73', instances: '12', region: 'us-west-2' },
    { name: 'Recommendations', status: 'normal', cpu: '65', memory: '70', instances: '8', region: 'us-east-1' },
    { name: 'Search Service', status: 'normal', cpu: '42', memory: '56', instances: '6', region: 'us-east-1' },
    { name: 'Notification Service', status: 'critical', cpu: '92', memory: '87', instances: '5', region: 'eu-west-1' },
    { name: 'Analytics Engine', status: 'normal', cpu: '71', memory: '65', instances: '4', region: 'eu-west-1' },
  ])
  
  // Update data periodically to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update time series data
      setTimeSeriesData(prev => ({
        userActivity: [...prev.userActivity.slice(1), generateRandomData(5000, 15000)],
        cpuUsage: [...prev.cpuUsage.slice(1), generateRandomData(45, 85)],
        memoryUsage: [...prev.memoryUsage.slice(1), generateRandomData(55, 78)],
        responseTime: [...prev.responseTime.slice(1), generateRandomData(150, 220)],
        errorRate: [...prev.errorRate.slice(1), generateRandomData(0, 3)],
        throughput: [...prev.throughput.slice(1), generateRandomData(2000, 5000)],
      }));
      
      // Update service metrics randomly
      setServices(prev => prev.map(service => ({
        ...service,
        cpu: Math.min(99, Math.max(10, parseInt(service.cpu) + generateRandomData(-5, 5))).toString(),
        memory: Math.min(99, Math.max(20, parseInt(service.memory) + generateRandomData(-3, 3))).toString(),
        status: Math.random() > 0.95 
          ? ['normal', 'warning', 'critical'][generateRandomData(0, 2)] 
          : service.status
      })));
      
      // Sometimes add a new alert
      if (Math.random() > 0.8) {
        const alertTypes = [
          { level: 'info', message: 'Auto-scaling event triggered' },
          { level: 'info', message: 'New deployment started' },
          { level: 'warning', message: 'Increased error rate detected' },
          { level: 'warning', message: 'High latency detected' },
          { level: 'error', message: 'Service unavailable in region' },
          { level: 'success', message: 'Deployment completed successfully' }
        ];
        
        const newAlert = alertTypes[generateRandomData(0, alertTypes.length - 1)];
        
        setAlerts(prev => [
          {
            level: newAlert.level,
            message: newAlert.message,
            time: 'just now'
          },
          ...prev.slice(0, 4)
        ]);
        
        // Update alert counts
        setAlertsCount(prev => {
          const newCounts = {...prev};
          if (newAlert.level === 'error') newCounts.critical = prev.critical + 1;
          if (newAlert.level === 'warning') newCounts.warning = prev.warning + 1;
          if (newAlert.level === 'info' || newAlert.level === 'success') newCounts.info = prev.info + 1;
          return newCounts;
        });
      }
      
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      setIsLoggingOut(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-primary-800">Forums</h1>
            <div className="hidden md:flex space-x-1">
              <button className="px-3 py-1 text-sm rounded-md bg-primary-50 text-primary-700">Dashboard</button>
              <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Content</button>
              <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Users</button>
              <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Analytics</button>
              <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">Infrastructure</button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                {alertsCount.critical}
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 hidden md:inline">Welcome, {currentUser?.username}</span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-sm px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="p-4">
        {/* Time window selector */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">System Status Overview</h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Time window:</span>
            <div className="bg-white rounded-md shadow-sm p-1 flex">
              {TIME_WINDOWS.map(option => (
                <button 
                  key={option.value}
                  onClick={() => setSelectedTimeWindow(option.value)}
                  className={`text-xs px-3 py-1 rounded-md ${
                    selectedTimeWindow === option.value 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Status summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Active Users" 
            value={stats.activeUsers}
            change="+12.4"
            status="normal"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>}
          />
          <StatCard 
            title="Redis Nodes" 
            value={stats.redisNodes}
            change="+2"
            status="warning"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>}
          />
          <StatCard 
            title="Total Pods" 
            value={stats.totalPods}
            change="+8.7"
            status={stats.healthyPods < stats.totalPods * 0.95 ? 'warning' : 'normal'}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>}
          />
          <StatCard 
            title="Availability" 
            value={`${stats.availabilityPercent}%`}
            change="-0.01"
            status={stats.availabilityPercent > 99.9 ? 'normal' : 'warning'}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
          />
        </div>
        
        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <LineChart 
            data={timeSeriesData.userActivity} 
            title="User Activity" 
            subtitle="Active user sessions per minute" 
          />
          <LineChart 
            data={timeSeriesData.cpuUsage} 
            title="System CPU Usage" 
            subtitle="Average across all services" 
          />
          <LineChart 
            data={timeSeriesData.memoryUsage} 
            title="Memory Usage" 
            subtitle="Average across all pods" 
          />
        </div>
        
        {/* Second row of charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <LineChart 
            data={timeSeriesData.responseTime} 
            title="Response Time" 
            subtitle="Average API response (ms)" 
          />
          <LineChart 
            data={timeSeriesData.errorRate} 
            title="Error Rate" 
            subtitle="Percentage of failed requests" 
          />
          <LineChart 
            data={timeSeriesData.throughput} 
            title="Throughput" 
            subtitle="Requests per second" 
          />
        </div>
        
        {/* Services and alerts section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Services Status</h3>
              <div className="flex space-x-2">
                <button className="text-sm px-3 py-1 bg-primary-50 text-primary-700 rounded">Refresh</button>
                <button className="text-sm px-3 py-1 border border-gray-300 rounded">Filter</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Instances</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service, index) => (
                    <ServiceRow key={index} {...service} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Alerts panel */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Recent Alerts</h3>
              <div className="flex space-x-1">
                <div className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                  {alertsCount.critical} Critical
                </div>
                <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                  {alertsCount.warning} Warning
                </div>
              </div>
            </div>
            <div className="p-4">
              {alerts.map((alert, index) => (
                <Alert key={index} {...alert} />
              ))}
              
              <button className="w-full mt-2 text-sm text-center text-primary-600 hover:text-primary-800">
                View all alerts
              </button>
            </div>
            
            {/* Quick actions */}
            <div className="border-t border-gray-200 px-4 py-3">
              <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="text-xs px-2 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                  Scale Services
                </button>
                <button className="text-xs px-2 py-1.5 bg-purple-50 text-purple-700 rounded hover:bg-purple-100">
                  View Logs
                </button>
                <button className="text-xs px-2 py-1.5 bg-green-50 text-green-700 rounded hover:bg-green-100">
                  Deploy Update
                </button>
                <button className="text-xs px-2 py-1.5 bg-orange-50 text-orange-700 rounded hover:bg-orange-100">
                  Run Diagnostics
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
