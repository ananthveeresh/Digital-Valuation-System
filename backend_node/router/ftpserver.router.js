const { fileinfo } = require("../controller/ftpserver.controller");
const router = require("express").Router();

router.post("/fileinfo", fileinfo);


module.exports = router;
