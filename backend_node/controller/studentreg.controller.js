const { json } = require("body-parser");
const db = require("../model");
const studentreg = db.studentreg;
const axios = require('axios');
require("../config/dbclass")();
const analysisapi = "http://10.60.1.9:3006/api";

module.exports = {

    create: async (req, res, next) => {
        try{
            const result = await createData(studentreg, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(studentreg, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(studentreg, { "suc": req.params.examId });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateByFilter(studentreg, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(studentreg, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    updatePaymentInfo: async (req, res, next) => {
        try {
            const { suc, payment } = req.body; // Assuming `id` is the record identifier and `payment` is the new object to be added.
            
            const result = await studentreg.findOneAndUpdate(
                { suc }, // Filter by the `suc` field
                { $push: { paymentinfo: payment } }, // Push `payment` into `paymentinfo` array
                { new: true } // Return the updated document
            );
    
            if (!result) {
                return res.status(404).json({ message: "Record not found" });
            }
    
            res.status(200).json({ message: "Payment info updated successfully", data: 'Success' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    ,

    secondsempaid: async (req, res, next) => {
        try{
            const result = await readData(studentreg, {"paymentinfo.fee_id":108});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }

}
