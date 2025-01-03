const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["main_admin", "guest_admin"], required: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
