const User = require("../models/User");
const bcrypt = require("bcrypt");
const Login = async(req,res)=>{
    try{
    const{email,password}=req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message:"User Not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        user.password = undefined;
    res.status(200).json({message:"Login Successfull"});
}catch(error){
    res.status(500).json({error:error.message})
}
}

module.exports = { Login };