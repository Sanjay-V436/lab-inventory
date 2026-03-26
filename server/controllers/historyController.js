const db = require('../config/db');

// GET all completed requests (returned + declined)
const getAllHistory = async (req, res) => {
  try {
    const {
      search = '',
      status = 'all',
      sort = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;

    let conditions = ["r.status IN ('returned', 'declined')"];
    let values = [];
    let paramCount = 1;

    if (search) {
      conditions.push(
        `(r.student_name ILIKE $${paramCount} 
        OR r.roll_no ILIKE $${paramCount} 
        OR r.ref_id ILIKE $${paramCount})`
      );
      values.push(`%${search}%`);
      paramCount++;
    }

    if (status !== 'all') {
      conditions.push(`r.status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    const whereClause = 'WHERE ' + conditions.join(' AND ');

    const orderClause = sort === 'oldest'
      ? 'ORDER BY r.created_at ASC'
      : sort === 'return_date'
      ? 'ORDER BY r.return_date ASC'
      : 'ORDER BY r.created_at DESC';

    const query = `
      SELECT 
        r.*,
        ret.submitted_at AS completed_on
      FROM requests r
      LEFT JOIN returns ret ON r.id = ret.request_id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) FROM requests r ${whereClause}
    `;
    const countValues = values.slice(0, -2);

    const [history, countResult] = await Promise.all([
      db.query(query, values),
      db.query(countQuery, countValues)
    ]);

    res.json({
      history: history.rows,
      total: Number(countResult.rows[0].count),
      page: Number(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET single history detail
const getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get request
    const request = await db.query(
      `SELECT r.*, ret.submitted_at AS completed_on, ret.remarks AS return_remarks
       FROM requests r
       LEFT JOIN returns ret ON r.id = ret.request_id
       WHERE r.id = $1
       AND r.status IN ('returned', 'declined')`,
      [id]
    );

    if (request.rows.length === 0) {
      return res.status(404).json({ error: 'History record not found' });
    }

    // Get request items
    const items = await db.query(
      `SELECT 
        ri.id,
        ri.component_id,
        ri.quantity_requested,
        ri.quantity_approved,
        ri.status,
        c.name AS component_name,
        reti.condition,
        reti.remarks AS item_remarks
       FROM request_items ri
       JOIN components c ON ri.component_id = c.id
       LEFT JOIN return_items reti ON ri.id = reti.request_item_id
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

module.exports = {
  getAllHistory,
  getHistoryById
};