const express = require("express");
const jwt =require( 'jsonwebtoken');
const AdminModel =require( '../Models/Admin.js');


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
    const newAdmin = new AdminModel({ FirstName, LastName, RegistrationNumber, Email, Password });
    const admin = await newAdmin.save();
    return res.json(admin);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//route to get all admin

router.get('/', async (req,res)=>{
        try{
                const admins = await AdminModel.find({});
                return res.status(200).json({
                        count:admins.length,
                        data:admins,
                });
        }catch(err){
                console.error(err.message);
                res.status(500).send('Server Error');
        }
})
// get admin by id

router.get('/:id', async (req,res)=>{
        try{
                const admin = await AdminModel.findById(req.params.id);
                if(!admin){
                        return res.status(404).json({msg: 'Admin not found'});
                }
                res.status(200).json(admin);
        }catch(err){
                console.error(err.message);
                if(err.kind === 'ObjectId'){
                        return res.status(404).json({msg: 'Admin not found'});
                }
                res.status(500).send('Server Error');
        }
})

// update admin by id

router.put('/:id', async (req,res)=>{
        try{
                const admin = await AdminModel.findByIdAndUpdate(req.params.id,req.body,{new: true});
                if(!admin){
                        return res.status(404).json({msg: 'Admin not found'});
                }
                res.status(200).json(admin);
        }catch(err){
                console.error(err.message);
                if(err.kind === 'ObjectId'){
                        return res.status(404).json({msg: 'Admin not found'});
                }
                res.status(500).send('Server Error');
        }
})
// delete admin by id

router.delete('/:id', async (req,res)=>{
        try{
                const admin = await AdminModel.findByIdAndDelete(req.params.id);
                if(!admin){
                        return res.status(404).json({msg: 'Admin not found'});
                }
                res.status(200).json({ message: 'Admin deleted successfully ' });
        }catch(err){
                console.error(err.message);
                res.status(500).send('Server Error');
        }
})

// Route to login a driver
router.post('/login', async (req, res) => {
    const {Email,Password} =req.body;
    AdminModel.findOne({Email})
    .then(admin=>{
            if(admin){
                    if(admin.Password === Password){
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
