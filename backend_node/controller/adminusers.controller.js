const { json } = require("body-parser");
const db = require("../model");
const adminusers = db.adminusers;
const autoIncrement = db.autoIncrement;
require("../config/dbclass")();

module.exports = {

    create: async (req, res, next) => {
        try{
            
             req.body.UserId = (await getAutoId(autoIncrement, 'UserId')).seq;
            //  console.log(req.body)
            const result = await createData(adminusers, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(adminusers, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(adminusers, { "UserId": req.params.userid });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateData(adminusers, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(adminusers, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    checkuser: async (req, res, next) => {
        try{
            const result = await readData(adminusers, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }

    

}
