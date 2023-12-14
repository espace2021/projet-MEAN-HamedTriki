const express = require("express");
const router = express.Router();
const shoppingCartController = require("../controllers/ShoppingCartController");

router.post("/create", shoppingCartController.createOrAddToShoppingCart);
router.get("/:userId", shoppingCartController.getShoppingCart);
router.delete(
  "/:userId/remove/:itemId",
  shoppingCartController.removeItemFromShoppingCart
);
router.put(
  "/:userId/update/:itemId",
  shoppingCartController.updateItemQuantity
);
router.delete(
  "/shopping-cart/:userId",
  shoppingCartController.clearShoppingCart
);

module.exports = router;
