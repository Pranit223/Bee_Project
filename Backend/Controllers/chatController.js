const asyncHaldler=require("express-async-handler");
const User=require('../modles/UserModel');
const mongoose=require("mongoose");
const Chat=require("../modles/ChatModel");

//pointuybuyd

const accessChat=asyncHaldler(async(req,res)=>{
    const {userId} =req.body;
    // console.log(`The Requested userid is ${userId}`);

    if(!userId){
        console.log("UserId Param not sent with request");
        return res.sendStatus(400);
    }


    var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$eq:req.user._id}},
            {users:{$eq:userId}},
        ]
    }).populate("users","-password").populate("lastMessage");



    isChat=await User.populate(isChat,{
        path:"lastMessage.sender",
        select:" name pic email",
    });


    if(isChat.length>0){
        res.send(isChat[0]);
    }
    else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId],
        };


        try {
             
            const createdChat=await Chat.create(chatData);




            const FullChat=await Chat.findOne({_id:createdChat._id}).populate(
                "users",
                "-password"
            );
            res.send(FullChat);


        } catch (error) {

            res.status(400);
            console.log("ye last wali line hai");

            throw new Error(error.message);
            
        }
    }
    

});


const fetchChat=asyncHaldler(async(req,res)=>{' '

    try {
        Chat.find({users:{$eq:req.user._id}})
        .populate("users","-password")
        .populate("lastMessage")
        .populate("groupAdmin","-password")
        .sort({updatedAt:-1})
        .then(async(results)=>{
            // console.log(results);
            results=await User.populate(results,{
                path:"lastMessage.sender",
                select:" name pic email",
            });
        res.status(200).send(results);
        })
        // console.log("sara chat fetch hoo gaya")
        
    } catch (error) {
        console.log(error.message);
    }

});


const createGroupChat=asyncHaldler(async(req,res)=>{

// console.log("enterence")

    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"please Enter all required field"});
    }

var users=JSON.parse(req.body.users);

    if(users.length<2){
        return res
        .status(200)
        .send("Please Add More than 2 users");
    }

    users.push(req.user);



    try {
        const groupChat=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        });

        const fullGroupCht=await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");

        res.send(fullGroupCht);

    } catch (error) {
        res.send("error aa gaya groupchat create karne mei");
    }

});


const renameGroup=asyncHaldler(async(req,res)=>{

    const {chatId,chatName}=req.body;
    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName:chatName,
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");


    if(!updatedChat){
        res.send("No Chat Found");
    }
    else{
        res.send(updatedChat);
    }

});



const addToGroup=asyncHaldler(async(req,res)=>{

    const {chatId,userId}=req.body;

    const added=await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId},
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

if(!added){
    res.send("User Could not be added");
}
else{
    res.send(added);
}
});




const removeFromGroup=asyncHaldler(async(req,res)=>{
    const {chatId,userId}=req.body;


    const removed=await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId},
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");


    if(!removed){
        res.send("User Could not be added");
    }
    else{
        res.send(removed);
    }
});

module.exports={accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup};


