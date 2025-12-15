const Lostitem = require("../models/Lostitem");
//Create lost item
const Addlostitem = async(req,res)=>{
    try{
        const itemData = req.body;
        const newlostItem = new Lostitem(itemData);
        const savedItem = await newlostItem.save();

        res.status(201).json({
            message:"Lost item created",
            data:savedItem
        });

    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});

    }
};

//read all items
const  GetLostItem = async(req,res)=>{
    try{
        const items= await Lostitem.find();

        res.status(200).json({message:"Lost items fetched sucessfully",
            data:items
        })
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message})
    }
}

//read items by id

const GetLostItemById = async(req,res)=>{
    try{
        const {id}=req.params;
         const item = await Lostitem.findById(id);

         if(!item){
            res.status(404).json({message:"Item not found"})
         }

         res.status(200).json({message:"Found item successfully",data:item})

    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message})
    }
}

//Update item

const UpdateLostitem =async(req,res)=>{
    try{
        const{id}=req.params;
        const updatedata=req.body;
        const updateitem = await Lostitem.findByIdAndUpdate(id,updatedata,{new:true});

        if(!updateitem){
            res.status(404).json({message:"Item not found"});
        }

        res.status(200).json({message:"Item found successfully",data:updateitem})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error.message})
    }
}

const DeleteLostitem=async(req,res)=>{
    try{
        const {id}=req.params;
        const deleteitem = await Lostitem.findByIdAndDelete(id);

        if(!deleteitem){
            res.status(404).json({message:"Item not found to be deleted"})
        }
        res.status(200).json({message:"Item deleted successfully"})
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message})
    }
}
module.exports={
    Addlostitem,
    GetLostItem,
    GetLostItemById,
    UpdateLostitem,
    DeleteLostitem
};