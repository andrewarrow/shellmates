import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'

// Traffic Slider component
const TrafficSlider = ({ userCount, setUserCount }) => {
  // Log scale conversion for smoother slider experience - now up to 100M
  const logMax = Math.log10(100000000);
  const logMin = Math.log10(1);
  
  const logToLinear = (logValue) => {
    return Math.round(Math.pow(10, logValue));
  };
  
  const linearToLog = (linearValue) => {
    return Math.log10(Math.max(1, linearValue));
  };
  
  const logValue = linearToLog(userCount);
  
  const handleSliderChange = (e) => {
    // When manually changing the slider, pause the auto-growth
    if (autoGrowth) {
      setAutoGrowth(false);
    }
    
    const newLogValue = parseFloat(e.target.value);
    setUserCount(logToLinear(newLogValue));
    
    // Reset CPU if moving to a much lower value
    if (logToLinear(newLogValue) < 10 && serverCpu > 50) {
      setServerCpu(15);
      setServerStatus('normal');
    }
  };
  
  // Format user count with K or M suffix
  const formatUserCount = (count) => {
    if (count >= 1000000) return `${(count/1000000).toFixed(count >= 10000000 ? 0 : 1)}M`;
    if (count >= 1000) return `${(count/1000).toFixed(count >= 100000 ? 0 : 1)}K`;
    return count.toString();
  };
  
  return (
    <div className="flex items-center space-x-2 flex-grow mx-4">
      <span className="text-xs text-gray-500 shrink-0">1</span>
      <input
        type="range"
        min={logMin}
        max={logMax}
        step={0.01}
        value={logValue}
        onChange={handleSliderChange}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-green-200 via-blue-300 to-red-300"
        style={{
          accentColor: userCount < 1000 ? '#10B981' : 
                      userCount < 100000 ? '#3B82F6' : 
                      userCount < 10000000 ? '#EF4444' :
                      '#9F1239'
        }}
      />
      <span className="text-xs text-gray-500 shrink-0">100M</span>
      <span className={`ml-1 text-sm font-medium px-2 py-0.5 rounded-md min-w-[50px] text-center shrink-0
        ${userCount < 1000 ? 'bg-green-50 text-green-700' : 
          userCount < 100000 ? 'bg-blue-50 text-blue-700' : 
          userCount < 10000000 ? 'bg-red-50 text-red-700' :
          'bg-rose-100 text-rose-900'}`}>
        {formatUserCount(userCount)}
      </span>
    </div>
  );
};

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

