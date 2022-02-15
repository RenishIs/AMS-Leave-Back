'use strict'

const router = require('express').Router();
const middleware = require("../helper/middleware")

/* controller */
const message = require('../controllers/message');
/* controller */

router.get('/getConversation/:senderId/:receiverId', middleware.routeMiddleWares, message.get);

router.post('/generateConversationId', middleware.routeMiddleWares, message.add);

router.put('/updateConversationBlock', middleware.routeMiddleWares, message.put);

router.get('/emloyeeChatList/:senderId', middleware.routeMiddleWares, message.getEmployeeChatList);

router.get('/allGroup', middleware.routeMiddleWares, message.getAllGroup);

router.get('/group/:conversationId', middleware.routeMiddleWares, message.findonegroup);

router.put('/groupName/:conversationId', middleware.routeMiddleWares, message.findGroupName);

module.exports = router;