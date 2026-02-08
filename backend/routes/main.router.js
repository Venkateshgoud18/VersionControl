const express = require("express");
const userRouter = require("./user.router");
const repoRouter = require("./repo.router");
const issueRouter = require("./issue.router");

const mainRouter = express.Router();

mainRouter.use("/api",userRouter);
mainRouter.use("/apiRepo",repoRouter);
mainRouter.use("/apiIssue",issueRouter);

mainRouter.get("/", (req, res) => {
  res.send("Welcome!");
});

module.exports = mainRouter;