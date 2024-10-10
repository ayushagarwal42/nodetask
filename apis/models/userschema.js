//apis\models\userschema.js
const mongoose = require("mongoose");
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  phonenumber: {
    type: Number,
    required: true,
    unique: true,
    sparse:true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdminApproval: { 
    type:String,
    enum:["approved", "rejected","pending"],
    default:"pending"
  },
  isBlocked: { 
    type:String,
    enum:["Blocked", "Active"],
    default:"Active"
  },
  role: { 
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }

})
// Method to compare password
// userSchema.methods.comparePassword = function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

const users = mongoose.model("users", userSchema);

module.exports = users;