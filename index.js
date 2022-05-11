// server creation steps
// Import express

const express=require('express');
const dataservice=require('./services/dataservice')
const jwt=require('jsonwebtoken')
// create server app using express

const app=express()
// convert json
app.use(express.json())

// cores 
const cors=require('cors')

app.use(cors({
    origin:"http://localhost:4200"
}))
// resolving app requests
// GET -to read data

app.get('/',(req,res)=>{
    res.send("GET REQUEST")
})
// app.post('/',(req,res)=>{
//     res.send("POST REQUEST")
// })
app.put('/',(req,res)=>{
    res.send("PUT REQUEST")
})
app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST")
})
app.delete('/',(req,res)=>{
    res.send("DELETE REQUEST")
})
const jwtMiddleware=(req,res,next)=>{
try{
    const token =req.headers["x-access-token"]
    const data=jwt.verify(token,'secretcode123')
     req.currentAcno=data.currentAcno
    next()
}
catch{
    res.status(401).json({
        status:false,
        message:"Please Log In..."
    })
}
}
app.post('/register',(req,res)=>{
    dataservice.register(req.body.uname,req.body.acno,req.body.password)
    .then(result=>{res.status(result.statusCode).json(result)
    })
})
    app.post('/login',(req,res)=>{
       dataservice.login(req.body.acno,req.body.pswd)
       .then(result=>{res.status(result.statusCode).json(result)
       })
   
})
app.post('/deposit',jwtMiddleware,(req,res)=>{
    dataservice.deposit(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{res.status(result.statusCode).json(result)
    })

})

app.post('/withdraw',jwtMiddleware,(req,res)=>{
    dataservice.withdraw(req,req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{res.status(result.statusCode).json(result)
    })

})
app.post('/transaction',jwtMiddleware,(req,res)=>{
    dataservice.transaction(req.body.acno)
    .then(result=>{res.status(result.statusCode).json(result)
    })})
app.delete('/onDelete/:acno',jwtMiddleware,(req,res)=>{
    dataservice.delAcc(req.params.acno)
    .then(result=>{res.status(result.statusCode).json(result)
    })
})

// set port number

app.listen(3000,()=>{
    console.log("Server started at 3000");
})

