const express = require('express');
const router = express.Router();

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: 'Leave Request Approved',
    message: 'Your leave request for Feb 1-3 has been approved',
    type: 'success',
    employeeId: 2,
    read: false,
    createdAt: '2024-01-20T10:30:00Z'
  },
  {
    id: 2,
    title: 'New Document Available',
    message: 'Employee Handbook has been updated',
    type: 'info',
    employeeId: 1,
    read: true,
    createdAt: '2024-01-19T14:20:00Z'
  }
];

// Get notifications
router.get('/', (req, res) => {
  try {
    const { employeeId, read } = req.query;
    
    let filteredNotifications = [...notifications];
    
    if (employeeId) {
      filteredNotifications = filteredNotifications.filter(notif => notif.employeeId === parseInt(employeeId));
    }
    
    if (read !== undefined) {
      filteredNotifications = filteredNotifications.filter(notif => notif.read === (read === 'true'));
    }

    res.json({
      success: true,
      data: filteredNotifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

// Mark notification as read
router.put('/:id/read', (req, res) => {
  try {
    const notificationIndex = notifications.findIndex(notif => notif.id === parseInt(req.params.id));
    
    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    notifications[notificationIndex].read = true;
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notifications[notificationIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification'
    });
  }
});

module.exports = router;