const mongoose =require( "mongoose");
const RepairSchema=new mongoose.Schema({
        DriverName:String,
        car:String,
        car_id:Number,
        car_type:String,
        car_model:String,
        reclamation:String,


})
const RepairModel=mongoose.model("Repair",RepairSchema);
module.exports = RepairModel;
