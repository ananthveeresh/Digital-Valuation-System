const { json } = require("body-parser");
const db = require("../model");
const campusmaster = db.campusmaster;
require("../config/dbclass")();

module.exports = {

    create: async (req, res, next) => {
        try{
            const result = await createData(campusmaster, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(campusmaster, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(campusmaster, { "subjectId": req.params.subjectId });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbygroup: async (req, res, next) => {
        try{ 
            const result = await readData(campusmaster, { "GroupName": req.body.groupId,"SemName" : req.body.semId});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateData(campusmaster, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(campusmaster, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    

}
