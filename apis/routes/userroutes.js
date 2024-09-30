const express= require('express');
const router=express.Router();
const {verifyToken, verifyAdminToken}=require("../middlewares/middleware");
const usercontroller=require("../controller/usercontroller");
// const ordercontroller=require("../controller/ordercontroller");
// const productcontroller=require("../controller/productcontroller");


router.post("/signup",usercontroller.signup);
router.get('/login',usercontroller.login);
router.post("/approveUser",verifyAdminToken,usercontroller.approveUser);
router.get("/getPendingUsers",verifyAdminToken,usercontroller.getPendingUsers);
router.get("/getUserList",verifyAdminToken,usercontroller.getUserList);

// router.post("/createorder",ordercontroller.createorder);
// router.get("/getOrdersWithDetails",ordercontroller.getOrdersWithDetails);


// router.post("/createproduct",productcontroller.createproduct);


module.exports=router;