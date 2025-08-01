const express = require('express');
const router = express.Router();

// Mock employee data
const employees = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@kickstart.com',
    department: 'IT',
    position: 'System Administrator',
    employeeId: 'EMP001',
    joinDate: '2023-01-15',
    salary: 75000,
    status: 'active',
    phone: '+1-555-0101',
    address: '123 Admin St, Tech City, TC 12345'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'employee@kickstart.com',
    department: 'Engineering',
    position: 'Software Engineer',
    employeeId: 'EMP002',
    joinDate: '2023-03-20',
    salary: 65000,
    status: 'active',
    phone: '+1-555-0102',
    address: '456 Engineer Ave, Code City, CC 67890'
  },
  {
    id: 3,
    name: 'Jane Smith',
    email: 'jane.smith@kickstart.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    employeeId: 'EMP003',
    joinDate: '2023-02-10',
    salary: 70000,
    status: 'active',
    phone: '+1-555-0103',
    address: '789 Market Blvd, Brand Town, BT 11111'
  }
];

// Get all employees
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employees'
    });
  }
});

// Get employee by ID
router.get('/:id', (req, res) => {
  try {
    const employee = employees.find(emp => emp.id === parseInt(req.params.id));
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employee'
    });
  }
});

// Update employee
router.put('/:id', (req, res) => {
  try {
    const employeeIndex = employees.findIndex(emp => emp.id === parseInt(req.params.id));
    
    if (employeeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const updatedEmployee = {
      ...employees[employeeIndex],
      ...req.body,
      id: parseInt(req.params.id) // Ensure ID doesn't change
    };

    employees[employeeIndex] = updatedEmployee;

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating employee'
    });
  }
});

// Get employee statistics
router.get('/stats/overview', (req, res) => {
  try {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const departments = [...new Set(employees.map(emp => emp.department))];
    
    const departmentStats = departments.map(dept => ({
      department: dept,
      count: employees.filter(emp => emp.department === dept).length
    }));

    const avgSalary = employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length;

    res.json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        departments: departmentStats,
        averageSalary: Math.round(avgSalary)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

module.exports = router;