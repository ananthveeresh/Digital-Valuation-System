const { create, list, getbyid, update, remove, updatePaymentInfo,secondsempaid } = require("../controller/studentreg.controller");
const router = require("express").Router();

router.post("/create", create);
router.get("/list", list);
router.get("/getbyid/:examId", getbyid);
router.post("/update/:id", update);
router.delete("/delete/:id", remove);

router.post("/updatePaymentInfo", updatePaymentInfo);

router.get("/secondsempaid", secondsempaid);
module.exports = router;
