'use strict'

const router = require('express').Router();
const middleware = require('../helper/middleware');

/* controller */
const dashboard = require('../controllers/dashboard');
/* controller */

router.post('/', dashboard.add);
router.delete('/:id', /* middleware.routeMiddleWares, */ dashboard.delete);
router.get('/', dashboard.get);

module.exports = router;