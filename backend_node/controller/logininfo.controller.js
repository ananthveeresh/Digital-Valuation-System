const { json } = require("body-parser");
const db = require("../model");
const logininfo = db.logininfo;
const faculty=db.faculty;
require("../config/dbclass")();
const axios = require('axios');

module.exports = {

   

    list: async (req, res, next) => {
        try{
            const result = await readData(logininfo, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    create: async (req, res, next) => {
        try{
            const check = await readData(faculty, {"mobile": req.body.mobileno});
            if(check.length>0){
            randotp = getRandomSixDigitNumber()
            //randotp = 123456;
            sendmobileotp(req.body.mobileno, randotp.toString())
            var obj={
                "mobileno": req.body.mobileno,
                "otp":randotp,
                "status":0
            }
            const result = await createData(logininfo, obj);
            res.status(200).send(result)
            }else{
                res.status(200).json({ error: 'Mobile Number Not Found' });
            }
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    validate: async (req, res, next) => {
        try{ 
            const checking = await readData(logininfo, { "mobileno": req.body.mobileno,"otp":req.body.otp,"status":0 });

            
            if(checking.length>0){
               
                await updateData(logininfo, { "_id": checking[0]._id }, {"status":1 });
                const result = await readData(faculty, {"mobile": req.body.mobileno});   
                
                res.status(200).send(result)

            }else{
               res.status(200).json({ error: 'OTP not valid' });
            }
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    currentotps: async (req, res, next) => {
        try{
            const result = await readData(logininfo, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }

    

}

function getRandomSixDigitNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}
const sendmobileotp = async (mobile, randno) => {
    try {
        var finalobj = {
            "data": {
                "mobile": mobile,
                "message": randno
            }
        }
        var respdata = await axios.post('https://apis.aditya.ac.in/kafka/producer/otp', finalobj)
            .then(response => {
                //res.status(200).json(response);
                //console.log(response.data);
                return response.data;
            });
    } catch (err) {
        console.error(err)
        //res.render('error/500')
    }
 }
