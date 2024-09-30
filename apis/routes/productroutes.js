const express = require("express");
const router = express.Router();
const productcontroller = require("../controller/productcontroller");

router.post("/addproduct", productcontroller.addProduct);
router.get("/getProductsByLocation",productcontroller.getProductsByLocation);
module.exports=router;