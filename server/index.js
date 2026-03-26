const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});