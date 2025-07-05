const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await db.any('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Add a product
router.post('/', async (req, res) => {
  const { name, category, description, price, imageUrl, stock } = req.body;
  try {
    await db.none(
      'INSERT INTO products(name, category, description, price, imageurl, stock) VALUES($1, $2, $3, $4, $5, $6)',
      [name, category, description, price, imageUrl, stock]
    );
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
});

module.exports = router;
