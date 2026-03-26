const db = require('../config/db');

// Generate unique ref ID
const generateRefId = async () => {
  const year = new Date().getFullYear();
  const result = await db.query('SELECT COUNT(*) FROM requests');
  const count = Number(result.rows[0].count) + 1;
  return `LAB-${year}-${String(count).padStart(4, '0')}`;
};

// GET all requests (with search, filter, sort, pagination)
const getAllRequests = async (req, res) => {
  try {
    const {
      search = '',
      status = 'all',
      sort = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;

    let conditions = [];
    let values = [];
    let paramCount = 1;

    if (search) {
      conditions.push(
        `(student_name ILIKE $${paramCount} 
        OR roll_no ILIKE $${paramCount} 
        OR ref_id ILIKE $${paramCount})`
      );
      values.push(`%${search}%`);
      paramCount++;
    }

    if (status !== 'all') {
      conditions.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    const whereClause = conditions.length > 0
      ? 'WHERE ' + conditions.join(' AND ')
      : '';

    const orderClause = sort === 'oldest'
      ? 'ORDER BY created_at ASC'
      : sort === 'return_date'
      ? 'ORDER BY return_date ASC'
      : 'ORDER BY created_at DESC';

    const query = `
      SELECT * FROM requests
      ${whereClause}
      ${orderClause}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) FROM requests ${whereClause}
    `;
    const countValues = values.slice(0, -2);

    const [requests, countResult] = await Promise.all([
      db.query(query, values),
      db.query(countQuery, countValues)
    ]);

    res.json({
      requests: requests.rows,
      total: Number(countResult.rows[0].count),
      page: Number(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET single request with items and stock
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await db.query(
      'SELECT * FROM requests WHERE id = $1', [id]
    );

    if (request.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const items = await db.query(
      `SELECT 
        ri.id,
        ri.component_id,
        ri.quantity_requested,
        ri.quantity_approved,
        ri.status,
        c.name AS component_name,
        c.stock AS available_stock
       FROM request_items ri
       JOIN components c ON ri.component_id = c.id
       WHERE ri.request_id = $1`,
      [id]
    );

    res.json({
      ...request.rows[0],
      items: items.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST create new request (student form submission)
const createRequest = async (req, res) => {
  try {
    const {
      student_name,
      roll_no,
      mentor_name,
      email,
      department,
      return_date,
      items
    } = req.body;

    const letter_proof = req.file ? req.file.filename : null;

    // Validate required fields
    if (!student_name || !roll_no || !mentor_name || 
        !email || !return_date || !items) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Parse items if sent as string
    const parsedItems = typeof items === 'string' 
      ? JSON.parse(items) 
      : items;

    if (parsedItems.length === 0) {
      return res.status(400).json({ error: 'At least one component is required' });
    }

    // Generate ref ID
    const ref_id = await generateRefId();

    // Save request
    const newRequest = await db.query(
      `INSERT INTO requests 
        (ref_id, student_name, roll_no, mentor_name, email, department, return_date, letter_proof)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [ref_id, student_name, roll_no, mentor_name, 
       email, department, return_date, letter_proof]
    );

    const requestId = newRequest.rows[0].id;

    // Save request items
    for (const item of parsedItems) {
      await db.query(
        `INSERT INTO request_items 
          (request_id, component_id, quantity_requested)
         VALUES ($1, $2, $3)`,
        [requestId, item.component_id, item.quantity]
      );
    }

    res.status(201).json({
      message: 'Request submitted successfully',
      ref_id,
      request: newRequest.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH accept request
const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    // Check request exists and is pending
    const request = await db.query(
      'SELECT * FROM requests WHERE id = $1', [id]
    );
    if (request.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    if (request.rows[0].status !== 'pending') {
      return res.status(400).json({ error: 'Request is no longer pending' });
    }

    // Update each item and deduct stock
    for (const item of items) {
      const { request_item_id, status, quantity_approved } = item;

      await db.query(
        `UPDATE request_items 
         SET status = $1, quantity_approved = $2 
         WHERE id = $3`,
        [status, quantity_approved || 0, request_item_id]
      );

      // Only deduct stock for approved items
      if (status === 'approved' && quantity_approved > 0) {
        await db.query(
          `UPDATE components 
           SET stock = stock - $1 
           WHERE id = (
             SELECT component_id FROM request_items WHERE id = $2
           )`,
          [quantity_approved, request_item_id]
        );
      }
    }

    // Update request status
    await db.query(
      'UPDATE requests SET status = $1 WHERE id = $2',
      ['accepted', id]
    );

    res.json({ message: 'Request accepted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH decline request
const declineRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await db.query(
      'SELECT * FROM requests WHERE id = $1', [id]
    );
    if (request.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    if (request.rows[0].status !== 'pending') {
      return res.status(400).json({ error: 'Request is no longer pending' });
    }

    await db.query(
      'UPDATE requests SET status = $1 WHERE id = $2',
      ['declined', id]
    );

    res.json({ message: 'Request declined successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  acceptRequest,
  declineRequest
};