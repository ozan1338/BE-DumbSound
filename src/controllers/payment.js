const createError = require("http-errors")
const {user,payment} = require("../../models")

const addPayment = async(req,res,next)=>{
    try {
        const {...data} = req.body
        const {id} = req.payload

        const startDate = () => {
            const date = new Date()
            let day = date.getDate()
            let month = date.getMonth()
            let year = date.getFullYear()

            return `${month+1}/${day}/${year}`
        }

        const dueDate = () => {
            const date = new Date()
            let day = date.getDate()
            let month = date.getMonth()
            let year = date.getFullYear()

            if(!month === 11 || month === 0){
                month = month + 2
            }else{
                month = 1
            }

            return `${month}/${day}/${year}`
        }

        //const imageSrc = "http://localhost:8080/uploads/" + req.files[0].filename

        const newPayment = await payment.create({
            ...data,
            attache: req.files[0].filename,
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

        //data.attache = 

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
        const data = req.body

        console.log(data.status);

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

        if(data.status === "Approve"){
            
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
        }else if(data.status === "cancel"){
            await user.update(
                {
                    subscribe: "False"
                },
                {
                    where: {
                        id: userWhoPaidForSubscribe.userId
                    }
                }
            )
        }

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