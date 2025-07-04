import express from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUserID,
} from "../controllers/orderController";

const router = express.Router();

// GET all orders
router.get("/", getAllOrders);

// GET a specific order by ID
router.get("/:orderID", getOrderById);

// POST a new order
router.post("/", createOrder);

// PUT (update) an existing order by ID
router.put("/:orderID", updateOrder);

// DELETE an order by ID
router.delete("/:orderID", deleteOrder);

// Get orders by user ID
router.get("/history/:userID", getOrdersByUserID); 

export default router;