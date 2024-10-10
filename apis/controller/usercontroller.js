//apis\controller\usercontroller.js
const userschema = require("../models/userschema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyToken } = require("../middlewares/middleware");

exports.signup = async (req, res) => {
    try {
        const { firstname, lastname, email, phonenumber, password, role } = req.body;

        // Agar role nahi diya gaya, toh default role 'user' set karein
        const userRole = role === "admin" ? "admin" : "user";

        const userApproval = userRole === 'admin' ? 'approved' : 'pending';

        const findUser = await userschema.findOne({ $or: [{ email }, { phonenumber }] });
        if (findUser) {
            return res.status(400).json({ message: "User already exist" })
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = new userschema({
                firstname,
                lastname,
                email,
                phonenumber,
                password: hashedPassword,
                isAdminApproval: userApproval, // Set the approval status based on the role
                // isBlocked,
                role: userRole, // Set the role based on the provided role or default to 'user'
            });
            console.log(user);
            const saveduser = await user.save();
            res.status(201).json({ code: 201, message: `${userRole} created successfully`, saveduser });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, phonenumber, password } = req.body;
        if ((!email && !phonenumber) || (email && phonenumber)) {
            return res.status(400).json({ message: "Please provide either email or phone, but not both, along with the password." });
        }
        if (!password) {
            return res.status(400).json({ message: "Please provide the password." });
        }
        const user = await userschema.findOne({ $or: [{ email }, { phonenumber }] });
        if (!user) {
            return res.status(404).json({ code: 404, message: 'User not found' });
        }
        if (user.isAdminApproval !== 'approved') {
            return res.status(403).json({ code: 403, message: 'Your account is pending approval. Please wait for admin approval before logging in.' });
        }
        // Check if user is blocked
        if (user.isBlocked === 'Blocked') {
            return res.status(403).json({ code: 403, message: 'Your account is blocked. Please contact support.' });
        }
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            return res.status(401).json({ code: 401, message: 'Invalid password' });
        }
        const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            "laughing",
            { expiresIn: '1h' }
        );
        console.log(token);
        return res.status(200).json({ code: 200, message: 'Login successful', token });

    } catch (err) {
        res.status(500).json({ code: 500, error: err.message });
    }
}

exports.getUserProfile = (req, res) => {
    return res.status(200).json({ message: "Profile data", user: req.user });
};

exports.getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await userschema.find({ isAdminApproval: 'pending' });
        if (pendingUsers.length === 0) {
            return res.status(200).json({ code: 200, message: "No pending users at the moment" });
        }

        return res.status(200).json({ code: 200, message: "Pending users retrieved successfully", pendingUsers });
    } catch (err) {
        res.status(500).json({ code: 500, error: err.message });
    }
};

exports.getUserList = async (req, res) => {
    try {
        const { firstname, email, phonenumber } = req.query;

        // Create a filter object based on the query parameters
        let filter = {}; // Start with an empty filter

        // Filter by isAdminApproval if provided in query
        // if (isAdminApproval) {
        //     filter.isAdminApproval = isAdminApproval; // Exact match for isAdminApproval
        // }

        // Filter by firstname if provided
        if (firstname) {
            filter.firstname = { $regex: firstname, $options: "i" }; // Case-insensitive search for firstname
        }

        // Filter by email if provided
        if (email) {
            filter.email = { $regex: email, $options: "i" }; // Case-insensitive search for email
        }

        // Filter by phonenumber if provided
        if (phonenumber) {
            filter.phonenumber = phonenumber; // Exact match for phone number
        }

        // Find users based on the filter
        const users = await userschema.find(filter);

        // const users=await userschema.find({isAdminApproval:"approved"});

        if (users.length === 0) {
            return res.status(200).json({ code: 200, message: "no users found" })
        }
        return res.status(200).json({ code: 200, message: "users retrieved successfully", users });
    } catch (err) {
        res.status(500).json({ code: 500, error: err.message });
    }
}


exports.approveUser = async (req, res) => {
    try {
        const { userId, action } = req.body;
        const admin = await userschema.findById(req.user._id);
        if (!admin || admin.role != "admin") {
            return res.status(403).json({ code: 403, message: "you are not authorized to perform this action" })
        }

        const user = await userschema.findById(userId);//,{status:"accepted"},{new:true});
        if (!user) {
            return res.status(404).json({ code: 404, message: "user not found" })
        }
        // Handle the action (approve, reject, block, activate, delete)
        let message;
        switch (action) {
            case "approve":
                user.isAdminApproval = "approved";
                message = "User approved successfully";
                break;
            case "reject":
                user.isAdminApproval = "rejected";
                message = "User rejected successfully";
                break;
            case "block":
                user.isBlocked = "Blocked";
                message = "User blocked successfully";
                break;
            case "delete":
                const delUser = await userschema.findByIdAndDelete(userId); // Delete user
                return res.status(200).json({ code: 200, message: "User deleted successfully.", delUser });
            default:
                return res.status(400).json({ code: 400, message: "Invalid action." });
        }
        await user.save();
        return res.status(200).json({ code: 200, message, user });
    } catch (err) {
        res.status(500).json({ code: 500, error: err.message });
    }
}

