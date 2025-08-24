import mongoose from "mongoose";

 const cartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    qty: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);


const Cart = mongoose.model("Cart", cartItemSchemazy);

export default User;