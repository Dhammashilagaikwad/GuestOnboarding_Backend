const User = require('../models/Role');
const bcrypt = require("bcrypt");
const { createTokenForUser } = require('../services/auth'); 

const signup = async (req, res) => {
    const { email, password, role } = req.body;

    // Input validation
    if (!email || !password || typeof password !== "string" || !role) {
        return res.status(400).json({ message: "Invalid input. All fields are required and password must be a string." });
    }

    if (!["main_admin", "guest_admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role specified" });
    }

    try {
        console.log("Password received:", password); 
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword);

        const user = new User({ email, password: hashedPassword, role });
        await user.save();

        const token = createTokenForUser(user);
        res.cookie("token", token, { httpOnly: true });
        res.status(201).json({ message: "Signup successful", token });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Error during signup" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    
    if (!email || !password || typeof password !== "string") {
        return res.status(400).json({ message: "Invalid input. All fields are required and password must be a string." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = createTokenForUser(user);
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error during login" });
    }
};

const logout = (req, res) => {
    try {
      
        res.clearCookie("token", { httpOnly: true });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Error during logout" });
    }
};




module.exports = { signup, login , logout};
