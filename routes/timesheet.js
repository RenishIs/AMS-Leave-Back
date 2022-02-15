'use strict'

const router = require('express').Router();
const middleware = require('../helper/middleware');
/* controller */
const timesheet = require('../controllers/timesheet');
/* controller */

router.post('/saveTimeSheet', middleware.routeMiddleWares, timesheet.saveTimeSheet);

router.get('/getTimeSheetByEmployeeCode/:employeeCode', middleware.routeMiddleWares, timesheet.getTimeSheetByEmployeeCode);

module.exports = router;