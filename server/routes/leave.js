const express = require('express');
const router = express.Router();

// Mock leave data
const leaveRequests = [
  {
    id: 1,
    employeeId: 2,
    employeeName: 'John Doe',
    leaveType: 'Annual Leave',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    days: 3,
    reason: 'Family vacation',
    status: 'approved',
    approvedBy: 'Admin User',
    appliedDate: '2024-01-20'
  },
  {
    id: 2,
    employeeId: 3,
    employeeName: 'Jane Smith',
    leaveType: 'Sick Leave',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    days: 2,
    reason: 'Not feeling well',
    status: 'pending',
    approvedBy: null,
    appliedDate: '2024-01-24'
  }
];

// Get all leave requests
router.get('/', (req, res) => {
  try {
    const { employeeId, status } = req.query;
    
    let filteredRequests = [...leaveRequests];
    
    if (employeeId) {
      filteredRequests = filteredRequests.filter(req => req.employeeId === parseInt(employeeId));
    }
    
    if (status) {
      filteredRequests = filteredRequests.filter(req => req.status === status);
    }

    res.json({
      success: true,
      data: filteredRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave requests'
    });
  }
});

// Create leave request
router.post('/', (req, res) => {
  try {
    const { employeeId, employeeName, leaveType, startDate, endDate, reason } = req.body;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    const newRequest = {
      id: leaveRequests.length + 1,
      employeeId: parseInt(employeeId),
      employeeName,
      leaveType,
      startDate,
      endDate,
      days,
      reason,
      status: 'pending',
      approvedBy: null,
      appliedDate: new Date().toISOString().split('T')[0]
    };
    
    leaveRequests.push(newRequest);
    
    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: newRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting leave request'
    });
  }
});

// Approve/reject leave request
router.put('/:id/status', (req, res) => {
  try {
    const { status, approvedBy } = req.body;
    const requestIndex = leaveRequests.findIndex(req => req.id === parseInt(req.params.id));
    
    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }
    
    leaveRequests[requestIndex].status = status;
    leaveRequests[requestIndex].approvedBy = approvedBy;
    
    res.json({
      success: true,
      message: `Leave request ${status}`,
      data: leaveRequests[requestIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating leave request'
    });
  }
});

module.exports = router;