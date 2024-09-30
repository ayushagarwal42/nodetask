const express = require("express");
const router = express.Router();
const warehousecontroller = require("../controller/warehousecontroller");

router.post("/addwarehouse", warehousecontroller.addWarehouse);
module.exports=router;