const mongoose =require( "mongoose");
const AdminSchema=new mongoose.Schema({
        FirstName:String,
        LastName:String,
        RegistrationNumber:String,
        Email:String,
        Password:String
      
})
const AdminModel=mongoose.model("Admin",AdminSchema);
module.exports = AdminModel;
