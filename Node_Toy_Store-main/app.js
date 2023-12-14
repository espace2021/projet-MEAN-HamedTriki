const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
// MIDDLEWARE
app.use(cors());
app.use(express.json());
mongoose.set("strictQuery", false);

const userRoutes = require("./routes/userRoutes");
const toyRoutes = require("./routes/toyRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const shoppingCartRoutes = require("./routes/shoppingCartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRouter = require("./routes/paymentRoutes");

// CONNECT TO MONGO DB
mongoose
  .connect(process.env.DATABASECLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// ROUTES
app.use("/", userRoutes);
app.use("/toy/", toyRoutes);
app.use("/category/", categoryRoutes);
app.use("/sub-category/", subCategoryRoutes);
app.use("/cart/", shoppingCartRoutes);
app.use("/order/", orderRoutes);
app.use("/order/payment", paymentRouter);

// START  THE SERVER
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("YEAH IT WORKS");
});

module.exports = app;
