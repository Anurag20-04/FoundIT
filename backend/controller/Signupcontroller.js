const User = require("../models/User");
const bcrypt = require("bcrypt");

const Newuser = async (req, res) => {
  try {
    const {
      Name,
      Email,
      Phonenumber,
      Address,
      Idproof,
      Aadharnumber,
      Profileimage,
      password
    } = req.body;

    // Check required fields
    if (!Name || !Email || !Phonenumber || !Address || !Idproof || !Aadharnumber || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = {
      Name,
      Email,
      Phonenumber,
      Address,
      Idproof,
      Aadharnumber,
      Profileimage: Profileimage || "none",
      password: hashedPassword
    };

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    // Hide password before sending response
    savedUser.password = undefined;

    res.status(201).json({
      message: "Signup successful",
      data: savedUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { Newuser };
