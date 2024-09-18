const express = require("express");
const { isAuthenticated, validateUserRole } = require("../../middleware/auth");
const createOrder = require("../../controllers/order/order.controller");

const orderRoutes = express.Router();

orderRoutes.post("/create-order", isAuthenticated, createOrder);

module.exports =orderRoutes;