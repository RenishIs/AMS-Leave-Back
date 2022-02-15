'use strict'

const router = require('express').Router();

/* controller */
const skill = require('../controllers/skill');
/* controller */
const middleware = require('../helper/middleware');

router.post('/create', skill.addSkill);
router.get("/:id", /* middleware.routeMiddleWares, */ skill.getById);
router.put("/:id", /* middleware.routeMiddleWares, */ skill.update);
router.delete("/:id", /* middleware.routeMiddleWares, */ skill.delete);
router.get("/", skill.getSkills);

module.exports = router;