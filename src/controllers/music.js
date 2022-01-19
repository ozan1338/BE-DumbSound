const createError = require("http-errors")
const {music,artist} = require("../../models");

const addMusic = async(req,res,next)=>{
    try {
        const {...newData} = req.body

        console.log(req.files);

        const imageSrc = "http://localhost:8080/uploads/" + req.files[0].filename
        const musicSrc = "http://localhost:8080/uploads/" + req.files[1].filename

        const data = await music.create({
            ...newData,
            thumbnail: imageSrc,
            attache: musicSrc
        })

        res.send({
            data
        })


    } catch (err) {
        console.log(err);
        next(err)
    }
}

const getAllMusic = async(req,res,next)=>{
    try {
        const data = await music.findAll({
            attributes: {
                exclude: ["createdAt","updatedtAt","artisId"]
            },
            include: {
                model: artist,
                as: "artist",
                attributes: {
                    exclude: ["createdAt","updatedAt"]
                }
            }
        },(err)=>{
            throw createError.InternalServerError()
        })

        res.send({
            data
        })

    } catch (err) {
        console.log(err);
        next(err)
    }
}

module.exports = {
    addMusic,
    getAllMusic
}