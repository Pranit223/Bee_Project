const jwt=require("jsonwebtoken");

const User=require("../modles/UserModel");

const asyncHaldler=require("express-async-handler");
const { Error } = require("mongoose");



const protect =asyncHaldler(async(req,res,next)=>{
    let token;


    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")

    )
    {
        try {
            token=req.headers.authorization.split(" ")[1];
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            // console.log(`decoded=${decode.id}`);
            req.user=await User.findById(decode.id).select("-password");
            // console.log(`req user= ${req.user.id}`)


            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorised,Token failed");
        }
        
    }
})
module.exports={protect};