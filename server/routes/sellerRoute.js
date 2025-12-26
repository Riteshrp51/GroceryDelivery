import express from "express";
import { isSellerAuth, SellerLogin, sellerLogout } from "../controllers/sellerController.js";
import authSeller from "../middleware/authSeller.js"; // assuming default export

const sellerRouter = express.Router();

sellerRouter.post("/login", SellerLogin);
sellerRouter.get("/is-auth", authSeller, isSellerAuth);
sellerRouter.get("/logout", sellerLogout);

export default sellerRouter;