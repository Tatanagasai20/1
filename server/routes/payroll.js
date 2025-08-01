const express = require('express');
const router = express.Router();

// Mock payroll data
const payrollRecords = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Admin User',
    month: '2024-01',
    basicSalary: 75000,
    allowances: 5000,
    deductions: 2000,
    netSalary: 78000,
    status: 'paid',
    paymentDate: '2024-01-31'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'John Doe',
    month: '2024-01',
    basicSalary: 65000,
    allowances: 3000,
    deductions: 1500,
    netSalary: 66500,
    status: 'paid',
    paymentDate: '2024-01-31'
  }
];

// Get payroll records
router.get('/', (req, res) => {
  try {
    const { employeeId, month, status } = req.query;
    
    let filteredRecords = [...payrollRecords];
    
    if (employeeId) {
      filteredRecords = filteredRecords.filter(record => record.employeeId === parseInt(employeeId));
    }
    
    if (month) {
      filteredRecords = filteredRecords.filter(record => record.month === month);
    }
    
    if (status) {
      filteredRecords = filteredRecords.filter(record => record.status === status);
    }

    res.json({
      success: true,
      data: filteredRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payroll records'
    });
  }
});

// Get payroll statistics
router.get('/stats', (req, res) => {
  try {
    const totalSalary = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
    const avgSalary = totalSalary / payrollRecords.length;
    const paidCount = payrollRecords.filter(record => record.status === 'paid').length;
    
    res.json({
      success: true,
      data: {
        totalSalary: Math.round(totalSalary),
        averageSalary: Math.round(avgSalary),
        paidRecords: paidCount,
        totalRecords: payrollRecords.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payroll statistics'
    });
  }
});

module.exports = router;