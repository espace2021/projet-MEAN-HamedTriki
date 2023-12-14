const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/orders", orderController.createOrder);

router.get("/orders", orderController.getAllOrders);

router.get("/statistics", orderController.getStatistics);

router.get("/orders/:id", orderController.getOrderById);
router.get("/orders/user/:userId", orderController.getOrdersByUserId);

router.put("/orders/:id", orderController.updatePaymentStatus);

router.delete("/orders/:id", orderController.deleteOrder);

module.exports = router;
