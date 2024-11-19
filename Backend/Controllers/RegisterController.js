const asyncHaldler=require("express-async-handler");
const User=require('../modles/UserModel');
const generateToken = require("../config/generateToken");






const registerUser=asyncHaldler(async(req,res)=>{



console.log("in registeruser");

const {name,email,password,pic}=req.body;


if(!name || !email || !password){
    res.status(400);
    throw new Error("Please enter all required Fields");

}

const userExist=await User.findOne({email});

if(userExist){
    res.status(400);
    throw new Error("User Already exist");
}

const user =await User.create({
    name,
    email,
    password,
    pic,
});
if(user){
    res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        token:generateToken(user._id),
        pic:user.pic,
    });
}else{
    res.status(400);
    throw new Error("Unable to create user");
}

});



const authUser=asyncHaldler(async(req,res)=>{

    const {email,password}=req.body;

    const user=await User.findOne({email});

    if(user && user.password==password){
        res.status(200).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id),
        });

    }
    else{
        console.log("Incorrect Email or Password");
        res.status(401);
        
        throw new Error("Incorrect Email or Password");
    }


});




const allUsers=asyncHaldler(async(req,res)=>{


    const keyword= req.query.search
    ?{
        $or:[
            {name:{$regex:req.query.search, $options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}},
        ],
    }
    :{};

    const users=await User.find(keyword).find({_id:{$ne:req.user._id}});

    
    res.send(users);
    // console.log(JSON.stringify(keyword, null, 2));

    // console.log(keyword);
 }) 


module.exports={registerUser,authUser,allUsers};