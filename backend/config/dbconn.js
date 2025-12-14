const mongoose = require("mongoose")
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected sucessfully");
    }catch(error){
        console.error("MongoBD connection error",error);
        process.exit(1);
    }
}

module.exports=connectDB;