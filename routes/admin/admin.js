var express = require("express");
var supplierCategoryRouter = require("./supplierCategory");
var roleRouter = require("./role");
var adminUserRouter = require("./adminUser");

var app = express();
app.use("/supplierCategory/", supplierCategoryRouter);
app.use("/role/", roleRouter);
app.use("/adminuser/", adminUserRouter);

module.exports = app;