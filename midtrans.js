require('dotenv').config();
const midtransClient = require('midtrans-client');

const core = new midtransClient.CoreApi({
  isProduction: process.env.PRODUCTION,
  serverKey: process.env.SERVER_KEY,
  clientKey: process.env.CLIENT_KEY
});

async function create(amount, trxid) {
  try {
    const transactionData = {
      payment_type: "qris",
      transaction_details: {
        order_id: trxid,
        gross_amount: amount,
      },
    };
    const charge = await core.charge(transactionData);
    return charge;
  } catch (error) {
    console.error("Error creating transaction:", error);
    return error.ApiResponse;
  }
}

async function status(trxid) {
  try {
    const data = await core.transaction.status(trxid);
    return data;
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    return error.ApiResponse;
  }
}
async function cancel(trxid) {
  try {
    const data = await core.transaction.cancel(trxid)
    return data;
  } catch (error) {
    console.error("Error fetching cancel status:", error);
    return error.ApiResponse;
  }
}

async function callback(notificationJson) {
  try {
    const statusResponse = await core.transaction.notification(notificationJson);
    const { order_id, transaction_status, fraud_status } = statusResponse;

    console.log(
      `Transaction notification received. Order ID: ${order_id}. ` +
      `Transaction status: ${transaction_status}. Fraud status: ${fraud_status}`
    );

    switch (transaction_status) {
      case 'settlement':
        return { success: true, message: "Transaction settled successfully" };
      case 'deny':
        return { success: false, message: "Transaction denied" };
      case 'cancel':
      case 'expire':
        return { success: false, message: "Transaction cancelled or expired" };
      case 'pending':
        return { success: false, message: "Transaction is pending" };
      default:
        return { success: false, message: `Unknown status: ${transaction_status}` };
    }
  } catch (error) {
    console.error("Error handling callback:", error);
    return error.ApiResponse;
  }
}

module.exports = {
  create,
  cancel,
  status,
  callback
};