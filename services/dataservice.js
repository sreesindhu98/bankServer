const jwt=require('jsonwebtoken')
const db=require('./db')
database={
    1000:{acno:1000,uname:"Sree",password:123,balance:3000,transaction:[]},
    1001:{acno:1000,uname:"Riya",password:123,balance:4000,transaction:[]},
    1002:{acno:1000,uname:"anu",password:123,balance:5000,transaction:[]}
  }


  const register =(uname,acno,password)=>{
    return db.User.findOne({acno})
    .then(user=>{
      if(user){
        return{
          statusCode:401,
          status:false,
          message:"Account already Exist.."
        }
       }
       else{
         const newUser=new db.User({
          acno,
          uname,
          password,
          balance:0,
          transaction:[]
           
         })
         newUser.save()
         return{
          statusCode:200,
          status:true,
          message:"Successfully Registered..Please Log In"
        }
       }
    })
    
    }
 
   const login=(acno,pswd)=>{
   return  db.User.findOne({acno,password:pswd})
    .then(user=>{
       if(user){

        currentUser=user.uname
        currentAcno=acno
  const token=jwt.sign({
    currentAcno:acno
  },'secretcode123')
         return {
          statusCode:200,
          status:true,
          message:"Login Successful..",
          currentAcno,currentUser,token
         }
       }

       else{
        return {
          statusCode:401,
          status:false,
          message:"Invalid Credentials!"
         }
       }
    })
   
  }
  const deposit=(acno,pswd,amt)=>{
    let amount=parseInt(amt);
  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    if(user){
      user.balance+=amount
      user.transaction.push({type:"CREDIT",amount:amount})
      type=user.transaction
      user.save()
      return{ 
        statusCode:200,
        message:amount +"  Successfully Deposited.. New Balance is  "+user.balance
       }}
       else{
        return{
          statusCode:401,
          status:false,
          message:"Invalid credentials!"
         }
      }
  })
  }
 const withdraw=(req,acno,pswd,amt)=>{
    let amount=parseInt(amt);
  return db.User.findOne({acno,password:pswd})
  .then(user=>{
    if(req.currentAcno!=acno){
      return{
        statusCode:422,
        status:false,
        message:"Access Denied!"
       }}
       if(user){
        if(user.balance>amount){
          user.balance-=amount
         user.transaction.push({type:"DEBIT",amount:amount})
          type=user.transaction
          user.save()
          return{ 
            statusCode:200,
            message:amount +"  Successfully withdrawed.. Available Balance is  "+user.balance,
           }
        }
        else{
          return {
            statusCode:422,
            status:false,
            message:"Insufficient balance"
          }
        }
       }
       else{
        return{
          statusCode:401,
          status:false,
          message:"Invalid credentials!"
         }
       }
  })
  
  
  }
  const transaction=(acno)=>{  
    return db.User.findOne({acno})
    .then(user=>{
      if(user){
        return {
          statusCode:200,
          status:true,
          transaction:user.transaction}
      }
      else{
        return{
          statusCode:401,
          status:false,
          message:"Invalid credentials!"
         }
       }
    })
    
    
   
  }
const delAcc=(acno)=>{
return db.User.deleteOne({acno})
.then(user=>{
  if(!user){
    return{
      statusCode:401,
      status:false,
      message:"Operation Failed!"
     }
  }
  else{
    return{ 
      statusCode:200,
      message:"Account Number "+acno+" successfully deleted",
     }
  }
})
  }
   module.exports={

    register,
    login,deposit,withdraw,transaction,delAcc
   }
 
 