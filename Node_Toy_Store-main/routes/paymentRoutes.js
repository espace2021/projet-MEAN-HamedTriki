const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/PaymentController");

router.post("/", paymentController.payment);

module.exports = router;
