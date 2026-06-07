const https = require('https');

// Ping server every 14 minutes to prevent sleep
setInterval(() => {
  https.get('https://lab-inventory-nz77.onrender.com', (res) => {
    console.log('Keep-alive ping:', res.statusCode);
  }).on('error', (err) => {
    console.log('Keep-alive error:', err.message);
  });
}, 14 * 60 * 1000); // 14 minutes