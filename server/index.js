const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
// Files stored on Cloudinary — no local /uploads needed

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Lab Inventory Server is running' });
});

// Routes (we will add these one by one)
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/components', require('./routes/components'));
app.use('/api/requests',   require('./routes/requests'));
app.use('/api/returns',    require('./routes/returns'));
app.use('/api/history',    require('./routes/history'));
// app.use('/api/purchases',  require('./routes/purchases'));
app.get('/test-email', async (req, res) => {
  const { sendRequestSubmittedEmail } = require('./services/emailService');
  try {
    await sendRequestSubmittedEmail(
      { name: 'Test', email: 'ch.en.u4cce23041@ch.students.amrita.edu', roll_no: '123', department: 'CSE', mentor_name: 'Prof X', return_date: '2026-06-10' },
      'LAB-TEST-001',
      [{ name: 'Arduino', quantity: 2 }]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ error: err.message });
  }
});
const PORT = process.env.PORT || 5000;
require('./jobs/returnReminder');
require('./jobs/keepAlive');
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});