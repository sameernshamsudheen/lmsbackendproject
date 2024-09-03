const  express = require("express")

const userRoutes = express.Router()
const  userRegistration = require("../../controllers/userRegistraion/userRegistration")


userRoutes.post("/registration",userRegistration)



module.exports =userRoutes