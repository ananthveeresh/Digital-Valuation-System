const { json } = require("body-parser");
const db = require("../model");
const exammaster = db.exammaster;
const autoIncrement = db.autoIncrement;
const axios = require('axios');
require("../config/dbclass")();
const analysisapi = "http://10.60.1.9:3006/api";
//const analysisapi = "http://10.70.3.135:3006/api";

module.exports = {

    create: async (req, res, next) => {
        try{
            const result = await createData(exammaster, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(exammaster, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    campussubjects: async (req, res, next) => {
        try{
            const result = await readData(exammaster, { "campus": req.params.campus });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(exammaster, { "examId": req.params.examId });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateData(exammaster, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(exammaster, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbypapercode: async (req, res, next) => {
        try{ 

            if(req.body.examid==26388){
            var result = await aggregateData(exammaster, [
                {
                    $addFields: {
                        normalizedCampus: { $replaceAll: { input: "$campus", find: " ", replacement: "" } }
                    }
                },
                {
                    $match: {
                        examId : req.body.examid,
                        papercode: req.body.papercode,
                        normalizedCampus: req.body.campus
                    }
                },
                {
                    $project: { normalizedCampus: 0 } // Exclude the temporary field from the result
                }
            ]);
        }else{
            var result = await aggregateData(exammaster, [
                {
                    $addFields: {
                        normalizedCampus: { $replaceAll: { input: "$campus", find: " ", replacement: "" } }
                    }
                },
                {
                    $match: {
                        examId : req.body.examid,
                        subjectcode: req.body.papercode,
                        normalizedCampus: req.body.campus
                    }
                },
                {
                    $project: { normalizedCampus: 0 } // Exclude the temporary field from the result
                }
            ]);

        }
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getsubpapercode: async (req, res, next) => {
        try { 


            if(req.body.examid==26388){
            var result = await aggregateData(exammaster, [
                {
                    $addFields: {
                        normalizedCampus: { $replaceAll: { input: "$campus", find: " ", replacement: "" } }
                    }
                },
                {
                    $match: {
                        examId : req.body.examid,
                        papercode: req.body.papercode,
                        normalizedCampus: req.body.campus // Fix here
                    }
                },
                {
                    $project: { normalizedCampus: 0 } // Exclude the temporary field from the result
                }
            ]);
        }else{
            var result = await aggregateData(exammaster, [
                {
                    $addFields: {
                        normalizedCampus: { $replaceAll: { input: "$campus", find: " ", replacement: "" } }
                    }
                },
                {
                    $match: {
                        examId : req.body.examid,
                        subjectcode: req.body.papercode,
                        normalizedCampus: req.body.campus // Fix here
                    }
                },
                {
                    $project: { normalizedCampus: 0 } // Exclude the temporary field from the result
                }
            ]);

        }
    
            res.status(200).send(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    ,

    examslist: async (req, res, next) => {
        try{
            const result = await readData(exammaster, req.body);
            

            const uniqueData = [];
            const seenNames = new Set();

                for (const item of result) {
                if (!seenNames.has(item.examId)) {
                    uniqueData.push(item);
                    seenNames.add(item.examId);
                }
                }

               // console.log(uniqueData);


            res.status(200).send(uniqueData)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    subjectfaculty: async (req, res, next) => {
        try{

            if(req.body.examid=="26388"){
                var result = await readData(exammaster, {"examId":parseInt(req.body.examid),"campus":req.body.campus,"papercode":req.body.papercode});
            }else{
                var result = await readData(exammaster, {"examId":parseInt(req.body.examid),"campus":req.body.campus,"subjectcode":req.body.papercode});
            }

         

            var obj={
                "papercode":result[0].papercode,
                "subjectcode":result[0].subjectcode,
                "subjectname":req.body.subjectname,
                "staffinfo": result[0].staffdetails
            }
            res.status(200).send(obj)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    analysissection: async (req, res, next) => {
        try{
           // console.log(analysisapi+'/master/section?year='+req.params.year+'&campus='+req.params.campus)
            const response = await axios.get(analysisapi+'/master/section?year='+req.params.year+'&campus='+req.params.campus);
            res.status(200).send(response.data)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    ,

    getsectionwisestudentslist: async (req, res, next) => {
        try{
           var obj={
            "year":req.body.year,
            "section":req.body.section
           }
            const response = await axios.post(analysisapi+'/student/getsectionwisestudentslist',obj);
            res.status(200).send(response.data)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    getcoursewisestudentslist: async (req, res, next) => {
        try{
           var obj={
            "year_id":req.body.year_id,
            "campus_id":req.body.campus_id,
            "course_id":req.body.course_id
           }
            const response = await axios.post(analysisapi+'/student/getcoursewisestudentslist',obj);
            res.status(200).send(response.data)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    digitexamsubjects: async (req, res, next) => {
        try{
           var obj={
            "exam_id":req.body.exam_id,
           }
            const response = await axios.post(analysisapi+'/exams/digitexamsubjects',obj);
            res.status(200).send(response.data)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    facultyupdate: async (req, res, next) => {
        try{

            const result = await updatesinglefield(exammaster, {"examId":req.body.examid,"campus":req.body.campus,"papercode":req.body.papercode,"subjectName":req.body.subjectname} , {"staffdetails": req.body.staffdetails});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    studentgetboardid: async (req, res, next) => {
        try{
            const response = await axios.get(analysisapi+'/student/getboardid/'+req.params.suc);
            res.status(200).send(response.data)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    ,

    examsschoolhallticket: async (req, res, next) => {
        try{
            const response = await axios.post(analysisapi+'/exams/schoolhallticket',req.body);
            res.status(200).send(response.data)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    

}
