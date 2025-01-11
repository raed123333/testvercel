const express = require("express");
const  MaintenancePlanModel =require( '../Models/MaintenancePlan.js');

const router = express.Router();

//route for save new maintenance plan

router.post('/',async (req,res)=>{
        console.log(req.body);
        try{
                if(
                        !req.body.car_id||
                        !req.body.driver_name||
                        !req.body.amount||
                        !req.body.breakdownt_type||
                        !req.body.start_date
                ){
                        return res.status(400).json({msg: 'Please fill all fields'});
                }
                const newMaintenancePlan={
                        car_id:req.body.car_id,
                        driver_name:req.body.driver_name,
                        amount:req.body.amount,
                        breakdownt_type:req.body.breakdownt_type,
                        start_date:req.body.start_date,
                };
                const maintenancePlan = new MaintenancePlanModel(newMaintenancePlan);
                await maintenancePlan.save();
                res.status(200).json(maintenancePlan);
        }catch(err){
                console.error(err.message);
                res.status(500).send('Server Error');
        }
});

//route for get all maintenance plans
router.get('/',async(req,res)=>{
        try{
                const maintenancePlans = await MaintenancePlanModel.find({});
                return res.status(200).json({
                        count:maintenancePlans.length,
                        data:maintenancePlans,
                });
        }catch(err){
                console.error(err.message);
                res.status(500).send('Server Error');
        }
})

//route for get maintenance plan by id

router.get('/:id', async(req,res)=>{
        try{
                const maintenancePlan = await MaintenancePlanModel.findById(req.params.id);
                if(!maintenancePlan){
                        return res.status(404).json({msg: 'Maintenance Plan not found'});
                }
                res.status(200).json(maintenancePlan);
        }catch(err){
                console.error(err.message);
                if(err.kind === 'ObjectId'){
                        return res.status(404).json({msg: 'Maintenance Plan not found'});
                }
                res.status(500).send('Server Error');
        }
});

//route for update maintenance plan

router.put('/:id',async(req,res)=>{
        try{
                const maintenancePlan = await MaintenancePlanModel.findByIdAndUpdate(req.params.id,req.body,{new:true});
                if(!maintenancePlan){
                        return res.status(404).json({msg: 'Maintenance Plan not found'});
                }
                res.status(200).json(maintenancePlan);
        }catch(err){
                console.error(err.message);
                if(err.kind === 'ObjectId'){
                        return res.status(404).json({msg: 'Maintenance Plan not found'});
                }
                res.status(500).send('Server Error');
        }
});

//route for delete maintenance plan

router.delete('/:id',async(req,res)=>{
        try{
                const maintenancePlan = await MaintenancePlanModel.findByIdAndDelete(req.params.id);
                if(!maintenancePlan){
                        return res.status(404).json({msg: 'Maintenance Plan not found'});
                }
                res.status(200).json({msg: 'Maintenance Plan deleted'});
        }catch(err){
                console.error(err.message);
                if(err.kind === 'ObjectId'){
                        return res.status(404).json({msg: 'Maintenance Plan not found'});
                }
                res.status(500).send('Server Error');
        }
});

module.exports = router;
