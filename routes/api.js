var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./book");
var uploadRouter = require("./upload");
var companyRouter = require("./company");

var app = express();

app.use("/auth/", authRouter);
app.use("/book/", bookRouter);
app.use("/upload/", uploadRouter);
app.use("/company/", companyRouter);

module.exports = app;