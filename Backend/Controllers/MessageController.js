const asyncHaldler=require("express-async-handler");
const Message = require("../modles/MessageModel");
const User = require("../modles/UserModel");
const Chat = require("../modles/ChatModel");


const sendMessage=asyncHaldler(async(req,res)=>{

    const {content, chatId}=req.body;

    if(!content || !chatId){
        console.log("content or chat id missing");

        return res.sendStatus(400);
    }

    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId,
    };


    try {
        var message =await Message.create(newMessage);
        message=await message.populate("sender","name pic");
        message=await message.populate("chat");
        message=await User.populate(message,{
            path:"chat.users",
            select:" name pic email",
        });
        await Chat.findByIdAndUpdate(req.body.chatId,{
            lastMessage:message,  
        });
        
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
});



const allMessage=asyncHaldler(async(req,res)=>{

//try
    try {
        var messages=await Message.find({chat:req.params.chatId}).populate("sender","name pic email")
        .populate("chat")
        // messages=await Message.populate(messages,{
        //     path:"chat.lastMessage",
        //     select:"content",
        // });

        res.json(messages);
        
    } catch (error) {
        console.log(error.message)
    }
    

     
});



module.exports={sendMessage,allMessage};