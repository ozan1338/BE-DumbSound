const joi = require('joi')

const registerSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(4).required(),
    fullname: joi.string().required(),
    gender: joi.string().required(),
    phone: joi.number().required(),
    address: joi.string().required(),
    status: joi.number(),
    subscribe: joi.string()
})

const loginSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(4).required()
})

module.exports = {
    registerSchema,
    loginSchema
}