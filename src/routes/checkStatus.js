const express = require("express");
const { checkStatus } = require("../controllers/checkStatus");

const checkStatusRouter = express.Router();

checkStatusRouter.get("/", checkStatus);

module.exports = checkStatusRouter;
