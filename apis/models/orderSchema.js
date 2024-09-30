// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'products',
//         required: true
//     },
//     userId:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'users',
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'shipped', 'delivered', 'cancelled', 'returned'],
//         default: 'pending'
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// })

// const Order = mongoose.model('Order', orderSchema);
// module.exports = Order;