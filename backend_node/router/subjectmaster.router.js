const { create, list, getbyid, getbygroup,update, remove } = require("../controller/subjectmaster.controller");
const router = require("express").Router();

router.post("/create", create);
router.get("/list", list);
router.get("/getbyid/:subjectId", getbyid);
router.post("/getbygroup", getbygroup);
router.post("/update/:id", update);
router.delete("/delete/:id", remove);


module.exports = router;
