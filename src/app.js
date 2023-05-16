const express = require("express");
const checkStatusRouter = require("./routes/checkStatus");

const app = express();

app.use(express.json());

// app.get("/", (_req, res) => {
//   res.sendStatus(200);
// });

app.use("/checkstatus", checkStatusRouter);

module.exports = app;
