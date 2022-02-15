'use strict'

const router = require('express').Router();

/* controller */
const technology = require('../controllers/technology');
/* controller */
const middleware = require('../helper/middleware');

router.post('/create', /* middleware.routeMiddleWares */ technology.addTechnology);
router.delete("/:id", /* middleware.routeMiddleWares */ technology.delete);
router.get("/", /* middleware.routeMiddleWares */ technology.getTechnologies);

module.exports = router;