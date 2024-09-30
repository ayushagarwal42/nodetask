const Warehouse = require('../models/warehouseSchema');

exports.addWarehouse = async (req, res) => {
    try {
        const { name, location } = req.body;

        const newWarehouse = new Warehouse({
            name,
            location,
        });

        await newWarehouse.save();
        res.status(201).json({ code: 201, message: "Warehouse added successfully", newWarehouse });
    } catch (err) {
        res.status(500).json({ code: 500, error: err.message });
    }
};
