const { create, list, getbyid, update, remove } = require("../controller/questionmodel.controller");
const router = require("express").Router();

router.post("/create", create);
router.get("/list", list);
router.get("/getbyid/:modelid", getbyid);
router.post("/update/:id", update);
router.delete("/delete/:id", remove);


module.exports = router;
