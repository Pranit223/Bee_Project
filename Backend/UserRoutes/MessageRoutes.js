const express=require("express");
const {protect} = require("../Middleware/AuthMiddleware");
const { sendMessage, allMessage } = require("../Controllers/MessageController");

const router=express.Router();


router.route('/').post(protect,sendMessage);

router.route('/:chatId').get(protect,allMessage);

module.exports=router;