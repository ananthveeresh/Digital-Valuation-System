const { json } = require("body-parser");
const db = require("../model");
const permissioninfo = db.permissioninfo;
require("../config/dbclass")();

module.exports = {

    create: async (req, res, next) => {
        try{
            
            const result = await createData(permissioninfo, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(permissioninfo, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    studentdata: async (req, res, next) => {
        try{
            const result = await readData(permissioninfo, {"suc":req.body.suc,"examinfo.examId":parseInt(req.body.examId)});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(permissioninfo, { "subjectId": req.params.subjectId });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbygroup: async (req, res, next) => {
        try{ 
            const result = await readData(permissioninfo, { "GroupName": req.body.groupId,"SemName" : req.body.semId});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateData(permissioninfo, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(permissioninfo, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    

}
