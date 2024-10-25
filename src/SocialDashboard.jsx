import React, { useState, useEffect } from 'react';
import { 
  LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Sparkles, Users, MessageCircle, Share2, TrendingUp,
  Calendar, Bell, Settings, Moon, Sun
} from 'lucide-react';

// Mock data generation functions
const generateTimeSeriesData = (days = 7) => {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    followers: Math.floor(Math.random() * 1000) + 5000,
    engagement: Math.floor(Math.random() * 500) + 1000,
    posts: Math.floor(Math.random() * 20) + 10
  }));
};

const generateEngagementData = () => {
  return [
    { name: 'Likes', value: 4800 },
    { name: 'Comments', value: 2400 },
    { name: 'Shares', value: 1600 },
    { name: 'Saves', value: 800 }
  ];
};

const SocialDashboard = () => {
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData());
  const [engagementData, setEngagementData] = useState(generateEngagementData());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('followers');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Theme colors
  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    card: isDarkMode ? 'bg-gray-800' : 'bg-white',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  };

  // Notification system
  useEffect(() => {
    const newNotification = {
      id: Date.now(),
      message: 'Engagement spike detected! 📈',
      time: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 5));
  }, [timeSeriesData]);

  // Simulated real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSeriesData(generateTimeSeriesData());
      setEngagementData(generateEngagementData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const MetricCard = ({ title, value, icon: Icon, trend }) => (
    <div className={`${theme.card} p-6 rounded-xl border ${theme.border} transform hover:scale-105 transition-all duration-300 cursor-pointer`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`${theme.text}`}>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
        </div>
        <Icon className={`${theme.text} opacity-50`} size={24} />
      </div>
      <div className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
        <TrendingUp size={16} />
        <span className="ml-1">{Math.abs(trend)}% vs last week</span>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${theme.card} border-b ${theme.border} p-4 sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-blue-500" />
            <h1 className="text-2xl font-bold">Social Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className={`${theme.card} border ${theme.border} rounded-lg absolute right-4 top-16 w-80 p-4 shadow-lg z-50 transform animate-slideIn`}>
          <h3 className="font-semibold mb-4">Notifications</h3>
          <div className="space-y-3">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`${theme.hover} p-3 rounded-lg transition-colors duration-200`}
              >
                <p className="text-sm">{notification.message}</p>
                <span className="text-xs opacity-50">{notification.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Total Followers" 
            value={timeSeriesData[timeSeriesData.length - 1].followers}
            icon={Users}
            trend={5.2}
          />
          <MetricCard 
            title="Engagement Rate" 
            value={timeSeriesData[timeSeriesData.length - 1].engagement}
            icon={MessageCircle}
            trend={-2.1}
          />
          <MetricCard 
            title="Total Posts" 
            value={timeSeriesData[timeSeriesData.length - 1].posts}
            icon={Share2}
            trend={3.8}
          />
          <MetricCard 
            title="Scheduled Posts" 
            value={12}
            icon={Calendar}
            trend={1.5}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time Series Chart */}
          <div className={`${theme.card} p-6 rounded-xl border ${theme.border}`}>
            <h3 className="text-xl font-semibold mb-4">Growth Analytics</h3>
            <div className="flex gap-4 mb-4">
              {['followers', 'engagement', 'posts'].map(metric => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedMetric === metric 
                      ? 'bg-blue-500 text-white' 
                      : `${theme.hover}`
                  } transition-colors duration-200`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
            <AreaChart
              width={500}
              height={300}
              data={timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#0088FE"
                fillOpacity={1}
                fill="url(#colorMetric)"
              />
            </AreaChart>
          </div>

          {/* Engagement Distribution */}
          <div className={`${theme.card} p-6 rounded-xl border ${theme.border}`}>
            <h3 className="text-xl font-semibold mb-4">Engagement Distribution</h3>
            <PieChart width={500} height={300}>
              <Pie
                data={engagementData}
                cx={250}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <div className="flex justify-center gap-4 mt-4">
              {engagementData.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SocialDashboard;

// Add these styles to your global CSS or Tailwind config
const style = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }
`;