const express = require("express");
const { isAuthenticated, validateUserRole } = require("../../middleware/auth");
const {
  createOrder,
  getAllOrders,
} = require("../../controllers/order/order.controller");

const orderRoutes = express.Router();

orderRoutes.post("/create-order", isAuthenticated, createOrder);
orderRoutes.get("/get-all-order", isAuthenticated, getAllOrders);

module.exports = orderRoutes;
