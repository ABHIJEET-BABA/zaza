import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ENV CHECK (safe - no crash)
const requiredEnv = [
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "EMAIL_USER",
  "EMAIL_PASS",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing ENV: ${key}`);
  }
});

// App
const app = express();
app.use(express.json());

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// ✅ Example route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server working 🚀" });
});

// ✅ Example Razorpay order
app.post("/api/create-order", async (req, res) => {
  try {
    const options = {
      amount: 50000, // ₹500
      currency: "INR",
      receipt: "receipt_order_1",
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// ✅ Email example
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Vite integration (for frontend)
async function startServer() {
  const PORT = process.env.PORT || 3000;

  const vite = await createViteServer({
    server: { middlewareMode: true },
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      const indexHtml = await vite.transformIndexHtml(
        url,
        `<!DOCTYPE html>
         <html>
         <head><title>App</title></head>
         <body>
           <div id="root"></div>
           <script type="module" src="/src/main.tsx"></script>
         </body>
         </html>`
      );

      res.status(200).set({ "Content-Type": "text/html" }).end(indexHtml);
    } catch (e) {
      console.error(e);
      res.status(500).end(e);
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
