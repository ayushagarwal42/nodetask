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
