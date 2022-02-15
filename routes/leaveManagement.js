'use strict'

const router = require('express').Router();
const middleware = require('../helper/middleware');

/* controller */
const leaveManagement = require('../controllers/leaveManagement');
/* controller */

router.post('/login', leaveManagement.login);
router.post('/register', leaveManagement.signup);
router.get('/users', middleware.routeMiddleWares, leaveManagement.getUsers);
router.delete('/deleteUser/:id', middleware.routeMiddleWares, leaveManagement.deleteUser);

router.get('/leaves', middleware.routeMiddleWares, leaveManagement.getLeaves);
router.delete('/deleteLeave/:id', middleware.routeMiddleWares, leaveManagement.deleteLeave);
router.post('/addLeave', middleware.routeMiddleWares, leaveManagement.addLeave);
router.get('/getLeavesById/:id', middleware.routeMiddleWares, leaveManagement.getLeaveByUserId);

module.exports = router;