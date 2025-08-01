import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  Calendar, 
  Users, 
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { attendanceAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Attendance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: attendanceRecords, isLoading } = useQuery(
    ['attendance', selectedDate],
    () => attendanceAPI.getAll({ date: selectedDate })
  );

  const { data: attendanceStats } = useQuery('attendanceStats', attendanceAPI.getStats);

  const clockInMutation = useMutation(attendanceAPI.clockIn, {
    onSuccess: () => {
      queryClient.invalidateQueries('attendance');
      queryClient.invalidateQueries('attendanceStats');
      toast.success('Clock in successful!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Clock in failed');
    }
  });

  const clockOutMutation = useMutation(attendanceAPI.clockOut, {
    onSuccess: () => {
      queryClient.invalidateQueries('attendance');
      queryClient.invalidateQueries('attendanceStats');
      toast.success('Clock out successful!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Clock out failed');
    }
  });

  const handleClockIn = () => {
    clockInMutation.mutate({
      employeeId: user.id,
      employeeName: user.name
    });
  };

  const handleClockOut = () => {
    clockOutMutation.mutate({
      employeeId: user.id
    });
  };

  const getCurrentStatus = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendanceRecords?.data?.find(record => 
      record.employeeId === user.id && record.date === today
    );
    
    if (!todayRecord) return 'not-clocked';
    if (todayRecord.clockOut) return 'clocked-out';
    return 'clocked-in';
  };

  const currentStatus = getCurrentStatus();

  const stats = [
    {
      name: 'Present Today',
      value: attendanceStats?.data?.todayPresent || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+2'
    },
    {
      name: 'Absent Today',
      value: attendanceStats?.data?.todayAbsent || 0,
      icon: XCircle,
      color: 'bg-red-500',
      change: '-1'
    },
    {
      name: 'Average Hours',
      value: `${attendanceStats?.data?.averageHours || 0}h`,
      icon: Clock,
      color: 'bg-blue-500',
      change: '+0.5h'
    },
    {
      name: 'Total Records',
      value: attendanceStats?.data?.totalRecords || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: '+12'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600">Track employee attendance and working hours</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Clock In/Out Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Today's Attendance</h3>
            <p className="text-gray-600">{format(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
          </div>
          
          <div className="flex space-x-4">
            {currentStatus === 'not-clocked' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClockIn}
                disabled={clockInMutation.isLoading}
                className="btn-primary flex items-center"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {clockInMutation.isLoading ? 'Clocking In...' : 'Clock In'}
              </motion.button>
            )}
            
            {currentStatus === 'clocked-in' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClockOut}
                disabled={clockOutMutation.isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {clockOutMutation.isLoading ? 'Clocking Out...' : 'Clock Out'}
              </motion.button>
            )}
            
            {currentStatus === 'clocked-out' && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Completed for today</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Status */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Status</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentStatus === 'not-clocked' && 'Not Clocked In'}
                {currentStatus === 'clocked-in' && 'Currently Working'}
                {currentStatus === 'clocked-out' && 'Work Day Complete'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentStatus === 'not-clocked' ? 'bg-yellow-100 text-yellow-800' :
              currentStatus === 'clocked-in' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {currentStatus === 'not-clocked' && 'Pending'}
              {currentStatus === 'clocked-in' && 'Active'}
              {currentStatus === 'clocked-out' && 'Complete'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Date Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
        </div>
      </motion.div>

      {/* Attendance Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Records</h3>
        
        {attendanceRecords?.data?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.data.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {record.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.employeeName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(record.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.clockIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.clockOut || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.totalHours ? `${record.totalHours}h` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
            <p className="text-gray-600">No attendance data found for the selected date.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Attendance;