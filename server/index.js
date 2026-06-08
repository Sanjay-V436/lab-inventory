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
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  console.log('API KEY:', process.env.RESEND_API_KEY);
  
  try {
    const result = await resend.emails.send({
      from: 'Lab Inventory <onboarding@resend.dev>',
      to: 'your_gmail@gmail.com',
      subject: 'Test',
      html: '<p>Test email</p>',
    });
    console.log('Resend result:', JSON.stringify(result));
    res.json({ success: true, result });
  } catch (err) {
    console.log('Resend error:', err);
    res.json({ error: err.message });
  }
});
const PORT = process.env.PORT || 5000;
require('./jobs/returnReminder');
require('./jobs/keepAlive');
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});