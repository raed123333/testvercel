


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Port, mongoDBURL } =require("./config.js");
const RequestRepair =require( "./Routes/RequestRepair.js");
const MaintenancePlan =require( "./Routes/MaintenancePlan.js");
const DriverPanel =require( "./Routes/DriverPanel.js");
const cookieParser =require( "cookie-parser");
const AdminPanel =require( "./Routes/AdminPanel.js");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["https://deploy-mern-1whq.vercel.app"],
  methods:["POST","GET"],
  credentials: true,
}));

// Routes
app.use("/requestrepair", RequestRepair);
app.use("/maintenancePlan", MaintenancePlan);
app.use("/driver", DriverPanel);
app.use("/admin", AdminPanel);

// MongoDB connection and server start
mongoose.connect(mongoDBURL)
        .then(()=>{
                console.log('Connected to MongoDB...');
                app.listen(Port, () => console.log(`Server running on port ${Port}`));
 
        })
        .catch((error) => console.error(`Error connecting to MongoDB: ${error}`));

        app.listen(3000, () => console.log("Server ready on port 3000."));
