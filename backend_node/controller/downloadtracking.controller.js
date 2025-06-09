const { json } = require("body-parser");
const db = require("../model");
const downloadtracking = db.downloadtracking;
require("../config/dbclass")();

module.exports = {

    create: async (req, res, next) => {
        try{
            
            const result = await createData(downloadtracking, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(downloadtracking, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(downloadtracking, { "subjectId": req.params.subjectId });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbygroup: async (req, res, next) => {
        try{ 
            const result = await readData(downloadtracking, { "GroupName": req.body.groupId,"SemName" : req.body.semId});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateData(downloadtracking, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(downloadtracking, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    

}
