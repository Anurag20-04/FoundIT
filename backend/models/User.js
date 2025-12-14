const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    Name:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true,
        unique: true
    },
    Phonenumber:{
        type:Number,
        require:true
    },
    Address:{
        type:String,
        require:true
    },
    Idproof:{
        type:String,
        require:true
    },
    Aadharnumber:{
        type:Number,
        require:true
    },
    Profileimage:{
        type:String,
        require:false
    },
    password: {
        type: String,
        required: true
    }
});
const User = mongoose.model("User",userSchema);
module.exports=User;
