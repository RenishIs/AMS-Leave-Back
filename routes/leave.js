'use strict'

const router = require('express').Router();
const middleware = require('../helper/middleware');

/* controller */
const leave = require('../controllers/leave');
/* controller */

router.post('/add', middleware.routeMiddleWares, leave.add);
router.get('/', middleware.routeMiddleWares, leave.get);

module.exports = router;