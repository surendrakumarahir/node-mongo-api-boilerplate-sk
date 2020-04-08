var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./book");
var uploadRouter = require("./upload");

var app = express();

app.use("/auth/", authRouter);
app.use("/book/", bookRouter);
app.use("/upload/", uploadRouter);

module.exports = app;