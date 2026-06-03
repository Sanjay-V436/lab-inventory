const db = require('../config/db');

const getAllReturns = async (req, res) => {
  try {
    const {
      search = '',
      sort = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;

    let conditions = ["r.status = 'accepted'"];
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

    const whereClause = 'WHERE ' + conditions.join(' AND ');
    const orderClause = sort === 'oldest'
      ? 'ORDER BY r.created_at ASC'
      : sort === 'return_date'
      ? 'ORDER BY r.return_date ASC'
      : 'ORDER BY r.created_at DESC';

    const query = `
      SELECT 
        r.*,
        CASE WHEN r.return_date < CURRENT_DATE 
          THEN true ELSE false 
        END AS is_overdue
      FROM requests r
      ${whereClause}
      ${orderClause}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(limit, offset);

    const countQuery = `SELECT COUNT(*) FROM requests r ${whereClause}`;
    const countValues = values.slice(0, -2);

    const [returns, countResult] = await Promise.all([
      db.query(query, values),
      db.query(countQuery, countValues)
    ]);

    res.json({
      returns: returns.rows,
      total: Number(countResult.rows[0].count),
      page: Number(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getReturnById = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await db.query(
      `SELECT * FROM requests WHERE id = $1 AND status = 'accepted'`,
      [requestId]
    );

    if (request.rows.length === 0) {
      return res.status(404).json({ error: 'Accepted request not found' });
    }

    const items = await db.query(
      `SELECT 
        ri.id,
        ri.component_id,
        ri.quantity_approved,
        ri.status,
        c.name AS component_name
       FROM request_items ri
       JOIN components c ON ri.component_id = c.id
       WHERE ri.request_id = $1
       AND ri.status = 'approved'`,
      [requestId]
    );

    res.json({ ...request.rows[0], items: items.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const submitReturn = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { remarks, items } = req.body;

    const request = await db.query(
      `SELECT * FROM requests WHERE id = $1 AND status = 'accepted'`,
      [requestId]
    );

    if (request.rows.length === 0) {
      return res.status(404).json({ error: 'Accepted request not found' });
    }

    const newReturn = await db.query(
      `INSERT INTO returns (request_id, remarks) VALUES ($1, $2) RETURNING *`,
      [requestId, remarks || null]
    );

    const returnId = newReturn.rows[0].id;

    for (const item of items) {
      const { request_item_id, condition, remarks: itemRemarks, qty_returned } = item;

      await db.query(
        `INSERT INTO return_items 
          (return_id, request_item_id, condition, remarks)
         VALUES ($1, $2, $3, $4)`,
        [returnId, request_item_id, condition, itemRemarks || null]
      );

      // Add only qty_returned back to stock
      if (qty_returned > 0) {
        await db.query(
          `UPDATE components 
           SET stock = stock + $1
           WHERE id = (
             SELECT component_id FROM request_items WHERE id = $2
           )`,
          [qty_returned, request_item_id]
        );
      }
    }

    await db.query(
      `UPDATE requests SET status = $1 WHERE id = $2`,
      ['returned', requestId]
    );

    res.json({ message: 'Return submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllReturns, getReturnById, submitReturn };