const { create, list, getbyid, update, remove,checkuser } = require("../controller/adminusers.controller");
const router = require("express").Router();

router.post("/create", create);
router.get("/list", list);
router.get("/getbyid/:userid", getbyid);
router.post("/update/:id", update);
router.delete("/delete/:id", remove);

router.post("/checkuser", checkuser);

module.exports = router;
