const { create, list, validate, currentotps } = require("../controller/logininfo.controller");
const router = require("express").Router();

router.get('/list',list);
router.post('/create',create);
router.post('/validate',validate);
router.get('/currentotps',currentotps);

module.exports = router;
