const dbConfig = require("../config/db.mongo.js");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId; 
mongoose.Promise = global.Promise;
const db = {};
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
db.con = mongoose.connection

db.autoIncrement = require("./autoincrement.js")(mongoose);
db.adminusers = require("./adminusers.js")(mongoose);
db.questionmodel = require("./questionmodel.js")(mongoose);
db.subjectmaster = require("./subjectmaster.js")(mongoose);
db.exammaster = require("./exammaster.js")(mongoose);
db.faculty = require("./faculty.js")(mongoose)
db.answerpapers = require("./answerpapers.js")(mongoose)
db.logininfo = require("./logininfo.js")(mongoose)
db.campusmaster = require("./campusmaster.js")(mongoose)

//semister
db.semister = require("./semister.js")(mongoose)
db.studentreg = require("./studentreg.js")(mongoose)
db.downloadtracking = require("./downloadtracking.js")(mongoose)
db.permissioninfo = require("./permissioninfo.js")(mongoose)

module.exports = db;
