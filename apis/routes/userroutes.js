const express= require('express');
const router=express.Router();
const {verifyToken, verifyAdminToken}=require("../middlewares/middleware");
const usercontroller=require("../controller/usercontroller");



router.post("/signup",usercontroller.signup);
router.get('/login',usercontroller.login);
router.post("/approveUser",verifyAdminToken,usercontroller.approveUser);
router.get("/getPendingUsers",verifyAdminToken,usercontroller.getPendingUsers);
router.get("/getUserList",verifyAdminToken,usercontroller.getUserList);




module.exports=router;