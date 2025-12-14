const Founditem = require("../models/Founditem");
const Additemfound = async(req,res)=>{
    try{
        const itemData = req.body;
        const newItem = new Founditem(itemData);
        const savedItem = await newItem.save();

        res.status(201).json({
            message:"Found item created",
            data:savedItem
        });

    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});

    }
};

module.exports={Additemfound};