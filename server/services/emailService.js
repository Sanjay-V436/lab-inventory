const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM = 'rhisclab@gmail.com';

// 1. Email to student — request submitted
const sendRequestSubmittedEmail = async (student, refId, items) => {
  const itemRows = items.map(item =>
    `<tr>
      <td style="padding:8px;border:1px solid #eee">${item.name}</td>
      <td style="padding:8px;border:1px solid #eee;text-align:center">${item.quantity}</td>
    </tr>`
  ).join('');

  await sgMail.send({
    from: FROM,
    to: student.email,
    subject: `Request Submitted — ${refId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#9B1B4B">Request Submitted Successfully</h2>
        <p>Dear <b>${student.name}</b>,</p>
        <p>Your component request has been submitted. Here are the details:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;border:1px solid #eee;text-align:left">Component</th>
              <th style="padding:8px;border:1px solid #eee">Qty Requested</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p><b>Reference ID:</b> ${refId}</p>
        <p><b>Return Date:</b> ${student.return_date}</p>
        <p style="color:#888;font-size:13px">You will receive another email once your request is reviewed.</p>
      </div>
    `,
  });
};

// 2. Email to lab assistant — new request notification
const sendNewRequestToAdmin = async (student, refId, items) => {
  const itemRows = items.map(item =>
    `<tr>
      <td style="padding:8px;border:1px solid #eee">${item.name}</td>
      <td style="padding:8px;border:1px solid #eee;text-align:center">${item.quantity}</td>
    </tr>`
  ).join('');

  await sgMail.send({
    from: FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Request — ${refId} from ${student.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#9B1B4B">New Component Request</h2>
        <p><b>Student:</b> ${student.name}</p>
        <p><b>Roll No:</b> ${student.roll_no}</p>
        <p><b>Department:</b> ${student.department}</p>
        <p><b>Mentor:</b> ${student.mentor_name}</p>
        <p><b>Email:</b> ${student.email}</p>
        <p><b>Return Date:</b> ${student.return_date}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;border:1px solid #eee;text-align:left">Component</th>
              <th style="padding:8px;border:1px solid #eee">Qty Requested</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p><b>Reference ID:</b> ${refId}</p>
      </div>
    `,
  });
};

// 3. Email to student — request accepted
const sendRequestAcceptedEmail = async (studentEmail, studentName, refId, items) => {
  const itemRows = items.map(item =>
    `<tr>
      <td style="padding:8px;border:1px solid #eee">${item.component_name}</td>
      <td style="padding:8px;border:1px solid #eee;text-align:center">${item.quantity_requested}</td>
      <td style="padding:8px;border:1px solid #eee;text-align:center">
        <b style="color:${item.status === 'approved' ? 'green' : 'red'}">
          ${item.status === 'approved' ? item.quantity_approved : 'Declined'}
        </b>
      </td>
    </tr>`
  ).join('');

  await sgMail.send({
    from: FROM,
    to: studentEmail,
    subject: `Request Accepted — ${refId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#9B1B4B">Your Request Has Been Accepted</h2>
        <p>Dear <b>${studentName}</b>,</p>
        <p>Your component request <b>${refId}</b> has been reviewed. Here are the details:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;border:1px solid #eee;text-align:left">Component</th>
              <th style="padding:8px;border:1px solid #eee">Requested</th>
              <th style="padding:8px;border:1px solid #eee">Approved</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p style="color:#888;font-size:13px">Please collect your components from the lab.</p>
      </div>
    `,
  });
};

// 4. Email to student — return reminder
const sendReturnReminderEmail = async (studentEmail, studentName, refId, returnDate, items) => {
  const itemRows = items.map(item =>
    `<tr>
      <td style="padding:8px;border:1px solid #eee">${item.component_name}</td>
      <td style="padding:8px;border:1px solid #eee;text-align:center">${item.quantity_approved}</td>
    </tr>`
  ).join('');

  await sgMail.send({
    from: FROM,
    to: studentEmail,
    subject: `Return Reminder — ${refId} due ${returnDate}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#e65c00">Return Reminder</h2>
        <p>Dear <b>${studentName}</b>,</p>
        <p>This is a reminder that the following components are due for return on <b>${returnDate}</b>:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;border:1px solid #eee;text-align:left">Component</th>
              <th style="padding:8px;border:1px solid #eee">Qty</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p><b>Reference ID:</b> ${refId}</p>
        <p style="color:red;font-size:13px">Please return the components on time.</p>
      </div>
    `,
  });
};

module.exports = {
  sendRequestSubmittedEmail,
  sendNewRequestToAdmin,
  sendRequestAcceptedEmail,
  sendReturnReminderEmail,
};