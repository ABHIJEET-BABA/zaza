import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: './.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 ENV CHECK
const requiredEnv = [
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing ENV: ${key}`);
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ================= RAZORPAY =================
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  app.post('/api/payments/create-order', async (req, res) => {
    try {
      const { amount, currency = 'INR' } = req.body;

      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency,
        receipt: `receipt_${Date.now()}`,
      });

      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Order creation failed' });
    }
  });

  app.post('/api/payments/verify', (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        res.json({ status: 'success' });
      } else {
        res.status(400).json({ status: 'failure' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Verification failed' });
    }
  });

  // ================= SHIPROCKET =================
  let shiprocketToken = '';
  let tokenExpiry = 0;

  const getShiprocketToken = async () => {
    if (shiprocketToken && Date.now() < tokenExpiry) {
      return shiprocketToken;
    }

    if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
      throw new Error("❌ Shiprocket credentials missing");
    }

    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

    shiprocketToken = response.data.token;
    tokenExpiry = Date.now() + 86400000;

    return shiprocketToken;
  };

  // ================= ORDER CONFIRM =================
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  app.post('/api/orders/confirm', async (req, res) => {
    try {
      const { orderData } = req.body;
      const { shippingAddress, items, total } = orderData;

      const token = await getShiprocketToken();

      let shipmentDetails = null;

      try {
        const shipRes = await axios.post(
          'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
          {
            order_id: `ZAZA_${Date.now()}`,
            order_date: new Date().toISOString().split('T')[0],
            pickup_location: "Primary",

            billing_customer_name: shippingAddress.fullName,
            billing_address: shippingAddress.address,
            billing_city: shippingAddress.city,
            billing_pincode: shippingAddress.zipCode,
            billing_state: shippingAddress.state,
            billing_country: "India",
            billing_email: shippingAddress.email,
            billing_phone: shippingAddress.phone,

            shipping_is_billing: true,

            order_items: items.map((item: any) => ({
              name: item.name,
              sku: item.productId,
              units: item.quantity,
              selling_price: item.price,
            })),

            payment_method: "Prepaid",
            sub_total: total,

            length: 10,
            breadth: 10,
            height: 10,
            weight: 0.5,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        shipmentDetails = shipRes.data;
      } catch (e) {
        console.error('Shiprocket error:', e);
      }

      // 📧 Emails
      await transporter.sendMail({
        from: `"Zaza Oils" <${process.env.EMAIL_USER}>`,
        to: shippingAddress.email,
        subject: 'Order Confirmed',
        html: `<h2>Order Confirmed</h2><p>Total: ₹${total}</p>`,
      });

      await transporter.sendMail({
        from: `"Zaza Oils" <${process.env.EMAIL_USER}>`,
        to: process.env.OWNER_EMAIL,
        subject: 'New Order',
        html: `<p>New order received. ₹${total}</p>`,
      });

      res.json({ success: true, shipmentDetails });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Order failed' });
    }
  });

  // ================= VITE (IMPORTANT FIX) =================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);

    // 🔥 THIS FIXES YOUR LOCALHOST ISSUE
    app.get('*', async (req, res) => {
      try {
        const url = req.originalUrl;

        const html = await vite.transformIndexHtml(
          url,
          `<!DOCTYPE html>
          <html>
            <head>
              <script type="module" src="/src/main.tsx"></script>
            </head>
            <body>
              <div id="root"></div>
            </body>
          </html>`
        );

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        console.error(e);
        res.status(500).end(e);
      }
    });

  } else {
    const distPath = path.join(process.cwd(), 'dist');

    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();