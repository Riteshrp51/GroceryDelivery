// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebHooks } from "./controllers/orderController.js";

const app = express();
const port = process.env.PORT || 4000;

// Allowed frontend origins
const allowedOrigins = ['http://localhost:5173', 'https://greencart-frontend-jet.vercel.app']

app.post('/stripe', express.raw({type: 'application/json'}), stripeWebHooks)

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ---------------- ROUTES ----------------
app.get('/', (req, res) => {
  res.send("API is working");
});

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// ---------------- GLOBAL ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});

// ---------------- START SERVER ----------------
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    await connectCloudinary();
    console.log("✅ Cloudinary connected");

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();