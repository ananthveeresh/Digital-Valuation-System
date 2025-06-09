const { create, list, getbyid, update, remove,sheetinfo,sheetinfofaculty,paperallotment,staffallotedpaper,savemarks,paperinfo,dashboardreport,paperallotedinfo,unallotment,saveanswerpdf,savepdf, facultystudentmarks,studentresult,deletesheet,subjectmarks,updatestudentinfo,sectionreport,getexamsubjectsuclist,scrutinyallotment,scrutinyallotmentinfo,scrutinyunallotment,scrutinyallotedpaper,scrutinyupdate,scrutinyerrorupdate,employeesummary,studentexamresult } = require("../controller/answerpapers.controller");
const router = require("express").Router();

router.post("/create", create);
router.get("/list", list);
router.get("/getbyid/:examId", getbyid);
router.post("/update/:id", update);
router.delete("/delete/:id", remove);

router.get("/dashboardreport", dashboardreport);
router.post("/sheetinfo", sheetinfo);
router.post("/sheetinfofaculty", sheetinfofaculty);
router.post("/deletesheet", deletesheet);

router.post("/paperallotment", paperallotment);
router.get("/paperinfo/:pid", paperinfo);
router.post("/paperallotedinfo", paperallotedinfo);
router.post("/unallotment", unallotment);


router.get("/staffallotedpaper/:paycode", staffallotedpaper);

router.post("/savemarks", savemarks);

router.post("/saveanswerpdf", saveanswerpdf);

router.post("/savepdf/:campus/:exam/:papercode/:subject/:suc", savepdf);

router.post("/facultystudentmarks", facultystudentmarks);

router.post("/studentresult",studentresult)

router.post("/subjectmarks",subjectmarks)

router.get("/updatestudentinfo/:examid",updatestudentinfo)

router.post("/sectionreport",sectionreport)


router.post("/getexamsubjectsuclist", getexamsubjectsuclist);
//scrutiny apis
router.post("/scrutinyallotment", scrutinyallotment);
router.post("/scrutinyallotmentinfo", scrutinyallotmentinfo);
router.post("/scrutinyunallotment", scrutinyunallotment);
router.get("/scrutinyallotedpaper/:paycode", scrutinyallotedpaper);
router.post("/scrutinyupdate", scrutinyupdate);

router.post("/scrutinyerrorupdate", scrutinyerrorupdate);

router.get("/employeesummary/:paycode", employeesummary);
router.get("/studentexamresult/:exam/:suc", studentexamresult);

module.exports = router;
