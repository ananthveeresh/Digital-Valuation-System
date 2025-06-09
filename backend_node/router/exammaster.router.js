const { create, list,campussubjects, getbyid, update, remove,getbypapercode,getsubpapercode,examslist,subjectfaculty,analysissection,getsectionwisestudentslist,getcoursewisestudentslist,digitexamsubjects,facultyupdate,studentgetboardid,examsschoolhallticket } = require("../controller/exammaster.controller");
const router = require("express").Router();

router.post("/create", create);
router.get("/list", list);
router.get("/campussubjects/:campus", campussubjects);
router.get("/getbyid/:examId", getbyid);
router.post("/update/:id", update);
router.delete("/delete/:id", remove);
router.post("/getbypapercode", getbypapercode);
router.post("/getsubpapercode", getsubpapercode);

router.get("/examslist", examslist);
router.post("/subjectfaculty", subjectfaculty);
router.post("/facultyupdate", facultyupdate);

//analysis apis
router.get("/analysissection/:year/:campus", analysissection);
router.post("/getsectionwisestudentslist", getsectionwisestudentslist);
router.post("/getcoursewisestudentslist", getcoursewisestudentslist);
router.post("/digitexamsubjects", digitexamsubjects);
router.get("/studentgetboardid/:suc", studentgetboardid);
router.post("/examsschoolhallticket", examsschoolhallticket);


module.exports = router;
