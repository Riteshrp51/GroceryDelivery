import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/Product.js';

// Add product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);

    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    // Upload each image to Cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // Save product in DB
    await Product.create({
      ...productData,
      images: imagesUrl,   // ✅ matches schema
    });

    res.json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};
// Product list : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({
            success: true,
            products: products,
        })
    }
    catch(error) {
        res.json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        })
    }
}

// Get Single Product by ID : /api/product/:id
// GET /api/product/:id
export const productById = async (req, res) => {
  try {
    const { id } = req.params;  // 👈 use params, not body
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};


// Change stock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    if (typeof inStock !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid stock status",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Stock updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update stock",
      error: error.message,
    });
  }
};

// Delete product : /api/product/:id (DELETE)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
