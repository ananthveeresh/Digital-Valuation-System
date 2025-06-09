const { create, list, getbyid,studentdata, getbygroup,update, remove } = require("../controller/permissioninfo.controller");
const router = require("express").Router();

router.post("/create", create);
router.get("/list", list);
router.post("/studentdata", studentdata);
router.get("/getbyid/:subjectId", getbyid);
router.post("/getbygroup", getbygroup);
router.post("/update/:id", update);
router.delete("/delete/:id", remove);


module.exports = router;
