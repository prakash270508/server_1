const mongoose = require("mongoose");

const orderSshema = new mongoose.Schema({
  shippingInfo: {
    city: {
      type: String,
      required: true,
    },
    usersName: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
  oderItems: [],
  user: {
    type: String,
    required: true,
  },
  userName :{
    type: String,
    required: true,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    default: "ordered",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  cardDetails: {
    cardHolderName: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: Number,
      required: true,
    },
    cvv: {
      type: Number,
      required: true,
    },
  },
});

module.exports = mongoose.model("Order", orderSshema);
