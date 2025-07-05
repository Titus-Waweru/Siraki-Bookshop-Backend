const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 👉 STK Push route
app.post('/api/stkpush', async (req, res) => {
  const { phone, amount } = req.body;

  const shortCode = process.env.SHORT_CODE;
  const passkey = process.env.PASSKEY;
  const consumerKey = process.env.CONSUMER_KEY;
  const consumerSecret = process.env.CONSUMER_SECRET;
  const callbackUrl = process.env.CALLBACK_URL;

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

  try {
    // 🔐 Get access token
    const auth = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
      }
    );

    const token = auth.data.access_token;

    // 📲 Send STK Push
    const stkRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: 'SIRAKI_BOOKSHOP',
        TransactionDesc: 'Order Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({
      message: 'STK Push initiated successfully!',
      response: stkRes.data,
    });
  } catch (err) {
    console.error('STK Push Error:', err?.response?.data || err.message);
    res.status(500).json({
      error: 'STK Push failed.',
      details: err?.response?.data || err.message,
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Siraki Bookshop API is running ✅');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
