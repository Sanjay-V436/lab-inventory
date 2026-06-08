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
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  console.log('BREVO_USER:', process.env.BREVO_USER);
  console.log('BREVO_PASS:', process.env.BREVO_PASS ? 'exists' : 'MISSING');

  try {
    const result = await transporter.sendMail({
      from: '"Lab Inventory" <sanjayvenkat436@gmail.com>',
      to: 'sanjayvenkat436@gmail.com',
      subject: 'Test Email',
      html: '<p>Test</p>',
    });
    console.log('Email result:', result);
    res.json({ success: true, result });
  } catch (err) {
    console.log('Email error:', err.message);
    res.json({ error: err.message });
  }
});
const PORT = process.env.PORT || 5000;
require('./jobs/returnReminder');
require('./jobs/keepAlive');
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});