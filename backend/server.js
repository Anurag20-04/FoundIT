const express = require( "express");
const mongoose = require( "mongoose");
const cors = require( "cors");
const dotenv = require( "dotenv");
const connectDB = require( "./config/dbconn.js");
const Loginrouter = require( "./router/Loginrouter");
const Signuprouter = require( "./router/Signuprouter");
dotenv.config();            
connectDB();                  // connects MongoDB

const app = express();

app.use(cors());
app.use(express.json());

// Signup & Login
app.use("/api/login", Loginrouter);
app.use("/api/signup", Signuprouter);

// FoundItem CRUD
app.use("/found-items", require("./router/Founditemrouter"));

// LostItem CRUD
app.use("/lost-items", require("./router/Lostitemrouter"));

//notification router
const notificationRoutes = require("./router/notificationRouters");
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
