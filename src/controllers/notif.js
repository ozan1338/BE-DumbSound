const {user,notif} = require("../../models")
const createError = require("http-errors")

const addNotif = async(req,res,next) =>{
    try {
        
        const {userId} = req.params

        await notif.create({
            status: "false",
            userId
        })

        const userData = await user.findOne({
            where: {
                id: userId
            },
            include: {
                model: notif,
                as: "notif"
            }
        })

        res.send({
            status: "success"
        })

    } catch (err) {
        next(err)
        console.log(err);
    }
}

const updateNotif = async(req,res,next) => {
    try {
        const newData = req.body
        const {userId} = req.params

        console.log("updateNotif");
        console.log(newData);

        await notif.update({
            status: newData.status,
            message: newData.message
        },{
            where: {
                userId
            }
        },(err)=>{
            if(err){
                throw createError.InternalServerError()
            }
        })

        res.send({
            status: "success"
        })

    } catch (err) {
        next(err)
        console.log(err);
    }
}

const getNotifByUserId = async(req,res,next) => {
    try{
        const {userId} = req.params

        const data = await notif.findOne({
            where:{
                userId
            }
        })

        console.log("notif");

        res.send({
            data
        })

    }catch(err){
        next(err)
        console.log(err);
    }
}

module.exports ={
    addNotif,
    updateNotif,
    getNotifByUserId
}