const express = require("express");
const   RepairModel =require( '../Models/Repair.js')

const router = express.Router();

//route for save a new repair 

router.post('/', async (req, res) => {
        try {
            if (
                !req.body.DriverName ||
                !req.body.car ||
                !req.body.car_id ||
                !req.body.car_type ||
                !req.body.car_model ||
                !req.body.reclamation
            ) {
                return res.status(400).send({
                    message: 'Send all required fields',
                });
            }
    
            const newRepair = {
                DriverName: req.body.DriverName,
                car: req.body.car,
                car_id: req.body.car_id,
                car_type: req.body.car_type,
                car_model: req.body.car_model,
                reclamation: req.body.reclamation,
            };
    
            const repair = new RepairModel(newRepair);
            await repair.save();
            return res.status(200).send(repair);
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    });


//route for get all repairs

router.get('/', async (req,res)=>{
        try{
                const repairs = await RepairModel.find({});
                return res.status(200).json({
                        count:repairs.length,
                        data:repairs,
                });
        }catch(err){
                return res.status(500).send({message:err.message});
        }
})

//route for get one repair from database with id 

        router.get('/:id', async (req,res)=>{
                try{
                        const repair = await RepairModel.findById(req.params.id);
                        if(!repair) return res.status(404).send({message: 'Repair not found'});
                        return res.status(200).json(repair);
                }catch(err){
                        return res.status(500).send({message:err.message});
                }
        })

//route for update a repair 
        router.put('/:id',async(req,res)=>{
                try{
                        if(
                                !req.body.DriverName||
                                !req.body.car||
                                !req.body.car_id||
                                !req.body.car_type||
                                !req.body.car_model||
                                !req.body.reclamation
                        ){
                                return res.status(400).send({message: 'Send all required fields'});
                        }
                        const {id}=req.params;
                        const result=await RepairModel.findByIdAndUpdate(id,req.body);
                        if(!result){
                                return res.status(404).json({message: 'Repair not found'});
                        }
                        return res.status(200).send({ message: 'repair update successfully ' });

                }catch(err){
                        return res.status(500).send({message: err.message});
                }

        })

//route for delete a repair from database with id

        router.delete('/:id', async (req,res)=>{
                try{
                        const result = await RepairModel.findByIdAndDelete(req.params.id);
                        if(!result){
                                return res.status(404).json({message: 'Repair not found'});
                        }
                        return res.status(200).send({ message: 'Repair deleted successfully ' });
                }catch(err){
                        return res.status(500).send({message: err.message});
                }
        })

        module.exports = router;

