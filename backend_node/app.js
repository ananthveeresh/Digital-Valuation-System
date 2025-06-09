
const express = require('express');
const dotenv = require('dotenv')
require("./token/tokenfunctions")()
sha512 = require('js-sha512');
const baseurl = "/";
const app = express();

dotenv.config({ path: '.env' })
const port = process.env.PORT || 5006;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();


    // if (req.get('AuthToken')) {
    //     const authtokeninfo = JSON.parse(req.get('AuthToken'));
    //     const authToken = { "email": authtokeninfo.email, "token": authtokeninfo.token };

    //     validateToken(authToken).then(function(result) {
    //         if (result.status === 200) {
    //           next();
    //         } else {
    //           res.status(401).json('Not a valid token');
    //         }
    //       })
    //       .catch(function(error) {
    //         res.status(500).json('Error validating token');
    //       });
    //   } else {
    //     if(req.get('x-aei-token')){
    //         createToken('ram@aditya.ac.in').then(function(result) {
    //             console.log(result);
    //         });

    //     }else{
    //       res.status(401).json('Missing token');
    //     }
    //   }
})

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Middleware to parse the incoming raw body data as a buffer
app.use(express.raw({ type: 'application/pdf', limit: '50mb' }));

// ************* Digital Valuation Sysytem **************** //

const autoincrement = require("./router/autoincrement.router")
app.use(baseurl + "autoincrement", autoincrement);

const adminusers = require("./router/adminusers.router")
app.use(baseurl + "adminusers", adminusers);

const questionmodel = require("./router/questionmodel.router")
app.use(baseurl + "questionmodel", questionmodel);

const subjectmaster = require("./router/subjectmaster.router")
app.use(baseurl + "subjectmaster", subjectmaster);

const campusmaster = require("./router/campus.router")
app.use(baseurl + "campusmaster",campusmaster);

const exammaster = require("./router/exammaster.router")
app.use(baseurl + "exammaster", exammaster);

const ftpserver = require("./router/ftpserver.router")
app.use(baseurl + "ftpserver", ftpserver);

const faculty = require("./router/faculty.router")
app.use(baseurl + "faculty", faculty);

const logininfo = require("./router/logininfo.router")
app.use(baseurl + "logininfo", logininfo);

const answerpapers = require("./router/answerpapers.router")
app.use(baseurl + "answerpapers", answerpapers);


const semister = require("./router/semister.router")
app.use(baseurl + "semister", semister);

const studentreg = require("./router/studentreg.router")
app.use(baseurl + "studentreg", studentreg);

const downloadtracking = require("./router/downloadtracking.router")
app.use(baseurl + "downloadtracking", downloadtracking);

const permissioninfo = require("./router/permissioninfo.router")
app.use(baseurl + "permissioninfo", permissioninfo);

app.get("/", (req, res) => {
    res.json({
        message: "Digital Valuation System API Working"
    })
})

app.listen(port, () => {
    console.log(`Digital Valuation System Server up and running on port : http://localhost:${port}`)
})
