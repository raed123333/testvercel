const express = require("express");
const jwt =require( 'jsonwebtoken');
const DriverModel =require( "../Models/Driver.js");


const router = express.Router();
const ACCESS_TOKEN_SECRET = "jwt-access-token-secret-key";
const REFRESH_TOKEN_SECRET = "jwt-refresh-token-secret-key";

// Route to save a new driver
router.post("/", async (req, res) => {
  try {
    const { FirstName, LastName, RegistrationNumber, Email, Password } = req.body;
    if (!FirstName || !LastName || !RegistrationNumber || !Email || !Password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }
    const newDriver = new DriverModel({ FirstName, LastName, RegistrationNumber, Email, Password });
    const driver = await newDriver.save();
    return res.json(driver);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}); 
// route to get all the driver driver

router.get('/', async (req,res)=>{
        try{
               // const drivers = await DriverModel.find({});
                return res.status(200).json({
                        count:10,
                });
        }catch(err){
                console.error(err.message);
                res.status(500).send('Server Error');
        }
}) 
// route to get driver

router.get('/:id', async (req,res)=>{
        try{
                const driver = await DriverModel.findById(req.params.id);
                if(!driver){
                        return res.status(404).json({msg: 'Driver not found'});
                }
                return res.status(200).json(driver);
        }catch(err){
                console.error(err.message);
                if(err.kind === 'ObjectId'){
                        return res.status(404).json({msg: 'Driver not found'});
                }
                res.status(500).send('Server Error');
        }
})
//route to update a driver

router.put('/:id', async (req,res)=>{
        try{
                const driver = await DriverModel.findByIdAndUpdate(req.params.id,req.body);
                if(!driver){
                        return res.status(404).json({msg: 'Driver not found'});
                }
                return res.status(200).send({ message: 'Driver update successfully ' });

        }catch(err){
                return res.status(500).send({message: err.message});
        }

})

//route to delete a driver

router.delete('/:id', async (req,res)=>{
        try{
                const driver = await DriverModel.findByIdAndDelete(req.params.id);
                if(!driver){
                        return res.status(404).json({message: 'Driver not found'});
                }
                return res.status(200).send({ message: 'Driver deleted successfully ' });

        }catch(err){
                return res.status(500).send({message: err.message});
        }

})


// Route to login a driver
router.post('/login', async (req, res) => {
    const {Email,Password} =req.body;
    DriverModel.findOne({Email})
    .then(driver=>{
            if(driver){
                    if(driver.Password === Password){
                            const accessToken = jwt.sign({ Email: Email }, "jwt-access-token-secret-key", { expiresIn: '1m' });
                            const refreshToken = jwt.sign({ Email: Email }, "jwt-refresh-token-secret-key", { expiresIn: '5m' });
                            res.cookie('accessToken', accessToken, { maxAge: 60000, secure: false }); 
                            res.cookie('refreshToken', refreshToken, { maxAge: 300000, httpOnly: true, secure: false, sameSite: 'strict' });
        
                            return res.json({ Login: true, message: "succes" ,token:accessToken});
                    }else{
                            return res.json({ Login: false, Message: "pwd not coorect" });
                    }
            }else{
                    return res.json({ Login: false, Message: "not found userres" });
            }
            

    })
    .catch(err=>{
            console.error(err.message);
            return res.status(500).json({ message: err.message });
    })


})

const varifyDriver=(req,res,next)=>{
    const accessToken=req.cookies.accessToken;
    if(!accessToken){
        if(renewToken(req,res)){
            next();
        }
    }else{
        jwt.verify(accessToken,'jwt-access-token-secret-key',(err,decoded)=>{
            if(err){
                return res.json({valid:false, message:"not authenticated"})
            }else{
                req.email=decoded.email;
                next();
            }
        })
        
    };
}

const renewToken=(req,res)=>{
    const refreshtoken=req.cookies.refreshToken;
    let exist=false;
    if(!refreshtoken){
        return res.json({valid:false, message:"not refresh token"})
    }else{
        jwt.verify(refreshtoken,'jwt-refresh-token-secret-key',(err,decoded)=>{
            if(err){
                return res.json({valid:false, message:"invalid refresh token  token"})
            }else{
                const accessToken = jwt.sign({ email:decoded.email }, "jwt-access-token-secret-key", { expiresIn: '1m' });
                res.cookie('accessToken', accessToken, { maxAge: 60000});
                exist=true;
            }
        })
        
    };
    return exist;

}
module.exports = router;
