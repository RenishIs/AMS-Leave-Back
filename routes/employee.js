'use strict'

const router = require('express').Router();
const middleware = require('../helper/middleware');

/* controller */
const employee = require('../controllers/employee');
/* controller */

router.post('/signup', employee.signup);
router.post("/login", employee.login);
router.post('/create', employee.indirectSignup);
router.post('/sendInvitation',
    /* middleware.routeMiddleWares, */
    employee.sendInvitation);
router.post('/passwordResetByHR', employee.passwordResetByHR)
router.post('/multipleEmployeeCreate',
    middleware.routeMiddleWares, middleware.passwordEncrypt, employee.multipleEmployeeCreate);
router.post('/userProfile/:id',
    middleware.imageSaveMiddlewares, employee.updateProfileImage);
router.post('/profile',
    /* middleware.routeMiddleWares, */
    employee.getProfileByEmail);
router.post("/changePassword",
    /* middleware.routeMiddleWares, */
    employee.changePassword);

router.put("/resetPassword",
    /* middleware.routeMiddleWares, */
    employee.resetPassword);

router.post("/sendResetPasswordLink",
    /* middleware.routeMiddleWares, */
    employee.sendResetPasswordLink);

router.get("/getAllRoles",
    /* middleware.routeMiddleWares, */
    employee.getAllRoles);

router.get('/:id',
    /* middleware.routeMiddleWares, */
    employee.getProfileById);

router.put('/:id',
    /* middleware.routeMiddleWares, */
    middleware.imageSaveMiddlewares, employee.getProfileById);
router.delete('/:id',
    /* middleware.routeMiddleWares, */
    employee.deleteEmployee);

router.put('/updateEmploye/:id',
    /* middleware.routeMiddleWares, */
    employee.updateEmploye);

router.put('/updatePassword/:id',
    /* middleware.routeMiddleWares, */
    employee.updatePassword);

router.get('/',
    /* middleware.routeMiddleWares, */
    employee.getEmployes);

module.exports = router;