// Line chart component (simplified visual representation with mini sparkline style)
const LineChart = ({ data, title, subtitle, height = 30 }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    // Get the device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    
    const ctx = canvas.getContext('2d');
    
    // Scale up the context to match the device pixel ratio
    ctx.scale(dpr, dpr);
    
    // Set display size (CSS)
    canvas.style.width = canvas.offsetWidth + 'px';
    canvas.style.height = canvas.offsetHeight + 'px';
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    // Add some extra vertical padding
    const verticalPadding = 4;
    const effectiveHeight = canvas.offsetHeight - (verticalPadding * 2);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    // Enable antialiasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw line - very thin
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 0.5; // Extra thin line
    
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * canvas.offsetWidth;
      const normalizedValue = range === 0 ? 0.5 : (value - minValue) / range;
      // Add padding at the bottom to prevent line going below chart area
      const y = canvas.offsetHeight - verticalPadding - (normalizedValue * effectiveHeight);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  }, [data]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-100">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-medium">{title}</h3>
        <div className="text-[10px] font-medium px-1 py-0.5 bg-green-100 text-green-700 rounded-sm">
          +{generateRandomData(2, 15)}%
        </div>
      </div>
      <div className="text-[10px] text-gray-500 mb-1">{subtitle}</div>
      <div className="h-[30px]">
        <canvas 
          ref={canvasRef} 
          width="100%" 
          height={height}
          className="w-full"
        ></canvas>
      </div>
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
  const [userCount, setUserCount] = useState(1) // Start with 1 user
  const [autoGrowth, setAutoGrowth] = useState(true) // Auto-increase traffic
  const [simulationTime, setSimulationTime] = useState(0) // Simulation time in seconds
  const [serverCpu, setServerCpu] = useState(15) // Single server CPU usage
  const [serverMemory, setServerMemory] = useState(20) // Single server memory usage
  const [serverStatus, setServerStatus] = useState('normal') // Server status
  const [systemDown, setSystemDown] = useState(false) // System down state
  
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
    redisLatency: generateTimeSeriesData(50, 2, 12),
    networkTraffic: generateTimeSeriesData(50, 120, 350),
    diskIO: generateTimeSeriesData(50, 10, 85),
    cacheHitRate: generateTimeSeriesData(50, 70, 95),
    queueDepth: generateTimeSeriesData(50, 5, 35),
    authRequests: generateTimeSeriesData(50, 100, 450),
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
  
  // Update UI based on user count
  useEffect(() => {
    // Update stats based on user count
    const userScale = userCount / 1000000; // Scale factor (0-1)
    
    // Update system statistics proportionally to user count
    setStats({
      totalUsers: userCount >= 1000000 ? '4.32M' : 
                 userCount >= 1000 ? `${(userCount/1000).toFixed(1)}K` : 
                 userCount.toString(),
      activeUsers: userCount >= 1000000 ? '152.4K' : 
                  userCount >= 1000 ? `${(userCount/1000 * 0.15).toFixed(1)}K` : 
                  Math.round(userCount * 0.15).toString(),
      totalPosts: userCount >= 1000000 ? '18.7M' : 
                 userCount >= 1000 ? `${(userCount/1000 * 18.7).toFixed(1)}K` : 
                 Math.round(userCount * 18.7).toString(),
      totalComments: userCount >= 1000000 ? '127.5M' : 
                    userCount >= 1000 ? `${(userCount/1000 * 127.5).toFixed(1)}K` : 
                    Math.round(userCount * 127.5).toString(),
      redisNodes: Math.max(1, Math.round(12 * userScale)),
      redisCpu: Math.min(99, Math.round(50 + 18 * userScale)),
      kafkaNodes: Math.max(0, Math.round(8 * userScale)),
      databaseConnections: Math.max(1, Math.round(1842 * userScale)),
      activeMicroservices: Math.max(1, Math.round(32 * userScale)), 
      totalPods: Math.max(1, Math.round(147 * userScale)),
      healthyPods: Math.max(1, Math.round(142 * userScale)),
      availabilityPercent: 99.98,
      averageResponseTime: Math.max(50, Math.round(187 * (0.5 + 0.5 * userScale))),
    });
    
    // Update services based on user count
    if (userCount <= 1) {
      // Single user - just one EC2 instance with SQLite
      setServices([
        { name: 'EC2 Instance', status: 'normal', cpu: '15', memory: '20', instances: '1', region: 'us-west-2' },
      ]);
    } else if (userCount <= 100) {
      // Small deployment
      setServices([
        { name: 'Web Service', status: 'normal', cpu: '25', memory: '30', instances: '1', region: 'us-west-2' },
        { name: 'Database (SQLite)', status: 'normal', cpu: '10', memory: '15', instances: '1', region: 'us-west-2' },
      ]);
    } else if (userCount <= 10000) {
      // Medium deployment
      setServices([
        { name: 'Web Service', status: 'normal', cpu: '45', memory: '50', instances: '2', region: 'us-west-2' },
        { name: 'API Service', status: 'normal', cpu: '35', memory: '40', instances: '2', region: 'us-west-2' },
        { name: 'Database (MySQL)', status: 'normal', cpu: '60', memory: '55', instances: '1', region: 'us-west-2' },
        { name: 'Cache Service', status: 'normal', cpu: '30', memory: '25', instances: '1', region: 'us-west-2' },
      ]);
    } else if (userCount <= 100000) {
      // Large deployment
      setServices([
        { name: 'Auth Service', status: 'normal', cpu: '45', memory: '62', instances: '2', region: 'us-west-2' },
        { name: 'User Service', status: 'normal', cpu: '38', memory: '51', instances: '2', region: 'us-west-2' },
        { name: 'Content API', status: 'normal', cpu: '78', memory: '73', instances: '3', region: 'us-west-2' },
        { name: 'Database (Postgres)', status: 'normal', cpu: '65', memory: '70', instances: '2', region: 'us-west-2' },
        { name: 'Cache Service', status: 'normal', cpu: '42', memory: '56', instances: '2', region: 'us-west-2' },
      ]);
    } else if (userCount <= 10000000) {
      // Enterprise scale deployment
      setServices([
        { name: 'Auth Service', status: 'normal', cpu: '45', memory: '62', instances: '6', region: 'us-west-2' },
        { name: 'User Service', status: 'normal', cpu: '38', memory: '51', instances: '4', region: 'us-west-2' },
        { name: 'Content API', status: userCount > 5000000 ? 'warning' : 'normal', cpu: '78', memory: '73', instances: '12', region: 'us-west-2' },
        { name: 'Recommendations', status: 'normal', cpu: '65', memory: '70', instances: '8', region: 'us-east-1' },
        { name: 'Search Service', status: 'normal', cpu: '42', memory: '56', instances: '6', region: 'us-east-1' },
        { name: 'Notification Service', status: userCount > 8000000 ? 'critical' : 'normal', cpu: '92', memory: '87', instances: '5', region: 'eu-west-1' },
        { name: 'Analytics Engine', status: 'normal', cpu: '71', memory: '65', instances: '4', region: 'eu-west-1' },
      ]);
    } else {
      // Hyperscale deployment
      setServices([
        { name: 'Auth Service Cluster', status: 'normal', cpu: '68', memory: '72', instances: '24', region: 'Global' },
        { name: 'User Service Cluster', status: 'normal', cpu: '72', memory: '65', instances: '18', region: 'Global' },
        { name: 'Content API Cluster', status: userCount > 50000000 ? 'warning' : 'normal', cpu: '88', memory: '82', instances: '36', region: 'Global' },
        { name: 'Recommendations AI', status: 'normal', cpu: '75', memory: '80', instances: '22', region: 'Global' },
        { name: 'Search Cluster', status: 'normal', cpu: '82', memory: '76', instances: '20', region: 'Global' },
        { name: 'Notification Pipeline', status: userCount > 80000000 ? 'critical' : 'normal', cpu: '94', memory: '91', instances: '28', region: 'Global' },
        { name: 'Analytics Platform', status: 'normal', cpu: '86', memory: '79', instances: '16', region: 'Global' },
        { name: 'Media Processing', status: userCount > 90000000 ? 'warning' : 'normal', cpu: '91', memory: '88', instances: '30', region: 'Global' },
        { name: 'Distributed Cache', status: 'normal', cpu: '78', memory: '83', instances: '64', region: 'Global' },
      ]);
    }
    
  }, [userCount]);
  
  // Traffic growth and system stress simulation
  useEffect(() => {
    if (!autoGrowth) return;
    
    // One second interval for the simulation
    const interval = setInterval(() => {
      // Increase simulation time
      setSimulationTime(prevTime => {
        const newTime = prevTime + 1;
        
        // Check for system down condition at 2 minutes (120 seconds)
        if (newTime >= 120 && serverCpu >= 95) {
          setSystemDown(true);
          setAutoGrowth(false);
        }
        
        return newTime;
      });
      
      // Calculate traffic increase based on simulation time (exponential growth)
      // Complete in about 2 minutes
      const progressRatio = Math.min(1, simulationTime / 100); // 0 to 1 over ~100 seconds
      const newUserCount = Math.max(1, Math.floor(Math.pow(10, progressRatio * 3))); // 1 to 1000 exponentially
      
      // Increase CPU load faster than user count (non-linear)
      // CPU should hit high levels around 70-90 seconds
      const cpuLoadFactor = Math.min(1, Math.pow(progressRatio * 1.4, 1.8));
      const newCpuUsage = Math.min(99, Math.floor(15 + 84 * cpuLoadFactor));
      
      // Memory grows more slowly than CPU
      const newMemoryUsage = Math.min(95, Math.floor(20 + 60 * progressRatio));
      
      // Set CPU status based on load
      let newStatus = 'normal';
      if (newCpuUsage > 90) newStatus = 'critical';
      else if (newCpuUsage > 75) newStatus = 'warning';
      
      // Generate a warning alert if CPU crosses a threshold
      if ((newCpuUsage >= 75 && serverCpu < 75) || (newCpuUsage >= 90 && serverCpu < 90)) {
        const alertMessage = newCpuUsage >= 90 
          ? 'CRITICAL: EC2 instance CPU usage above 90%' 
          : 'WARNING: EC2 instance CPU usage above 75%';
          
        const alertLevel = newCpuUsage >= 90 ? 'error' : 'warning';
        
        setAlerts(prev => [
          {
            level: alertLevel,
            message: alertMessage,
            time: 'just now'
          },
          ...prev.slice(0, 4)
        ]);
        
        // Update alert counts
        setAlertsCount(prev => {
          const newCounts = {...prev};
          if (alertLevel === 'error') newCounts.critical = prev.critical + 1;
          if (alertLevel === 'warning') newCounts.warning = prev.warning + 1;
          return newCounts;
        });
      }
      
      // Update state
      setUserCount(newUserCount);
      setServerCpu(newCpuUsage);
      setServerMemory(newMemoryUsage);
      setServerStatus(newStatus);
      
      // Update service with new CPU value
      setServices(prev => {
        if (prev.length === 0 || prev[0].name !== 'EC2 Instance') return prev;
        
        return [
          { 
            ...prev[0], 
            cpu: newCpuUsage.toString(), 
            memory: newMemoryUsage.toString(),
            status: newStatus
          },
          ...prev.slice(1)
        ];
      });
      
    }, 1000);
    
    return () => clearInterval(interval);
  }, [autoGrowth, simulationTime, serverCpu]);
  
  // Update charts and other data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Update time series data
      setTimeSeriesData(prev => {
        // For single EC2 instance, make CPU chart match the server CPU
        const newCpuValue = userCount <= 100 ? serverCpu : Math.min(99, Math.max(10, serverCpu + generateRandomData(-5, 5)));
        
        return {
          userActivity: [...prev.userActivity.slice(1), userCount],
          cpuUsage: [...prev.cpuUsage.slice(1), newCpuValue],
          memoryUsage: [...prev.memoryUsage.slice(1), userCount <= 100 ? serverMemory : Math.min(95, Math.max(20, serverMemory + generateRandomData(-3, 3)))],
          responseTime: [...prev.responseTime.slice(1), Math.min(500, Math.max(50, 50 + 450 * (serverCpu / 100)))],
          errorRate: [...prev.errorRate.slice(1), serverCpu > 90 ? generateRandomData(5, 15) : serverCpu > 80 ? generateRandomData(1, 5) : generateRandomData(0, 1)],
          throughput: [...prev.throughput.slice(1), Math.max(userCount * 2, generateRandomData(userCount * 1.5, userCount * 2.5))],
          redisLatency: [...prev.redisLatency.slice(1), generateRandomData(Math.max(1, 2 * userCount/1000000), Math.max(2, 12 * userCount/1000000))],
          networkTraffic: [...prev.networkTraffic.slice(1), Math.max(userCount / 10, generateRandomData(userCount / 15, userCount / 5))],
          diskIO: [...prev.diskIO.slice(1), serverCpu > 85 ? generateRandomData(70, 95) : generateRandomData(10, 60)],
          cacheHitRate: [...prev.cacheHitRate.slice(1), serverCpu > 85 ? generateRandomData(50, 70) : generateRandomData(70, 95)],
          queueDepth: [...prev.queueDepth.slice(1), serverCpu > 90 ? generateRandomData(20, 40) : serverCpu > 80 ? generateRandomData(5, 20) : generateRandomData(0, 5)],
          authRequests: [...prev.authRequests.slice(1), Math.max(1, userCount / 10)],
        };
      });
      
      // Only update complex service metrics for higher user counts
      if (userCount > 100 && !systemDown) {
        // Update service metrics randomly
        setServices(prev => {
          // Skip updating EC2 instance as it's handled in the primary simulation
          if (prev.length === 1 && prev[0].name === 'EC2 Instance') return prev;
          
          return prev.map(service => ({
            ...service,
            cpu: Math.min(99, Math.max(10, parseInt(service.cpu) + generateRandomData(-5, 5))).toString(),
            memory: Math.min(99, Math.max(20, parseInt(service.memory) + generateRandomData(-3, 3))).toString(),
            status: Math.random() > 0.95 && userCount > 500000
              ? ['normal', 'warning', 'critical'][generateRandomData(0, 2)] 
              : service.status
          }));
        });
      }
      
    }, 3000);
    
    return () => clearInterval(interval);
  }, [userCount, serverCpu, serverMemory, serverStatus, systemDown]);

  const handleLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      setIsLoggingOut(false)
    }, 500)
  }

  // Action handlers for remediation
  const handleRefactorDatabase = (dbType) => {
    // Stop auto-growth and reset CPU usage
    setAutoGrowth(false);
    setServerCpu(Math.max(30, serverCpu - 40));
    setServerStatus('normal');
    
    // Update infrastructure text
    if (dbType === 'mysql') {
      setAlerts(prev => [
        {
          level: 'success',
          message: 'Successfully migrated from SQLite to MySQL',
          time: 'just now'
        },
        ...prev.slice(0, 4)
      ]);
    } else if (dbType === 'postgres') {
      setAlerts(prev => [
        {
          level: 'success',
          message: 'Successfully migrated from SQLite to PostgreSQL',
          time: 'just now'
        },
        ...prev.slice(0, 4)
      ]);
    } else if (dbType === 'dynamodb') {
      setAlerts(prev => [
        {
          level: 'success',
          message: 'Successfully migrated from SQLite to DynamoDB',
          time: 'just now'
        },
        ...prev.slice(0, 4)
      ]);
    }
    
    // Resume auto-growth but slower
    setTimeout(() => {
      setAutoGrowth(true);
    }, 5000);
  };
  
  const handleAddInstance = () => {
    // Stop auto-growth and reset CPU usage
    setAutoGrowth(false);
    setServerCpu(Math.max(30, serverCpu - 40));
    setServerStatus('normal');
    
    // Add load balancer service
    setServices(prev => [
      { name: 'Load Balancer', status: 'normal', cpu: '25', memory: '30', instances: '1', region: 'us-west-2' },
      { name: 'EC2 Instance 1', status: 'normal', cpu: Math.floor(serverCpu / 2).toString(), memory: serverMemory.toString(), instances: '1', region: 'us-west-2' },
      { name: 'EC2 Instance 2', status: 'normal', cpu: Math.floor(serverCpu / 2).toString(), memory: serverMemory.toString(), instances: '1', region: 'us-west-2' },
    ]);
    
    setAlerts(prev => [
      {
        level: 'success',
        message: 'Added second EC2 instance with load balancer',
        time: 'just now'
      },
      ...prev.slice(0, 4)
    ]);
    
    // Resume auto-growth but slower
    setTimeout(() => {
      setAutoGrowth(true);
    }, 5000);
  };
  
  const handleMoveToK8s = () => {
    // Stop auto-growth and reset CPU usage
    setAutoGrowth(false);
    setServerCpu(Math.max(20, serverCpu - 60));
    setServerStatus('normal');
    
    // Add k8s services
    setServices(prev => [
      { name: 'K8s Master', status: 'normal', cpu: '35', memory: '40', instances: '1', region: 'us-west-2' },
      { name: 'K8s Worker 1', status: 'normal', cpu: Math.floor(serverCpu / 3).toString(), memory: serverMemory.toString(), instances: '1', region: 'us-west-2' },
      { name: 'K8s Worker 2', status: 'normal', cpu: Math.floor(serverCpu / 3).toString(), memory: serverMemory.toString(), instances: '1', region: 'us-west-2' },
      { name: 'K8s Worker 3', status: 'normal', cpu: Math.floor(serverCpu / 3).toString(), memory: serverMemory.toString(), instances: '1', region: 'us-west-2' },
    ]);
    
    setAlerts(prev => [
      {
        level: 'success',
        message: 'Successfully migrated to Kubernetes cluster',
        time: 'just now'
      },
      ...prev.slice(0, 4)
    ]);
    
    // Resume auto-growth but slower
    setTimeout(() => {
      setAutoGrowth(true);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* System Down Overlay */}
      {systemDown && (
        <div className="fixed inset-0 bg-red-600 bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <div className="text-white text-5xl font-bold mb-4">SYSTEM DOWN</div>
          <div className="text-white text-xl mb-8">Server overloaded due to excessive traffic</div>
          <button 
            onClick={() => {
              setSystemDown(false);
              setServerCpu(50);
              setServerStatus('normal');
              setSimulationTime(0);
              setTimeout(() => setAutoGrowth(true), 1000);
            }}
            className="px-6 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100"
          >
            Restart Simulation
          </button>
        </div>
      )}
      
      {/* Header with navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-3 flex items-center">
          <h1 className="text-xl font-bold text-primary-800 whitespace-nowrap">traffic</h1>
          
          <div className="flex-grow hidden md:flex">
            <TrafficSlider userCount={userCount} setUserCount={setUserCount} />
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
        
        {/* Mobile slider - only visible on small screens */}
        <div className="px-4 pb-3 md:hidden">
          <TrafficSlider userCount={userCount} setUserCount={setUserCount} />
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="p-4">
        {/* Infrastructure description based on user count */}
        <div className="mb-4 bg-white rounded-lg shadow-sm p-3 border border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <h3 className="text-sm font-medium mb-2">Infrastructure Overview</h3>
              {userCount <= 1 ? (
                <p className="text-sm text-gray-600">
                  Single User Mode: 1 EC2 instance with SQLite database. Minimal infrastructure for personal or development use.
                </p>
              ) : userCount <= 100 ? (
                <p className="text-sm text-gray-600">
                  Small Scale: Single-server deployment with SQLite database. Suitable for small teams or testing environments.
                </p>
              ) : userCount <= 10000 ? (
                <p className="text-sm text-gray-600">
                  Medium Scale: Multi-server deployment with MySQL database and basic caching. Suitable for small-to-medium businesses.
                </p>
              ) : userCount <= 100000 ? (
                <p className="text-sm text-gray-600">
                  Large Scale: Multi-region deployment with PostgreSQL database, dedicated service instances, and caching layer. Suitable for medium-to-large businesses.
                </p>
              ) : userCount <= 10000000 ? (
                <p className="text-sm text-gray-600">
                  Enterprise Scale: Global multi-region deployment with microservices architecture, distributed databases, Redis clusters, Kafka streams, and container orchestration. Suitable for large enterprises and high-traffic applications.
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Hyperscale: Massive multi-region infrastructure with thousands of nodes, sharded databases, redundant caching layers, real-time data pipelines, AI-powered scaling, and global CDN distribution. Suitable for the world's largest platforms with hundreds of millions of users.
                </p>
              )}
            </div>
            
            {/* Simulation time display */}
            <div className={`font-mono text-sm py-1 px-3 rounded ${
              simulationTime > 100 ? 'bg-red-100 text-red-800' : 
              simulationTime > 70 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              {Math.floor(simulationTime / 60)}:{(simulationTime % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        
        {/* Action buttons panel - Only show in single EC2 mode with high CPU */}
        {serverCpu > 50 && services.length <= 1 && (
          <div className={`mb-4 p-3 border rounded-lg ${
            serverCpu > 90 ? 'bg-red-50 border-red-200' :
            serverCpu > 75 ? 'bg-yellow-50 border-yellow-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium ${
                serverCpu > 90 ? 'text-red-800' :
                serverCpu > 75 ? 'text-yellow-800' :
                'text-blue-800'
              }`}>Infrastructure Scaling Options</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                serverCpu > 90 ? 'bg-red-200 text-red-800' :
                serverCpu > 75 ? 'bg-yellow-200 text-yellow-800' :
                'bg-blue-200 text-blue-800'
              }`}>
                CPU: {serverCpu}%
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="border border-gray-200 rounded-md p-3 bg-white">
                <h4 className="text-sm font-medium mb-2 text-gray-700">Database Options</h4>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleRefactorDatabase('mysql')}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100"
                  >
                    MySQL
                  </button>
                  <button 
                    onClick={() => handleRefactorDatabase('postgres')}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100"
                  >
                    PostgreSQL
                  </button>
                  <button 
                    onClick={() => handleRefactorDatabase('dynamodb')}
                    className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 hover:bg-yellow-100"
                  >
                    DynamoDB
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Refactor off SQLite to a more scalable database</p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-3 bg-white">
                <h4 className="text-sm font-medium mb-2 text-gray-700">Server Options</h4>
                <button 
                  onClick={handleAddInstance}
                  className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100"
                >
                  Add EC2 Instance + Load Balancer
                </button>
                <p className="text-xs text-gray-500 mt-2">Scale horizontally with multiple servers</p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-3 bg-white">
                <h4 className="text-sm font-medium mb-2 text-gray-700">Container Options</h4>
                <button 
                  onClick={handleMoveToK8s}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100"
                >
                  Move to Kubernetes
                </button>
                <p className="text-xs text-gray-500 mt-2">Deploy on container orchestration platform</p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-3 bg-white">
                <h4 className="text-sm font-medium mb-2 text-gray-700">Simulation</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => setAutoGrowth(!autoGrowth)}
                    className={`text-xs px-2 py-1 rounded border w-full ${
                      autoGrowth 
                        ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
                        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    }`}
                  >
                    {autoGrowth ? 'Pause Traffic Growth' : 'Resume Traffic Growth'}
                  </button>
                  <button 
                    onClick={() => {
                      setSimulationTime(0);
                      setUserCount(1);
                      setServerCpu(15);
                      setServerMemory(20);
                      setServerStatus('normal');
                      setServices([
                        { name: 'EC2 Instance', status: 'normal', cpu: '15', memory: '20', instances: '1', region: 'us-west-2' },
                      ]);
                    }}
                    className="text-xs px-2 py-1 bg-gray-50 text-gray-700 rounded border border-gray-200 hover:bg-gray-100 w-full"
                  >
                    Reset Simulation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
        
        {/* Status summary cards - conditional based on user count */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Active Users" 
            value={stats.activeUsers}
            change={userCount > 100 ? "+12.4" : "+0.0"}
            status="normal"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>}
          />
          
          {/* Redis Nodes card - only show for higher user counts */}
          {userCount > 10000 && (
            <StatCard 
              title="Redis Nodes" 
              value={stats.redisNodes}
              change="+2"
              status={userCount > 500000 ? "warning" : "normal"}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>}
            />
          )}
          
          {/* Pods card - only show for higher user counts */}
          {userCount > 1000 && (
            <StatCard 
              title="Total Pods" 
              value={stats.totalPods}
              change="+8.7"
              status={stats.healthyPods < stats.totalPods * 0.95 ? 'warning' : 'normal'}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>}
            />
          )}

          {/* Database connection card for low user counts */}
          {userCount <= 100 && (
            <StatCard 
              title="Database" 
              value="SQLite"
              change="Single file"
              status="normal"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>}
            />
          )}
          
          {/* Availability card */}
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
        
        {/* Redis Cluster Stats Header - only show for higher user counts */}
        {userCount > 100000 && (
          <div className="flex items-center text-sm font-semibold text-red-600 mb-2 mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            Redis Cluster Metrics 
            <span className="text-xs bg-red-100 text-red-800 py-0.5 px-1.5 rounded ml-2">
              {stats.redisNodes} nodes
            </span>
            <div className="flex-grow"></div>
            <button className="text-xs px-2 py-0.5 border border-red-300 text-red-600 rounded hover:bg-red-50">
              View Details
            </button>
          </div>
        )}
        
        {/* Charts in a more compact grid - conditionally adjust based on user count */}
        <div className={`grid grid-cols-2 ${userCount > 250000 ? 'md:grid-cols-4' : userCount > 10000 ? 'md:grid-cols-3' : 'md:grid-cols-2'} ${userCount > 100000 ? 'lg:grid-cols-6' : userCount > 10000 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-2 mb-4`}>
          {/* Always show */}
          <LineChart 
            data={timeSeriesData.userActivity} 
            title="User Activity" 
            subtitle="Sessions/min" 
          />
          <LineChart 
            data={timeSeriesData.cpuUsage} 
            title="CPU Usage" 
            subtitle="All services" 
          />
          
          {/* Show for 10+ users */}
          {userCount >= 10 && (
            <LineChart 
              data={timeSeriesData.memoryUsage} 
              title="Memory" 
              subtitle="All services" 
            />
          )}
          
          {/* Show for 100+ users */}
          {userCount >= 100 && (
            <LineChart 
              data={timeSeriesData.responseTime} 
              title="Response Time" 
              subtitle="API (ms)" 
            />
          )}
          
          {/* Show for 1,000+ users */}
          {userCount >= 1000 && (
            <>
              <LineChart 
                data={timeSeriesData.errorRate} 
                title="Error Rate" 
                subtitle="Failed requests" 
              />
              <LineChart 
                data={timeSeriesData.throughput} 
                title="Throughput" 
                subtitle="Req/sec" 
              />
            </>
          )}
          
          {/* Show for 10,000+ users */}
          {userCount >= 10000 && (
            <>
              <LineChart 
                data={timeSeriesData.redisLatency} 
                title="Redis Latency" 
                subtitle="ms" 
              />
              <LineChart 
                data={timeSeriesData.networkTraffic} 
                title="Network Traffic" 
                subtitle="MB/s" 
              />
            </>
          )}
          
          {/* Show for 100,000+ users */}
          {userCount >= 100000 && (
            <>
              <LineChart 
                data={timeSeriesData.diskIO} 
                title="Disk I/O" 
                subtitle="IOPS" 
              />
              <LineChart 
                data={timeSeriesData.cacheHitRate} 
                title="Cache Hit Rate" 
                subtitle="%" 
              />
            </>
          )}
          
          {/* Show for 500,000+ users */}
          {userCount >= 500000 && (
            <>
              <LineChart 
                data={timeSeriesData.queueDepth} 
                title="Queue Depth" 
                subtitle="Tasks" 
              />
              <LineChart 
                data={timeSeriesData.authRequests} 
                title="Auth Requests" 
                subtitle="Req/min" 
              />
            </>
          )}
        </div>
        
        {/* Services and alerts section - conditional based on user count */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services table */}
          <div className={userCount >= 10 ? 'lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100' : 'lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100'}>
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Services Status</h3>
              {userCount >= 1000 && (
                <div className="flex space-x-2">
                  <button className="text-sm px-3 py-1 bg-primary-50 text-primary-700 rounded">Refresh</button>
                  <button className="text-sm px-3 py-1 border border-gray-300 rounded">Filter</button>
                </div>
              )}
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
          
          {/* Alerts panel - Only show for user count >= 10 */}
          {userCount >= 10 && (
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
              
              {/* Quick actions - only show for user count >= 100 */}
              {userCount >= 100 && (
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
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
