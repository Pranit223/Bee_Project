const mongoose=require("mongoose");


const connectDB=async()=>{
    try {
        const connect=await mongoose.connect(process.env.MONGO_URI,{
            
        });
        console.log("Connected To mongoDB")
    } catch (error) {
        console.log(`ERROR IS ${error.message}`);
    }
};

module.exports=connectDB;