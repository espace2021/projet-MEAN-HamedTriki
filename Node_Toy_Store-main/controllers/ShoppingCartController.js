const express = require("express");
const router = express.Router();
const ShoppingCart = require("../models/shoppingCart");
const Toy = require("../models/toy");

const createOrAddToShoppingCart = async (req, res) => {
  try {
    const userId = req.body.userId || req.params.userId;

    let cart = await ShoppingCart.findOne({ userId });

    if (!cart) {
      cart = new ShoppingCart({ userId, items: [] });
    }

    if (req.body.productId) {
      const { productId, productName, productImage, quantity, price } =
        req.body;

      const product = await Toy.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        return res
          .status(400)
          .json({ error: "Item already exists in the cart" });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ error: "Not enough stock available" });
      }

      product.stock -= quantity;
      await product.save();

      cart.items.push({
        productId,
        productName,
        productImage,
        quantity,
        price,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the shopping cart" });
  }
};

const getShoppingCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await ShoppingCart.findOne({ userId });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve the shopping cart" });
  }
};

const removeItemFromShoppingCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    const cart = await ShoppingCart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Shopping cart not found" });
    }

    const removedItem = cart.items.find(
      (item) => item._id.toString() === itemId
    );

    if (!removedItem) {
      return res
        .status(404)
        .json({ error: "Item not found in the shopping cart" });
    }

    const product = await Toy.findById(removedItem.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.stock += removedItem.quantity;

    await product.save();

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();

    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not remove item from the shopping cart" });
  }
};

const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    const { quantity } = req.body;
    const cart = await ShoppingCart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Shopping cart not found" });
    }

    const itemToUpdate = cart.items.find(
      (item) => item._id.toString() === itemId
    );

    if (!itemToUpdate) {
      return res
        .status(404)
        .json({ error: "Item not found in the shopping cart" });
    }

    const product = await Toy.findById(itemToUpdate.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const oldQuantity = itemToUpdate.quantity;

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const stockChange = quantity - oldQuantity;
    if (stockChange > product.stock) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    product.stock -= stockChange;

    itemToUpdate.quantity = quantity;

    await Promise.all([cart.save(), product.save()]);

    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Could not update item in the shopping cart" });
  }
};

const clearShoppingCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await ShoppingCart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Shopping cart not found" });
    }

    for (const item of cart.items) {
      const product = await Toy.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    cart.items = [];

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Could not clear the shopping cart" });
  }
};

module.exports = {
  getShoppingCart,
  createOrAddToShoppingCart,
  removeItemFromShoppingCart,
  updateItemQuantity,
  clearShoppingCart,
};
