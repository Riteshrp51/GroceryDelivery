import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: [String], // array of strings
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    images: {                // ✅ renamed "image" → "images"
      type: [String],        // array of image URLs
      required: true,
    },
    category: {
      type: String,          // ✅ should be string, not array
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
