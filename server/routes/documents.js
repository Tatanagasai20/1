const express = require('express');
const router = express.Router();

// Mock documents data
const documents = [
  {
    id: 1,
    name: 'Employee Handbook',
    type: 'PDF',
    size: '2.5 MB',
    uploadedBy: 'Admin User',
    uploadDate: '2024-01-15',
    category: 'HR Documents',
    url: '/documents/employee-handbook.pdf'
  },
  {
    id: 2,
    name: 'Company Policy',
    type: 'PDF',
    size: '1.8 MB',
    uploadedBy: 'Admin User',
    uploadDate: '2024-01-10',
    category: 'HR Documents',
    url: '/documents/company-policy.pdf'
  }
];

// Get all documents
router.get('/', (req, res) => {
  try {
    const { category, type } = req.query;
    
    let filteredDocuments = [...documents];
    
    if (category) {
      filteredDocuments = filteredDocuments.filter(doc => doc.category === category);
    }
    
    if (type) {
      filteredDocuments = filteredDocuments.filter(doc => doc.type === type);
    }

    res.json({
      success: true,
      data: filteredDocuments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching documents'
    });
  }
});

// Upload document
router.post('/', (req, res) => {
  try {
    const { name, type, size, uploadedBy, category } = req.body;
    
    const newDocument = {
      id: documents.length + 1,
      name,
      type,
      size,
      uploadedBy,
      uploadDate: new Date().toISOString().split('T')[0],
      category,
      url: `/documents/${name.toLowerCase().replace(/\s+/g, '-')}.${type.toLowerCase()}`
    };
    
    documents.push(newDocument);
    
    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: newDocument
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading document'
    });
  }
});

module.exports = router;