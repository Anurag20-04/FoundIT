const express = require("express");
const cors = require("cors");
require("dotenv").config(); 

const app = express();
app.use(cors());

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("server is running");
});

const PORT = process.send.PORT || 5000;
app.listen(PORT,()=>{
    console.log("server is running on http://localhost:" + PORT);
}); 