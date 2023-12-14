const Stripe = require("stripe")(
  "sk_test_51MoAeUHx8XV3iDREfX0Dggsy6tRrfFPCNXZDb72tW5mB2f8TKa6O4dQaiDfpmsRf8f8loWYWGHcBYNhS5cHqwE0d00oSkyszcl"
);
const payment = async (req, res) => {
  let status, responseError;
  const { token, amount } = req.body;
  try {
    await Stripe.charges.create({
      source: token.id,
      amount,
      currency: "usd",
    });
    status = "success";
  } catch (error) {
    console.log(error);
    responseError = error.message;
    status = "Failure";
  }
  res.json({ error: responseError, status });
};

module.exports = {
  payment,
};
