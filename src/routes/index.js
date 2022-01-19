const express = require("express")
const router = express.Router()

//import VerifyToken from jwt middleware
const {verifyToken} = require("../middleware/jwt")

//import multer from multer middleware
const uploadFile = require("../middleware/multer")

//user controller
const {registerUser,loginUser} = require('../controllers/user')

//payment contorller
const {addPayment, getAllPayment, updateStatus} = require("../controllers/payment")

//artist controller
const {addArtist} = require("../controllers/artist")

//music controller
const {addMusic,getAllMusic} = require("../controllers/music")

//Router user
router.post("/user/register", registerUser)
router.post("/user/login", loginUser)

//Route payment
router.post("/transaction", verifyToken, uploadFile("attache"), addPayment)
router.get("/transaction", verifyToken, getAllPayment)
router.patch("/transaction/:id", updateStatus)

//Route artist
router.post("/artist", verifyToken, addArtist)

//Route music
router.post("/music", verifyToken, uploadFile("thumbnail","attache") , addMusic)
router.get("/music", getAllMusic)

module.exports = router;