import { response } from "express";
import Product from "../models/Product.js";
import { getImage, upload } from "../../multer.js";
import path from "path";
import { fileURLToPath } from 'url';

// Setup __dirname manually for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all products
// @route   GET /products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      status: 200,
      statusMessage: "Products Data Fetched Successfully.",
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


// @desc    Get single product by ID
// @route   GET /products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new product
// @route   POST /products
// @access  Admin
export const uploadImageController = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const folder = req.body.folder || '';
    res.json({
      message: 'Upload successful',
      filename: req.file.filename,
      path: `/uploads/${folder}/${req.file.filename}`
    });
  } catch (error) {
    console.error("Error uploading image:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
}
export const getImagesController = async (req, res) => {
  try {
    getImage((err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to read uploads directory.' });
      }

      res.status(200).json(data); // { images: [...] }
    });
  } catch (error) {
    res.send(error)
  }
}

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      countInStock,
    } = req.body;
    // console.log(`created Product: ${JSON.stringify(req.body)} and request filename: ${req?.file?.filename}`);
    // const relativePath = path.relative(
    //   path.join("http://localhost:5000",'uploads'), req?.file.path
    // );

    // console.log(`Relative Path: ${relativePath}`);

    const product = new Product({
      name,
      image: req?.file ? "/uploads/" + req?.file.filename : '',
      brand,
      category,
      description,
      price,
      countInStock,
      rating: 0,
      numReviews: 0,
    });

    const createdProduct = await product.save();
    console.log(createdProduct)
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a product
// @route   PUT /products/:id
// @access  Admin
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.description = description || product.description;
      product.price = price || product.price;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
