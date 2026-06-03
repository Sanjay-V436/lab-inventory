const cron = require('node-cron');
const db = require('../config/db');
const { sendReturnReminderEmail } = require('../services/emailService');

// Runs every day at 8:00 AM
cron.schedule('0 8 * * *', async () => {
  console.log('Running return reminder job...');
  try {
    // Get all accepted requests where return_date is tomorrow
    const result = await db.query(
      `SELECT r.*, 
        json_agg(json_build_object(
          'component_name', c.name,
          'quantity_approved', ri.quantity_approved
        )) as items
       FROM requests r
       JOIN request_items ri ON ri.request_id = r.id
       JOIN components c ON c.id = ri.component_id
       WHERE r.status = 'accepted'
       AND r.return_date = CURRENT_DATE + INTERVAL '1 day'
       AND ri.status = 'approved'
       GROUP BY r.id`
    );

    for (const row of result.rows) {
      await sendReturnReminderEmail(
        row.email,
        row.student_name,
        row.ref_id,
        row.return_date.toISOString().split('T')[0],
        row.items
      ).catch(console.error);
    }

    console.log(`Reminders sent: ${result.rows.length}`);
  } catch (err) {
    console.error('Reminder job error:', err.message);
  }
});