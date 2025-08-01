import React from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { 
  employeesAPI, 
  attendanceAPI, 
  leaveAPI, 
  payrollAPI,
  notificationsAPI 
} from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: employeeStats } = useQuery('employeeStats', employeesAPI.getStats);
  const { data: attendanceStats } = useQuery('attendanceStats', attendanceAPI.getStats);
  const { data: payrollStats } = useQuery('payrollStats', payrollAPI.getStats);
  const { data: notifications } = useQuery('notifications', () => 
    notificationsAPI.getAll({ employeeId: user?.id, read: false })
  );

  const stats = [
    {
      name: 'Total Employees',
      value: employeeStats?.data?.totalEmployees || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      name: 'Present Today',
      value: attendanceStats?.data?.todayPresent || 0,
      icon: Clock,
      color: 'bg-green-500',
      change: '+1.2%',
      changeType: 'positive'
    },
    {
      name: 'Leave Requests',
      value: 3,
      icon: Calendar,
      color: 'bg-yellow-500',
      change: '-0.8%',
      changeType: 'negative'
    },
    {
      name: 'Total Payroll',
      value: `$${(payrollStats?.data?.totalSalary / 1000).toFixed(0)}k`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+5.2%',
      changeType: 'positive'
    }
  ];

  const departmentData = employeeStats?.data?.departments?.map(dept => ({
    name: dept.department,
    value: dept.count
  })) || [];

  const attendanceData = [
    { name: 'Present', value: attendanceStats?.data?.todayPresent || 0, color: '#10B981' },
    { name: 'Absent', value: attendanceStats?.data?.todayAbsent || 0, color: '#EF4444' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'success',
      message: 'John Doe clocked in at 9:00 AM',
      time: '2 hours ago',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'warning',
      message: 'Leave request pending for Jane Smith',
      time: '4 hours ago',
      icon: AlertCircle
    },
    {
      id: 3,
      type: 'error',
      message: 'Mike Johnson marked as absent',
      time: '6 hours ago',
      icon: XCircle
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Attendance Today */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Today</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {attendanceData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-100' :
                activity.type === 'warning' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <activity.icon className={`w-4 h-4 ${
                  activity.type === 'success' ? 'text-green-600' :
                  activity.type === 'warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;