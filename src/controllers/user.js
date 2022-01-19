const {registerSchema,loginSchema} = require("../middleware/joi")
const createError = require('http-errors')
const {createToken} = require("../middleware/jwt")
const {user} = require("../../models")
const bcrypt = require("bcrypt")

//Create Controller for register
const registerUser = async(req,res,next)=>{
    try {
        console.log(req.body);
        //chech if user input valid
        const isValid = await registerSchema.validateAsync(req.body)
        
        //search if email user is already register
        const doesExist = await user.findAll({
            where: {
                email: isValid.email
            }
        })

        //if email user is alredy exist throw an error with conflict status and message
        if(doesExist.length !== 0){
            throw createError.Conflict(`${isValid.email} is already register`)
        }

        //if email is available insert user to db
        const data = await user.create(isValid, (err)=>{
            if(err){
                throw createError.InternalServerError();
            }
        })

        //create Token for user
        const token = await createToken(data.id);

        res.send({
            msg: "success",
            token
        })

    } catch (error) {
        //check if the error is from joi or not
        if(error.isJoi === true ){
            //if the error from joi change status with 422
            error.status = 422
        }
        console.log(error);
        next(error)
    }
}

//Create contorller for login
const loginUser = async(req,res,next)=>{
    try {
        //check if user email and password is valid
        const isValid = await loginSchema.validateAsync(req.body)
        
        //search if email is in db or not
        const data = await user.findAll({
            where: {
                email: isValid.email
            }
        })

        //if email that user input there is no in our db throw error with message
        if(!data[0]){
            throw createError.NotFound("User not Register")
        }
        
        //compare password that user input and password in our db
        const isMatch = await bcrypt.compare(isValid.password, data[0].password)

        //if not match throw error
        if(!isMatch){
            throw createError.Unauthorized('Username or Password invalid')
        }

        //create token
        const token = await createToken(data[0].id)
        
        res.send({
            msg: "success",
            email: data[0].email,
            fullname: data[0].fullname,
            status: data[0].status,
            token
        })

    } catch (err) {
        //check if user is from joi
        if(err.isJoi === true){
            //if its from joi set the err.status 422 unprocessable entity
            err.status = 422
        }
        //console.log(err);
        next(err)
    }
}

module.exports = {
    registerUser,
    loginUser
}
