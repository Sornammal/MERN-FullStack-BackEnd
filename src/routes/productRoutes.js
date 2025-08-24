import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getImagesController,
  uploadImageController,
} from "../controllers/productController.js";
// import { protect, admin } from "../middleware/auth.js";
import { upload } from "../../multer.js";

const productRouter = express.Router();
// Public routes
productRouter.post("/createProduct",upload, createProduct);
productRouter.post('/uploadProductImage', upload, uploadImageController)
productRouter.get("/getImages", getImagesController);
productRouter.get("/getProductsData", getProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);


export default productRouter;
