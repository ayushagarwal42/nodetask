const express = require("express");
const router = express.Router();
const productcontroller = require("../controller/productcontroller");

router.post("/addproduct", productcontroller.addProduct);
module.exports=router;