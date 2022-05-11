// import mongoose
const mongoose=require('mongoose');
// connection string to connect db with sever
 mongoose.connect('mongodb://localhost:27017/bankServer',{
useNewUrlParser:true
 })
// create model
const User=mongoose.model("User",{
    acno:Number,
    uname:String,
    password:String,
    balance:Number,
    transaction:[]
})
module.exports={
User
}