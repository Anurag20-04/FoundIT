const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // 2. Find user & include password (manually excluded in model)
        // Normalizing email to lowercase to match the model's lowercase: true
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        
        if (!user) {
            return res.status(404).json({ message: "User Not found" });
        }

        // 3. Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 4. Create JWT Token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "MY_SECRET_KEY",
            { expiresIn: "1d" }
        );

        // 5. Cleanup & Response
        // We set password to undefined so it's not accidentally sent in the JSON
        user.password = undefined;

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { Login };