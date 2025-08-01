const express = require('express');
const router = express.Router();

// Mock attendance data
const attendanceRecords = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Admin User',
    date: '2024-01-15',
    clockIn: '09:00:00',
    clockOut: '17:00:00',
    totalHours: 8,
    status: 'present'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'John Doe',
    date: '2024-01-15',
    clockIn: '08:45:00',
    clockOut: '17:30:00',
    totalHours: 8.75,
    status: 'present'
  },
  {
    id: 3,
    employeeId: 1,
    employeeName: 'Admin User',
    date: '2024-01-16',
    clockIn: '09:15:00',
    clockOut: null,
    totalHours: null,
    status: 'present'
  }
];

// Get attendance records
router.get('/', (req, res) => {
  try {
    const { employeeId, date, startDate, endDate } = req.query;
    
    let filteredRecords = [...attendanceRecords];
    
    if (employeeId) {
      filteredRecords = filteredRecords.filter(record => record.employeeId === parseInt(employeeId));
    }
    
    if (date) {
      filteredRecords = filteredRecords.filter(record => record.date === date);
    }
    
    if (startDate && endDate) {
      filteredRecords = filteredRecords.filter(record => 
        record.date >= startDate && record.date <= endDate
      );
    }

    res.json({
      success: true,
      data: filteredRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records'
    });
  }
});

// Clock in
router.post('/clock-in', (req, res) => {
  try {
    const { employeeId, employeeName } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    // Check if already clocked in today
    const existingRecord = attendanceRecords.find(record => 
      record.employeeId === parseInt(employeeId) && record.date === today
    );
    
    if (existingRecord && existingRecord.clockOut === null) {
      return res.status(400).json({
        success: false,
        message: 'Already clocked in today'
      });
    }
    
    const newRecord = {
      id: attendanceRecords.length + 1,
      employeeId: parseInt(employeeId),
      employeeName,
      date: today,
      clockIn: currentTime,
      clockOut: null,
      totalHours: null,
      status: 'present'
    };
    
    attendanceRecords.push(newRecord);
    
    res.status(201).json({
      success: true,
      message: 'Clock in successful',
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clocking in'
    });
  }
});

// Clock out
router.post('/clock-out', (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    const recordIndex = attendanceRecords.findIndex(record => 
      record.employeeId === parseInt(employeeId) && record.date === today && record.clockOut === null
    );
    
    if (recordIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'No active clock-in record found'
      });
    }
    
    const record = attendanceRecords[recordIndex];
    const clockInTime = new Date(`2000-01-01T${record.clockIn}`);
    const clockOutTime = new Date(`2000-01-01T${currentTime}`);
    const totalHours = (clockOutTime - clockInTime) / (1000 * 60 * 60);
    
    record.clockOut = currentTime;
    record.totalHours = Math.round(totalHours * 100) / 100;
    
    res.json({
      success: true,
      message: 'Clock out successful',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clocking out'
    });
  }
});

// Get attendance statistics
router.get('/stats', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendanceRecords.filter(record => record.date === today);
    
    const presentCount = todayRecords.filter(record => record.status === 'present').length;
    const absentCount = 3 - presentCount; // Assuming 3 total employees
    
    const avgHours = todayRecords.length > 0 
      ? todayRecords.reduce((sum, record) => sum + (record.totalHours || 0), 0) / todayRecords.length
      : 0;
    
    res.json({
      success: true,
      data: {
        todayPresent: presentCount,
        todayAbsent: absentCount,
        averageHours: Math.round(avgHours * 100) / 100,
        totalRecords: attendanceRecords.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance statistics'
    });
  }
});

module.exports = router;