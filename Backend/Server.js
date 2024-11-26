const express=require("express");
const chats=require('./Data/data');
const dotenv=require("dotenv");
const connectDB = require("./config/db");
const userRoutes=require('./UserRoutes/UserRoutes');
const chatRoutes=require('./UserRoutes/ChatsRoutes');
const messageRoutes=require('./UserRoutes/MessageRoutes');

const app=express();

app.use(express.json());
dotenv.config();
connectDB();

const PORT=process.env.PORT ||5000 ;




app.get('/',(req,res)=>{
    res.send("api is running");
});


app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);





const server=app.listen(PORT,console.log(`Server started at port ${PORT}`));

const io=require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:"https://bee-project-blond.vercel.app/",
    },
});

io.on("connection",(socket)=>{
    console.log("connected to socket io");


// i had two option either send message using userid or room id i choose room id
//and i am using userid to send notification
    socket.on("setup",(userData)=>{
        console.log("userdata id"+userData._id);
        socket.join(userData._id);
        socket.emit("connected");
    });

//making changes..........................................................

    // socket.emit("connected");

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("user joined "+room);

    });


    socket.on("typing",(room)=>socket.in(room).emit("typing")); 
    socket.on("stop typing",(room)=> socket.in(room).emit("stop typing"));




    socket.on("new message",(newMessageRecieved)=>{
       var chat=newMessageRecieved.chat;
       if(!chat.users){
        return console.log("chat.users not defined");
       }
        console.log(chat);

        socket.to(chat._id).emit("message recieved",(newMessageRecieved))





        chat.users.forEach((user) => {
            if(user._id == newMessageRecieved.sender._id)return;


            console.log("checkpointiuhgbudverfs4wzsvystrcta5cyvd")

            socket.in(user._id).emit("notification",(newMessageRecieved))
        });

        
    
        });

    socket.off("setup",()=>{
        console.log("User Disconnected");
        socket.leave(user._id);
    });
   
     
});


