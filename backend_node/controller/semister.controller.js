const { json } = require("body-parser");
const db = require("../model");
const semister = db.semister;
const axios = require('axios');
require("../config/dbclass")();
const analysisapi = "http://10.60.1.9:3006/api";

module.exports = {

    create: async (req, res, next) => {
        try{
            const result = await createData(semister, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(semister, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(semister, { "examId": req.params.examId });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateData(semister, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(semister, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    campusexam: async (req, res, next) => {
        try{
            const result = await readData(semister, {"campus":req.params.campus});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    

}
