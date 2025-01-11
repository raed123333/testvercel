const mongoose =require( "mongoose");
const DriverSchema = new mongoose.Schema({
        FirstName:String,
        LastName:String,
        RegistrationNumber:String,
        Email:String,
        Password:String
        
        
})

const DriverModel=mongoose.model("Driver",DriverSchema);
module.exports = DriverModel;
