const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// =====================
// 🔐 Middleware
// =====================
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://siraki-bookshop-frontend.vercel.app'
  ]
}));
app.use(express.json());

// =====================
// 📦 Routes
// =====================
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// =====================
// 💰 MPESA STK Push
// =====================
app.post('/api/mpesa/stkpush', async (req, res) => {
  const { phone, amount } = req.body;

  const {
    SHORT_CODE,
    PASSKEY,
    CONSUMER_KEY,
    CONSUMER_SECRET,
    CALLBACK_URL,
  } = process.env;

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${SHORT_CODE}${PASSKEY}${timestamp}`).toString('base64');

  try {
    // 1️⃣ Get Access Token
    const authResponse = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        auth: {
          username: CONSUMER_KEY,
          password: CONSUMER_SECRET,
        },
      }
    );

    const token = authResponse.data.access_token;

    // 2️⃣ Initiate STK Push
    const stkResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: SHORT_CODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: 'SIRAKI_BOOKSHOP',
        TransactionDesc: 'Order Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json({
      message: '✅ STK Push initiated',
      response: stkResponse.data,
    });
  } catch (err) {
    console.error('❌ STK Push Error:', err?.response?.data || err.message);
    res.status(500).json({
      error: 'STK Push failed',
      details: err?.response?.data || err.message,
    });
  }
});

// =====================
// 🔍 Root route
// =====================
app.get('/', (req, res) => {
  res.send('Siraki Bookshop API is running ✅');
});

// =====================
// 🚀 Start Server
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Siraki API running on: http://localhost:${PORT}`);
});
