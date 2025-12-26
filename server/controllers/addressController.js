import Address from "../models/Address.js";


// Add address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const address = req.body.address;

    if (!address) {
      return res.json({
        success: false,
        message: "No address data provided",
      });
    }

    const newAddress = await Address.create({
      ...address,
      userId: req.userId,
    });

    res.json({
      success: true,
      message: "Address added successfully",
      address: newAddress,  // ✅ Return the created address
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error adding address",
      error: error.message,
    });
  }
};

// Get addresses : /api/address/get
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;   // ✅ from authUser middleware
    const addresses = await Address.find({ userId });

    res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};
