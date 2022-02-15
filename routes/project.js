'use strict'

const router = require('express').Router();
const middleware = require("../helper/middleware");

/* controller */
const project = require('../controllers/project');
/* controller */

router.post("/create", project.add);
router.get('/', project.get);
router.delete('/:id', middleware.routeMiddleWares, project.delete);
router.put('/:id', middleware.routeMiddleWares, project.put);
router.get('/:id', middleware.routeMiddleWares, project.getById);

module.exports = router;