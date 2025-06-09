const { json } = require("body-parser");
const db = require("../model");
const subjectmaster = db.subjectmaster;
const autoIncrement = db.autoIncrement;
require("../config/dbclass")();

module.exports = {

    create: async (req, res, next) => {
        try{
            
             req.body.SubjectId = (await getAutoId(autoIncrement, 'SubjectId')).seq;
            const result = await createData(subjectmaster, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(subjectmaster, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(subjectmaster, { "subjectId": req.params.subjectId });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbygroup: async (req, res, next) => {
        try{ 
            const result = await readData(subjectmaster, { "GroupName": req.body.groupId,"SemName" : req.body.semId});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateData(subjectmaster, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(subjectmaster, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    

}
