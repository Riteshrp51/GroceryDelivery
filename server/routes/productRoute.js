import express from "express";
import { upload } from "../configs/multer.js";
import { addProduct, changeStock, deleteProduct, productById, productList } from "../controllers/productController.js";
import authSeller from "../middleware/authSeller.js";

const productRouter = express.Router();

// ✅ multer config fixed (was wrong before)
productRouter.post("/add", upload.array("images"), authSeller, addProduct);

productRouter.get("/list", productList);
productRouter.get("/:id", productById);
productRouter.post("/stock", authSeller, changeStock);
productRouter.delete("/:id", authSeller, deleteProduct);

export default productRouter;
