const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: {
            type: String, // This will be "Point"
            enum: ['Point'], // Only support Point type
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

// Create a geospatial index on the location field
warehouseSchema.index({ location: '2dsphere' });

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
module.exports = Warehouse;
