const Order = require("../models/order");
const User = require("../models/user");
const Toy = require("../models/toy");
const nodemailer = require("nodemailer");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStatistics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalToys = await Toy.countDocuments();

    const totalUsers = await User.countDocuments();

    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const revenueCountsPerMonth = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$orderDate" },
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const userCountsPerMonth = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0].total,
      totalToys,
      revenueCountsPerMonth,
      userCountsPerMonth,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const getOrderById = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOrdersByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await Order.find({ userId: userId });

    if (!orders || orders.length === 0) {
      res.status(404).json({ message: "No orders found for the user" });
      return;
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  const {
    userId,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus,
  } = req.body;
  const order = new Order({
    userId,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const { paymentStatus } = req.body;

    if (paymentStatus === "Accepted") {
      order.paymentStatus = paymentStatus;

      const updatedOrder = await order.save();

      const user = await User.findById(order.userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      sendEmailToUser(user.email);

      res.status(200).json(updatedOrder);
    } else {
      order.paymentStatus = paymentStatus;
      const updatedOrder = await order.save();

      res.status(200).json(updatedOrder);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendEmailToUser = (userEmail) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ttriki50@gmail.com",
      pass: "uzatmbqqtxzpptku",
    },
  });

  const mailOptions = {
    from: "ttriki50@gmail.com",
    to: userEmail,
    subject: "Your Order Is Accepted",
    text: "Your order has been accepted. Thank you for your purchase!",
  };

  transporter.sendMail(mailOptions, (error, info) => {});
};

const deleteOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updatePaymentStatus,
  deleteOrder,
  getOrdersByUserId,
  getStatistics,
};
