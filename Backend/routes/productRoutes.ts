import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByID,
  getProductByName,
  getProductByBarCode,
  updateListOfProducts,
  getProductByBoxBarcode,
} from "../controllers/productController";

const router = express.Router();

// GET all products
router.get("/", getAllProducts);

// GET products by product name
router.get("/name", getProductByName);

// GET a product by ID
router.get("/:productID", getProductByID);

// GET a product by barcode 
router.get("/barcode/:barcode", getProductByBarCode); 

// GET a product by box barcode 
router.get("/box-barcode/:boxBarcode", getProductByBoxBarcode); 

// POST a new product
router.post("/", createProduct);

// PUT (update) a product by ID
router.put("/:productID", updateProduct);

// PUT update product's quantity (list of products)
router.put("/update/quantity", updateListOfProducts); 

// DELETE a product by ID
router.delete("/:productID", deleteProduct);



export default router;
