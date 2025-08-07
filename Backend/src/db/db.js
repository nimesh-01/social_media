const mongoose=require("mongoose");

function connectDb(){
    mongoose.connect(process.env.MONGO_DB).then(()=>{
        console.log("Database Connected");
    }).catch((err)=>{
        console.log(err);
        
    })
}
module.exports=connectDb;