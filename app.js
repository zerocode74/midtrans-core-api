require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const midtrans = require('./midtrans');

const app = express();
const port = process.env.PORT || 7860;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.set('json spaces', 2);

// Route publik
app.get('/', async (req, res) => {
  const response = {
    status: 200,
    message: "Hello from backend, this is midtrans callback api for Zerocode",
    author: "DitzzyAF",
    web: "https://zerocode.my.id" 
  };
  res.json(response);
});

// POST /api/pay
app.post('/api/pay', async (req, res) => {
  try {
    const { amount, trxid } = req.body;
    if (!amount || !trxid) {
      return res.status(400).json({ success: false, message: 'amount & trxid wajib diisi' });
    }
    const response = await midtrans.create(amount, trxid);
    res.json(response);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan', error: err.message });
  }
});

// GET /api/pay/:trxid
app.get('/api/pay/:trxid', async (req, res) => {
  try {
    const { trxid } = req.params;
    const response = await midtrans.status(trxid);
    res.json(response);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil status transaksi', error: err.message });
  }
});

// POST /api/pay/callback
app.post('/api/pay/callback', async (req, res) => {
  try {
    const notification = req.body;
    const response = await midtrans.callback(notification);
    res.json(response);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Callback gagal diproses', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});