const express = require( "express");
const mongoose = require( "mongoose");
const cors = require( "cors");
const dotenv = require( "dotenv");
const connectDB = require( "./config/dbconn.js");
const Loginrouter = require( "./router/Loginrouter.js");
const Signuprouter = require( "./router/Signuprouter.js");
dotenv.config();              // 🔴 MUST COME FIRST
connectDB();                  // connects MongoDB

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", Loginrouter);
app.use("/api", Signuprouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
