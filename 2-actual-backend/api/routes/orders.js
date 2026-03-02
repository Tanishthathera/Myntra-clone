// const express = require('express');
// const router = express.Router();
// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const redis = require('redis'); 
// const { Queue } = require('bullmq');

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Redis Connection & Queue Setup
// const connection = { host: 'localhost', port: 6379 };
// const orderQueue = new Queue('myntraOrderQueue', { connection });
// const redisClient = redis.createClient();
// redisClient.connect().then(() => console.log("✅ Order Route connected to Redis"));

// // ✅ 1. CREATE ORDER ROUTE (Ye missing tha, isliye 404 aa raha tha)
// router.post('/create', async (req, res) => {
//   try {
//     const { amount, currency = 'INR', receipt } = req.body;

//     if (!amount || !receipt) {
//       return res.status(400).json({ error: 'Amount and receipt are required' });
//     }

//     const options = {
//       amount: Math.round(amount * 100), // Paise mein convert karna
//       currency,
//       receipt,
//       payment_capture: 1,
//     };

//     const order = await razorpay.orders.create(options);
//     res.json(order);
//   } catch (error) {
//     console.error('Error creating Razorpay order:', error);
//     res.status(500).json({ error: 'Failed to create order', details: error.message });
//   }
// });

// // ✅ 2. VERIFY PAYMENT ROUTE
// router.post('/verify', async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems } = req.body;

//   if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !cartItems) {
//     return res.status(400).json({ success: false, message: 'Missing parameters' });
//   }

//   // Signature Verification
//   const generated_signature = crypto
//     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//     .update(razorpay_order_id + '|' + razorpay_payment_id)
//     .digest('hex');

//   if (generated_signature === razorpay_signature) {
//     try {
//       // Redis Stock Check Logic
//       for (const item of cartItems) {
//         const stockKey = `stock_${item.id}`;
//         const remaining = await redisClient.decr(stockKey);

//         if (remaining < 0) {
//           await redisClient.set(stockKey, 0);
//           return res.status(400).json({ 
//             success: false, 
//             message: `Product ${item.item_name} is now Sold Out!` 
//           });
//         }
//       }

//       // Add to Queue for DB update
//       await orderQueue.add('processMyntraOrder', {
//         orderId: razorpay_order_id,
//         paymentId: razorpay_payment_id,
//         items: cartItems,
//       });

//       res.json({ success: true, message: 'Order Confirmed!' });

//     } catch (err) {
//       console.error("Order Processing Error:", err);
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
//   } else {
//     res.status(400).json({ success: false, message: 'Payment verification failed' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const redis = require('redis'); 
const { Queue } = require('bullmq');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Redis Connection & Queue Setup

const redisUrl = process.env.REDIS_URL;
const isRediss = redisUrl && redisUrl.startsWith('rediss');

const redisClient = redis.createClient({
url: redisUrl,
socket:{
tls: isRediss ? true : undefined,
rejectUnauthorized: false,
connectTimeout: 10000
}
});

redisClient.on('error', (err) => console.log('Redis Error:', err));

redisClient.connect().then(() => {
console.log(isRediss ? "Connected to UPSTASH (Cloud)" : "Connected to LOCALHOST (Memurai)");
})
.catch(err => console.error("REDIS FAIL:", err));

const queueConnection = isRediss
? { url: redisUrl, socket: { tls: true, rejectUnauthorized: false } }
: { host: 'localhost', port: 6379 };

const orderQueue = new Queue('myntraOrderQueue', { connection: queueConnection });

router.post('/check-stock', async (req, res) => {
  try {
    const { cartItems } = req.body;
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart empty hai" });
    }

    for (const item of cartItems) {
      const stockKey = `stock_${item.id}`;
      const stock = await redisClient.get(stockKey);

      // Agar stock null hai ya mangi gayi quantity se kam hai
      if (stock === null || parseInt(stock) < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Sorry! only ${stock || 0} units of ${item.item_name} are left.` 
        });
      }
    }

    // Agar sab sahi hai
    res.json({ success: true });
  } catch (err) {
    console.error("Stock Check Error:", err);
    res.status(500).json({ success: false, message: "Server error during stock check" });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || !receipt) {
      return res.status(400).json({ error: 'Amount and receipt are required' });
    }

    const options = {
      amount: Math.round(amount * 100), 
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

//  2. VERIFY PAYMENT ROUTE
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems } = req.body;

  console.log(" Received Verify Request for Items:", cartItems.length);

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !cartItems) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    try {
      for (const item of cartItems) {
        const stockKey = `stock_${item.id}`;

        const currentStock = await redisClient.get(stockKey);

        if (!currentStock || parseInt(currentStock) < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Sorry, ${item.item_name} is out of stock!`
          });
        }

        const remaining = await redisClient.decrBy(stockKey, item.quantity);
        
        console.log(` Checking Redis Key: ${stockKey} | Remaining: ${remaining}`);

        if (remaining < 0) {
          await redisClient.incrBy(stockKey, item.quantity);
          console.log(`Stock Failed for: ${item.item_name}`);
          return res.status(400).json({ 
            success: false, 
            message: `Product ${item.item_name} is now Sold Out!` 
          });
        }
      }

      await orderQueue.add('processMyntraOrder', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        items: cartItems,
      });

      console.log(" Order success log sent to frontend");
      res.json({ success: true, message: 'Order Confirmed!' });

    } catch (err) {
      console.error("Order Processing Error:", err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = router;