const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await db.any('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// POST a new order
router.post('/', async (req, res) => {
  const {
    customer_name,
    phone,
    email,
    location,
    items, // array of products
    total_amount,
    payment_method,
    delivery_method
  } = req.body;

  try {
    await db.none(
      `INSERT INTO orders 
      (customer_name, phone, email, location, items, total_amount, payment_method, delivery_method) 
      VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8)`,
      [
        customer_name,
        phone,
        email,
        location,
        JSON.stringify(items), // Convert JS array to JSON string
        total_amount,
        payment_method,
        delivery_method
      ]
    );
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
});

module.exports = router;
