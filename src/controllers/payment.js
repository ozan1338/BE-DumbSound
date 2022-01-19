const createError = require("http-errors")
const {user,payment} = require("../../models")

const addPayment = async(req,res,next)=>{
    try {
        const {...data} = req.body
        const {id} = req.payload

        const startDate = () => {
            const date = new Date()
            const day = date.getDate()
            const month = date.getMonth()
            const year = date.getFullYear()

            return `${day}/${month+1}/${year}`
        }

        const dueDate = () => {
            const date = new Date()
            const day = date.getDate()
            const month = date.getMonth()
            const year = date.getFullYear()

            if(!month === 11){
                month += 2
            }else{
                month = 1
            }

            return `${day}/${month}/${year}`
        }

        const imageSrc = "http://localhost:8080/uploads/" + req.files[0].filename

        const newPayment = await payment.create({
            ...data,
            attache: imageSrc,
            userId: id,
            status: "pending",
            startDate: startDate(),
            dueDate: dueDate()
        })

        const foundPayment = await payment.findOne({
            where: {
                id: newPayment.id
            },
            include : {
                model: user,
                as: "user",
                attributes: {
                    exclude: ["password","createdAt","updatedAt"]
                }
            },
            attributes: {
                exclude:["createdAt","updatedAt","userId"]
            }
        })

        res.send({
            data: foundPayment
        })

    } catch (err) {
        console.log(err);
        next(err)
    }
}

const getAllPayment = async(req,res,next)=>{
    try {
        const data = await payment.findAll({
            include: {
                model: user,
                as: "user",
                attributes: {
                    exclude: ["password","createdAt","updatedAt"]
                }
            },
            attributes: {
                exclude:["createdAt","updatedAt","userId"]
            }
        })

        res.send({
            data
        })
    } catch (err) {
        console.log(err);
        next(err)
    }
}

const updateStatus = async(req,res,next) => {
    try {
        const {id} = req.params
        const {...data} = req.body

        await payment.update({...data},{
            where: {
                id
            }
        }, (err)=>{
            if(err){
                throw createError.InternalServerError()
            }
        })

        const userWhoPaidForSubscribe = await payment.findOne({
            where: {
                id
            }
        },(err)=>{
            if(err){
                throw createError.InternalServerError()
            }
        })

        await user.update(
            {
                subscribe: "True"
            },
            {
                where: {
                    id: userWhoPaidForSubscribe.userId
                }
            }
        )

        res.send({
            msg: "success"
        })

    } catch (err) {
        console.log(err);
        next(err)
    }
}

module.exports = {
    addPayment,
    getAllPayment,
    updateStatus
}