const db = require('../config/db');

// GET all components (flat list)
const getAllComponents = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM components ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET single component
const getComponentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM components WHERE id = $1', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST create new component
const createComponent = async (req, res) => {
  try {
    const { parent_id, name, stock } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await db.query(
      'INSERT INTO components (parent_id, name, stock) VALUES ($1, $2, $3) RETURNING *',
      [parent_id || null, name, stock || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT update component
const updateComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stock } = req.body;

    const result = await db.query(
      'UPDATE components SET name = $1, stock = $2 WHERE id = $3 RETURNING *',
      [name, stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE component
const deleteComponent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if component has active request items
    const activeRequests = await db.query(
      `SELECT ri.id FROM request_items ri
       JOIN requests r ON ri.request_id = r.id
       WHERE ri.component_id = $1 
       AND r.status IN ('pending', 'accepted')`,
      [id]
    );

    if (activeRequests.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete component with active requests' 
      });
    }

    await db.query('DELETE FROM components WHERE id = $1', [id]);
    res.json({ message: 'Component deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent
};