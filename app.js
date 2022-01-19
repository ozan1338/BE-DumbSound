const express = require("express")
const createError = require("http-errors")
const morgan = require("morgan")
require('dotenv').config();
const cors = require("cors")

//import route from src/index/
const router = require('./src/routes')

const app = express();

//serve static file
app.use('/uploads', express.static('uploads'))

const PORT = 8080;

//user morgan
app.use(morgan("dev"))

//use cors
app.use(cors())
//parse json
app.use(express.json());

//add endpoint router
app.use('/api/v1/', router)

//handle error if endpoint not found
app.use(async(req,res,next)=>{
    next(createError.NotFound("endpoint not found"))
})

//catch every error
app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.send({
        error:{
            status: err.status || 500,
            message: err.message
        }
    })
})

app.listen(PORT, ()=>{
    console.log(`Listening on Port ${PORT}`);
})