const { insertfaculty,create, list,campuslist, facultylist, getbyid,remove  } = require("../controller/faculty.controller");
const router = require("express").Router();


router.get("/insertfaculty/:campus", insertfaculty);
router.post("/create", create);
router.post("/list", list);
router.post("/campuslist", campuslist);
router.post("/facultylist", facultylist);
router.get("/getbyid/:subjectId", getbyid);
router.get("/delete/:id", remove);


module.exports = router;
