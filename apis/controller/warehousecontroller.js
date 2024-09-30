const Warehouse = require('../models/warehouseSchema');

exports.addWarehouse = async (req, res) => {
    try {
        const { name, longitude, latitude } = req.body;

        const newWarehouse = new Warehouse({
            name,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude], // Store as [longitude, latitude]
            },
        });

        await newWarehouse.save();
        res.status(201).json({ code: 201, message: "Warehouse added successfully", newWarehouse });
    } catch (err) {
        res.status(500).json({ code: 500, error: err.message });
    }
};
