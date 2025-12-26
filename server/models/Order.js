import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",     // ✅ must match User model you use
        required: true
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",   // ✅ must match Product model name
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    amount: {
        type: Number,
        required: true
    },

    // ✅ address is saved as ObjectId
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",   // ✅ must match Address.js (lowercase)
        required: true
    },

    status: {
        type: String,
        default: "Order placed"
    },

    paymentType: {
        type: String,
        required: true
    },

    isPaid: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
