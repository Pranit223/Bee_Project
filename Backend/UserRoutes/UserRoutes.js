const express=require("express");
const { registerUser, authUser, allUsers } = require("../Controllers/RegisterController");
const {protect} = require("../Middleware/AuthMiddleware");
const router=express.Router();


router.route('/').post(registerUser).get(protect,allUsers);
router.post('/login',authUser);

module.exports=router;