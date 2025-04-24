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
app.set('json spaces', 2); // atau gunakan jsonSpaces langsung


app.get('/', async (req, res) => {
  const response = {
    status: 200,
	message: "Hello from backend, this is midtrans callback api for Zerocode",
    author: "DitzzyAF",
    web: "https://zerocode.my.id" 
  }
  res.json(response);
});


app.post('/api/pay', async (req, res) => {
  const { amount, trxid } = req.body;
  if (!amount || !trxid) {
    return res.status(400).json({ success: false, message: 'amount & trxid wajib diisi' });
  }
  const response = await midtrans.create(amount, trxid);
  res.json(response);
});

// Cek status transaksi
app.get('/api/pay/:trxid', async (req, res) => {
  const { trxid } = req.params;
  const response = await midtrans.status(trxid);
  res.json(response);
});

// Callback Midtrans
app.post('/api/pay/callback', async (req, res) => {
  const notification = req.body;
  const response = await midtrans.callback(notification);
  res.json(response);
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});