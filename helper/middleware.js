const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require("bcrypt");

const { v4: uuidv4 } = require('uuid');

/* model */
const role = require("../models/role");
/* model */

const routeMiddleWares = async (req, res, next) => {
    const bearerHeader = req.headers['x-access-token'] || req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        return jwt.verify(token, process.env.JWT_KEY, async (err, userData) => {
            if (err) {
                res.sendForbidden(err.toString());
            }
            else {
                req.user = userData;
                next();
            }
        })
    }
    else {
        res.sendUnAuthorized("token missing")
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, `${uuidv4()}.png`);
    }
});

const imageSaveMiddlewares = multer({ storage: storage });

const passwordEncrypt = async (req, res, next) => {
    for (let item of req.body) {
        await bcrypt.hash(item.password, 10, async (err, hash) => {
            try {
                const data = (!!item.role) ? await role.findOne({
                    "role": item.role
                }) : {}
                item.role = data?._id
            } catch (err) {
            }
            item.original_password = item.password
            item.password = hash
        });
    }
    setTimeout(() => {
        next();
    }, 1000);
}

module.exports = {
    routeMiddleWares: routeMiddleWares,
    imageSaveMiddlewares: imageSaveMiddlewares.single('image'),
    passwordEncrypt:passwordEncrypt
}