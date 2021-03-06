const createError = require("http-errors")
const {artist} = require("../../models")

const addArtist = async(req,res,next)=>{
    try {

        const {...newData} = req.body

        const data = await artist.create({...newData})

        res.send({
            data
        })
    } catch (err) {
        console.log(err);
        next(err)
    }
}

const getAllArtist = async(req,res,next)=>{
    try {
        const data = await artist.findAll()

        res.send({
            data
        })

    } catch (err) {
        console.log(err);
        next(err)
    }
}

module.exports = {
    addArtist,
    getAllArtist
}