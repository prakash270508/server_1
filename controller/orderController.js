const Order = require("../models/orderModel");
const User = require("../models/userModel");
const { createError } = require("../utils/error");

//Place Order
exports.placeOrder = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    order.user = req.user._id;
    order.userName = req.user.username;

    const user = await User.findById(req.user._id);
    user.noOfOrders += 1;

    await order.save();
    await user.save();
    res.status(200).json({ message: "Order Placed", order });
  } catch (error) {
    next(error);
  }
};

//Get all order (Admin)
exports.getAllOrder = async (req, res, next) => {
  try {
    const orders = await Order.find();

    res.status(201).json({ Message: "All orders", orders });
  } catch (error) {
    next(error);
  }
};

//Get by id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return next(createError(404, "order not found"));

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.deleteOrderById = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.status(201).json({ Message: "Order Deleted" });
  } catch (error) {
    next(error);
  }
};

//order status
exports.statusOrdered = async (req, res, next) => {
  try {
    const { id, status } = req.body;

    const order = await Order.findById(id);
    order.orderStatus = status;

    await order.save();
    res.status(201).json({ message: "Order " + status, order });
  } catch (error) {
    next(error);
  }
};

//Your order
exports.yourOrder = async (req, res, next) => {
  try {
    const yourOrders = await Order.find({ user: req.user._id });

    res.status(201).json(yourOrders);
  } catch (error) {
    next(error);
  }
};
