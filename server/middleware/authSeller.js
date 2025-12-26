import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    // ✅ Attach decoded seller to req object
    req.seller = decoded; 

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Not authorized",
    });
  }
};

export default authSeller;
