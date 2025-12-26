import jwt from "jsonwebtoken";

// ---------------- Seller LOGIN ---------------- /api/seller/login
export const SellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      // Create JWT with seller role
      const token = jwt.sign(
        { email, role: "seller" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Store JWT in cookie
      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        success: true,
        message: "Seller logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Seller isAuth ---------------- /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    if (!req.seller) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    return res.json({
      success: true,
      seller: req.seller,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Seller LOGOUT ---------------- /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    // Some browsers need this to force cookie removal
    res.cookie("sellerToken", "", { maxAge: 0 });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
