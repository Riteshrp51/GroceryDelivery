import Product from "../models/Product.js";
import Order from "../models/Order.js";
import stripe from "stripe"
import User from '../models/User.js'

// ✅ Place order COD
export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.user.id;   // ✅ Take from auth middleware
        const { items, address } = req.body;

        if (!address || !items || items.length === 0) {
            return res.json({
                success: false,
                message: "Address and items are required"
            });
        }

        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) continue;

            amount += (product.offerPrice || product.price) * item.quantity;
        }

        // ✅ Add 2% tax
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        res.json({
            success: true,
            message: "Order placed successfully"
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Error placing order",
            error: error.message
        });
    }
};
 // Place Order Stripe :  /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.user.id;   // ✅ Take from auth middleware
        const { items, address } = req.body;
        const {origin} = req.headers;

        if (!address || !items || items.length === 0) {
            return res.json({
                success: false,
                message: "Address and items are required"
            });
        }

        let productData = []

        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            })
            if (!product) continue;

            amount += (product.offerPrice || product.price) * item.quantity;
        }

        // ✅ Add 2% tax
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        // Stripe Gateway Initialize 
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        // create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data : {
                    currency: "usd",
                    product_data : {
                        name: item.name,
                    },
                    unit_amount : Math.floor(item.price + item.price * 0.02)
                },
                quantity: item.quantity,
            }
        })
        // Create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        res.json({
            success: true,
            message: "Order placed successfully",
            url: session.url
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Error placing order",
            error: error.message
        });
    }
};

// Stripe webhooks to verify payment action
export const stripeWebHooks = async(request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    }
    catch(error) {
        response.status(400).send(`Webhook Error: ${error.message}`)
    }

    // Handle the event
    switch(event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const {orderId, userId} = session.data[0].metadata;

            // Mark payment as paid
            await Order.findByIdAndUpdate(orderId, {isPaid: true})
            // Clean user cart
            await User.findByIdAndUpdate(userId, {cartItems: {}});
            break;
        }
        case "payment_intent.payment_failed": {
             const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const {orderId} = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;
        }
        default:
            console.error(`Unhandled event type ${event.type}`)
    }
    response.json({received: true});
}

// ✅ Get user orders (GET /api/order/user)
export const getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Extract from authUser middleware

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
};

// ✅ Get all orders for seller/admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Error fetching all orders",
            error: error.message
        });
    }
};
