import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authUser = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies?.token;
    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // 2️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
    } catch (err) {
      console.log("JWT verification error:", err.message);
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // 3️⃣ Ensure userId is in token
    if (!decoded.id) {
      console.log("Token missing user ID");
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // 4️⃣ Validate user exists
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("User not found in DB");
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // 5️⃣ Attach user + id for later use
    req.user = user;
    req.userId = user._id; // 🔑 so controllers can use req.userId
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default authUser;
