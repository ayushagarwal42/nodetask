const Product=require("../models/productschema");
const Warehouse = require("../models/warehouseSchema");
exports.addProduct = async (req, res) => {
    try {
        const { name, quantity, price, warehouseId } = req.body;
        if (!warehouseId) {
            return res.status(400).json({ code: 400, message: "Warehouse ID is required" });
        }
        const warehouseExists = await Warehouse.findById(warehouseId);
        if (!warehouseExists) {
            return res.status(404).json({ code: 404, message: "Warehouse not found" });
        }

        const newProduct = new Product({
            name,
            quantity,
            price,
            warehouse: warehouseId,  // reference to the warehouse
        });

        await newProduct.save();

        // Add product ID to warehouse's products array
        await Warehouse.findByIdAndUpdate(warehouseId, { $push: { products: newProduct._id } });

        res.status(201).json({ code: 201, message: "Product added successfully", newProduct });
    } catch (err) {
        res.status(500).json({ code: 500, error: err.message });
    }
};
exports.getProductsByLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ code: 400, message: "Latitude and longitude are required." });
        }
        // Convert latitude and longitude to numbers
        const lat = parseFloat(latitude);
        const long = parseFloat(longitude);
        
        if (isNaN(lat) || isNaN(long)) {
            return res.status(400).json({ code: 400, message: "Invalid latitude or longitude." });
        }

        // Find warehouses within 10 km radius
        const warehouses = await Warehouse.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude] // [longitude, latitude]
                    },
                    $maxDistance: 10000 // 10 km
                }
            }
        });

        if (warehouses.length === 0) {
            return res.status(404).json({ code: 404, message: "No warehouses found within 10 km." });
        }

        // Get product IDs from found warehouses
        const warehouseIds = warehouses.map(warehouse => warehouse._id);
        const products = await Product.find({ warehouse: { $in: warehouseIds } });

        return res.status(200).json({ code: 200, message: "Products retrieved successfully", products });
    } catch (err) {
        res.status(500).json({ code: 500, error: err.message });
    }
};
