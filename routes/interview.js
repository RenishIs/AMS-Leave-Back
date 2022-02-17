'use strict'

const router = require('express').Router();

/* controller */
const interview = require('../controllers/interview');
/* controller */
const middleware = require('../helper/middleware');

router.post('/create', /* middleware.routeMiddleWares */ interview.addInterview);
router.delete("/:id", /* middleware.routeMiddleWares */ interview.delete);
router.get("/", /* middleware.routeMiddleWares */ interview.getInterview);
router.put("/:id", /* middleware.routeMiddleWares */ interview.put);
router.put("/acceptInterview/:id", /* middleware.routeMiddleWares */ interview.acceptInterview);

module.exports = router;