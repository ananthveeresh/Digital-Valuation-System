const { json } = require("body-parser");
const db = require("../model");
const faculty = db.faculty;
const axios = require("axios")

require("../config/dbclass")();

module.exports = {

    insertfaculty: async (req, res, next) => {
        try{

            await axios.get('http://10.60.1.9:3006/api/faculty/getcampusfaculty/'+req.params.campus)            
            .then(async response => {
                
                var obj={}
                for(var i=0;i<response.data.length;i++){
                   
                     obj={
                        "paycode" : response.data[i].paycode,
                        "subject" : response.data[i].subject_name
                    }

                     await axios.get('http://10.30.1.21:4602/api/employeemaster/basicinfo/'+response.data[i].paycode)            
                    .then(response2 => {
                         
                        obj.facultyName = response2.data[0].empName;
                        obj.branch = response2.data[0].campusName;
                        obj.mobile = response2.data[0].mobileNo;
                        obj.email = response2.data[0].email;
                        

                        createData(faculty, obj);

                        
                    }) 
                    
                }
                
            })

            res.status(200).send('success')
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    create: async (req, res, next) => {
        try{
            const result = await createData(faculty, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(faculty, { "branch": req.body.campus });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    campuslist: async (req, res, next) => {
        try{
            const result = await readData(faculty, { "branch": req.body.campus, "emptype": req.body.emptype});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },


    facultylist: async (req, res, next) => {
        try{
            const result = await readgropuData(faculty, { "branch": req.body.campus });
            res.status(200).send(result)
            
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(faculty, { "subjectId": req.params.subjectId });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(faculty, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }

}
