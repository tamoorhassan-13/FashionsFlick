import orderModel from "../models/orderModel.js";
import productModel from "../models/ProductModel.js";

export const cancelOrderController = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by orderId
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the status of the order to "cancel"
    order.status = "cancel";

    // Save the updated order
    await order.save();

    // Decrement product quantities
    await Promise.all(
      order.products.map(async (product) => {
        const { productId, quantity } = product;
        const existingProduct = await productModel.findById(productId);

        if (!existingProduct) {
          // console.error(`Product with ID ${productId} not found`);
          return;
        }

        // Increment product quantity by the quantity in the canceled order
        existingProduct.quantity += quantity;

        // Save the updated product
        await existingProduct.save();
      })
    );

    res.json({ message: "Order canceled successfully", order });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
