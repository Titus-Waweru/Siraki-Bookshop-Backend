const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await db.any('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

module.exports = router;
