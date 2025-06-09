const { json } = require("body-parser");
const db = require("../model");
const questionmodel = db.questionmodel;
const autoIncrement = db.autoIncrement;
require("../config/dbclass")();

module.exports = {

    create: async (req, res, next) => {
        try{
            
             req.body.modelId = (await getAutoId(autoIncrement, 'ModelId')).seq;
            const result = await createData(questionmodel, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(questionmodel, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(questionmodel, { "modelId": req.params.modelid });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateData(questionmodel, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(questionmodel, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    

}
