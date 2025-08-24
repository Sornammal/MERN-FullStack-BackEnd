import express from 'express';
import userRoutes from "../routes/userRoutes.js";
import productRouter from "../routes/productRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import cartRoutes from "../routes/cartRoutes.js";

const routes = express.Router();


routes.use("/users", userRoutes);
routes.use("/products", productRouter);
routes.use("/orders", orderRoutes);
routes.use("/cart", cartRoutes);

export default routes;