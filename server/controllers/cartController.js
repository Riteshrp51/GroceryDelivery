import User from '../models/User.js';

// Update user cart : /api/cart/update
export const updateCart = async (req, res) => {
    try {
        const userId = req.user._id;   // Get userId from auth middleware
        const { cartItems } = req.body;

        if (!cartItems || typeof cartItems !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Invalid cart data'
            });
        }

        await User.findByIdAndUpdate(userId, { cartItems });

        res.json({
            success: true,
            message: 'Cart updated successfully',
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: 'Error updating cart',
            error: error.message
        });
    }
};
