const Founditem = require("../models/Founditem");
const Lostitem = require("../models/Lostitem");
const Notification = require("../models/Notification");
const matchItems = require("../utils/matcher");

const Additemfound = async (req, res) => {
  try {
    const itemData = req.body;
    const newItem = new Founditem(itemData);
    const savedItem = await newItem.save();

    // AUTO MATCH ENGINE
    const lostItems = await Lostitem.find({ isResolved: false });

    for (let lost of lostItems) {
      if (matchItems(lost, savedItem)) {
        lost.matchedFoundItem = savedItem._id;
        lost.isResolved = true;
        lost.status = "matched";
        await lost.save();

        // NOTIFY OWNER
        await Notification.create({
          user: lost.owner,
          lostItem: lost._id,
          foundItem: savedItem._id,
          message: `Your lost item "${lost.title}" has a possible match.`
        });
      }
    }

    res.status(201).json({
      message: "Found item created and auto-matching executed",
      data: savedItem
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//find all items
const GetAllFoundItems =async(req,res)=>{
    try{

        const items = await Founditem.find();

        res.status(200).json({
            message:"All items Fetched Sucessfully",
            data:items
            })
    }catch(error){
        console.log(error);
        res.status(500).json({
            error:error.message
        })
    }
}
//Find items byid

const GetItemsById = async(req,res)=>{
    try{
        const {id} =req.params; 
        const item = await Founditem.findById(id);

        if(!item){
            res.status(404).json({message:"Item not found"});
        }

        res.status(200).json({
            message:"Items found successfully",
            data:item
        })
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message})
    }
}

//Update items

const UpdateFoundItem =async(req,res)=>{
    try{
        const{id} = req.params;
        const updatedata = req.body;

        const updateitem = await Founditem.findByIdAndUpdate(id,updatedata,{new:true}); 
        
        if(!updateitem){
            res.status(404).json({message:"Item not found"})
        }

        res.status(200).json({message:"Item updates successfully",
            data:updateitem})
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
}


//delete item

const DeleteFounditem = async(req,res)=>{
    try{
    const {id}= req.params;
    const deleteitem= await Founditem.findByIdAndDelete(id);

    if(!deleteitem){
        res.status(404).json({message:"Item not found"});
    }

    res.status(200).json({message:"Deleted item successfully",
        data:deleteitem
    })
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message})
    }
}
module.exports ={
    Additemfound ,
    GetAllFoundItems,
    GetItemsById,
    UpdateFoundItem,
    DeleteFounditem,
};
