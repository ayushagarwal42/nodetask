// const User=require("../models/userschema");
// const Product=require("../models/productschema");
// const Order=require("../models/orderSchema");

// exports.createorder=async(req,res)=>{
//     try{
//         const {productId,userId,quantity}=req.body;
//         const productexist=await Product.findById(productId);
//         if(!productexist){
//             return res.status(400).json({message:"product not found"});
//         }
//         if (quantity <= 0) {
//             return res.status(400).json({ message: "Invalid quantity. Quantity must be greater than zero." });
//         }
//         if(productexist.stock<quantity){
//             return res.status(400).json({message:"product out of stock"});
//         }
//         const userExist=await User.findById(userId);
//         if(!userExist){
//             return res.status(400).json({message:"user not found"});
//         }
//         const order=new Order({
//             productId,
//             userId,
//             quantity
//         });
//         await order.save();
//         productexist.stock-=quantity;
//         await productexist.save();

//         return res.status(201).json({message:"order created successfully",order});
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({message:"internal server error"});
//     }
// }

// exports.getOrdersWithDetails = async (req, res) => {
//     try {
//         const orders = await Order.aggregate([
//             {
//                 $lookup: {
//                     from: 'products', // Join with the Product collection
//                     localField: 'productId',
//                     foreignField: '_id',
//                     as: 'productDetails'
//                 }
//             },
//             {
//                 $unwind: '$productDetails' // Flatten the product details
//             },
//             {
//                 $lookup: {
//                     from: 'users', // Join with the User collection
//                     localField: 'userId',
//                     foreignField: '_id',
//                     as: 'userDetails'
//                 }
//             },
//             {
//                 $unwind: '$userDetails' // Flatten the user details
//             },
//             {
//                 $project: { // Select fields to return
//                     productId: 1,
//                     userId: 1,
//                     quantity: 1,
//                     status: 1,
//                     createdAt: 1,
//                     'productDetails.name': 1,
//                     'productDetails.price': 1,
//                     'userDetails.firstname': 1,
//                     'userDetails.lastname': 1,
//                     'userDetails.email': 1
//                 }
//             }
//         ]);

//         return res.status(200).json(orders);
//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }
// };
