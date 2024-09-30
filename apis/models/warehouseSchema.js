const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
module.exports = Warehouse;
