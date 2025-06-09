const { create, list, getbyid, update, remove, campusexam } = require("../controller/semister.controller");
const router = require("express").Router();

router.post("/create", create);
router.get("/list", list);
router.get("/getbyid/:examId", getbyid);
router.post("/update/:id", update);
router.delete("/delete/:id", remove);

router.get("/campusexam/:campus", campusexam);
//analysis apis


module.exports = router;
