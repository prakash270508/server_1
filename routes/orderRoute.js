const express = require("express");
const { verifyToken, verifyAdmin } = require("../utils/authentication");
const {
  placeOrder,
  getAllOrder,
  getOrderById,
  deleteOrderById,
  statusDelivered,
  statusOrdered,
  statusShipped,
  yourOrder
} = require("../controller/orderController");

const router = express.Router();
router.route("/place-order").post(verifyToken, placeOrder);
router.route('/your-order').get(verifyToken, yourOrder)
router
  .route("/:id")
  .get(verifyToken, getOrderById)
  .delete(verifyToken, verifyAdmin, deleteOrderById);
router.route("/admin/getAllOrders").get(verifyToken, verifyAdmin, getAllOrder);
router.route("/order-status").post(verifyToken, verifyAdmin, statusOrdered);
// router.route("/order-shipped").post(verifyToken, verifyAdmin, statusShipped);
// router.route("/order-delivered").post(verifyToken, verifyAdmin, statusDelivered);

module.exports = router;
