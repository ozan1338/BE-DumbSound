const multer = require("multer")

const uploadFile = (file) => {
    //make  destination file for upload file
    const storage = multer.diskStorage({
        destination: function(req,file,cb){
            cb(null, "uploads") //file storage destination
        },
        filename: function(req,file,cb){
            cb(null, file.originalname.replace(/\s/g,"-"))
        }
    })

    //generating setting multer
    const upload = multer({
        storage
    }).any(file)

    return (req,res,next)=>{
        upload(req,res, (err)=>{
            try {
                return next()
            } catch (error) {
                console.log(error);
                next(error)
            }
        })
    }
}

module.exports = uploadFile