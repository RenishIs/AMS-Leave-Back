'use strict'

const router = require('express').Router();

/* controller */
const notification = require("../controllers/notification");
/* controller */

const middleware = require("../helper/middleware")

router.post("/create", notification.add);
router.delete('/:id', middleware.routeMiddleWares, notification.delete);
router.put('/:id', middleware.routeMiddleWares, notification.put);
router.get('/:id', middleware.routeMiddleWares, notification.getById);
router.get('/', notification.get);

module.exports = router;