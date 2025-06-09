const { json } = require("body-parser");
const db = require("../model");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'temp/' }); // Temporary folder for uploaded files
const axios = require("axios");

const answerpapers = db.answerpapers;
require("../config/dbclass")();

module.exports = {

    create: async (req, res, next) => {
        try{

            const checkdata = await readData(answerpapers, {
                "branch": req.body.branch,
                "examid": req.body.examid,
                "subject": req.body.subject,
                "papercode": req.body.papercode,
                "suc" : req.body.suc
            });

           //console.log(checkdata.length)
           if(checkdata.length==0){
            const result = await createData(answerpapers, req.body);
            res.status(200).send(result)
           }else{
            var obj={
                "examid": req.body.examid,
                "subject": req.body.subject,
                "papercode": req.body.papercode,
                "filepath": req.body.filepath,
            }
            const result = await updateData(answerpapers, checkdata[0]._id, obj);
            res.status(200).send(result)

           }

    
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(answerpapers, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(answerpapers, { "examid": req.params.examId });



            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateData(answerpapers, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(answerpapers, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    sheetinfo: async (req, res, next) => {
        try{
            const result = await readData(answerpapers, { "examid": req.body.examid,"branch": req.body.campus });


            const uniqueSubject = [];
            const seenNames = new Set();

                for (const item of result) {
                if (!seenNames.has(item.subject)) {
                    uniqueSubject.push(item);
                    seenNames.add(item.subject);
                }
                }
            
           var subjctwiseresult=[];
           var withPaycode=[];
           var withoutPaycode=[]
           var pendingpapers=[]
           var completepapers=[]
           var finalresult=[]
           var obj={};
           for(var i=0;i<uniqueSubject.length;i++){
            
             subjctwiseresult = result.filter(e => e.subject === uniqueSubject[i].subject);
            
            // console.log(subjctwiseresult)
             withPaycode = subjctwiseresult.filter(e=>e.paycode>0);

             pendingpapers = subjctwiseresult.filter(e=>e.paycode>0 && e.marksjson.length==0);
             completepapers = subjctwiseresult.filter(e=>e.paycode>0 && e.marksjson.length>0);
             scrutinyalloted = subjctwiseresult.filter(e=>e.scrutinypaycode>0 && e.scrutverified==0);
             scrutinyvalued = subjctwiseresult.filter(e=>e.scrutinypaycode>0 && e.scrutverified==1);

            
                    obj={
                        "exam":req.params.examid,
                        "subject":uniqueSubject[i].subject,
                        "papercode":subjctwiseresult[0].papercode,
                        "total":subjctwiseresult.length,
                        "available":subjctwiseresult.length-withPaycode.length,
                        "alloted": withPaycode.length,
                        "corrected": completepapers.length,
                        "pending": pendingpapers.length,
                        "scrutinyalloted": scrutinyalloted.length,
                        "scrutinycorrected": scrutinyvalued.length,
                        "scrutinypending": completepapers.length-scrutinyalloted.length,
                    }
                    finalresult.push(obj)
                }

            res.status(200).send(finalresult)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    sheetinfofaculty: async (req, res, next) => {
        try{
           
            const result = await readData(answerpapers, { "examid": req.body.examid ,"branch": req.body.campus });
           // console.log(result)

            const uniqueSubject = [];
            const seenNames = new Set();

                for (const item of result) {
                if (!seenNames.has(item.paycode)) {
                    uniqueSubject.push(item);
                    seenNames.add(item.paycode);
                }
                }
            
           var subjctwiseresult=[];
           var withPaycode=[];
           var withoutPaycode=[]
           var pendingpapers=[]
           var completepapers=[]
           var finalresult=[]
           var obj={};
           for(var i=0;i<uniqueSubject.length;i++){
            
             subjctwiseresult = result.filter(e => e.paycode === uniqueSubject[i].paycode);
            
            // console.log(subjctwiseresult)
             withPaycode = subjctwiseresult.filter(e=>e.paycode>0);

             pendingpapers = subjctwiseresult.filter(e=>e.paycode>0 && e.marksjson.length==0);
             completepapers = subjctwiseresult.filter(e=>e.paycode>0 && e.marksjson.length>0);

            
                    obj={
                        "exam":req.params.examid,
                        "paycode":uniqueSubject[i].paycode,
                        "facultyinfo":subjctwiseresult[0].staffinfo,
                        "subject":subjctwiseresult[0].subject,
                        "papercode":subjctwiseresult[0].papercode,
                        "total":subjctwiseresult.length,
                        "available":subjctwiseresult.length-withPaycode.length,
                        "alloted": withPaycode.length,
                        "corrected": completepapers.length,
                        "pending": pendingpapers.length,
                    }
                    finalresult.push(obj)
                }

            res.status(200).send(finalresult)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    dashboardreport: async (req, res, next) => {
        try{
            //console.log(req.params.examid)
            const result = await answerpapers.aggregate([
                {
                    $facet: {
                        totalRecords: [
                            { $count: "count" }
                        ],
                        alloted: [
                            { $match: { marksjson: { $exists: true, $ne: [] } } },
                            { $count: "count" }
                        ]
                    }
                },
                {
                    $project: {
                        upload: { $arrayElemAt: ["$totalRecords.count", 0] },
                        corrected: { $arrayElemAt: ["$alloted.count", 0] }
                    }
                }
            ]);

                
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    deletesheet: async (req, res, next) => {
        try{
          
            const result = await updateunsetsinglefield(answerpapers, {
                paycode: req.body.paycode,
                papercode: req.body.papercode,
                suc:  req.body.suc,
                subject:  req.body.subject
              },
              {
                $unset: { marksjson: "" }
              });

            

            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    paperallotment: async (req, res, next) => {
        try{

           
            for(var i=0;i<req.body.length;i++){

            const result = await readData(answerpapers, {"examid":req.body[0].exam,"branch":req.body[0].branch,"subject":req.body[0].subject,"paycode": { $exists: false }});

              // console.log(req.body[i].allocated)
                for(var j=0;j<req.body[i].allocated;j++){
                    result[j].paycode=req.body[i].paycode
                    result[j].staffinfo=req.body[i].facultyallocateInfo
                    
                    await updateData(answerpapers, result[j]._id, result[j]);
                 
                }
               
                }   



            res.status(200).send({ "result" :'Alloted' })
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    unallotment: async (req, res, next) => {
        try{

            const result = await updateunsetmanyfield(answerpapers, {
                examid: req.body.examid,
                branch: req.body.branch,
                subject: req.body.subject,
                paycode:  req.body.paycode,
                subjectmarks:  { $exists: false }
              },
              {
                $unset: { paycode: 1 }
              });


            res.status(200).send({ "result" :'Unalloted' })
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    

    staffallotedpaper: async (req, res, next) => {
        try{
            const result = await readData(answerpapers, {"paycode":req.params.paycode});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    savemarks: async (req, res, next) => {
        try{
            var originalmarks = req.body.marksjson;
            var totalMarks=0;
            
            originalmarks.forEach(section => {
                section.subsections.forEach(subsection => {
                    // Sort questions by applied_marks in descending order
                    //subsection.Questions.sort((a, b) => b.applied_marks - a.applied_marks);

                    subsection.Questions.sort((a, b) => {
                        // If both have applied_marks, sort by it in descending order
                        if (a.applied_marks !== undefined && b.applied_marks !== undefined) {
                            return b.applied_marks - a.applied_marks;
                        }
                        // If one has applied_marks and the other doesn't, prioritize the one with applied_marks
                        if (a.applied_marks !== undefined) {
                            return -1;
                        }
                        if (b.applied_marks !== undefined) {
                            return 1;
                        }
                        // If neither has applied_marks, maintain their original order
                        return 0;
                    });

            
                    // Update the top MustAnswerQuestions questions where applied_marks > 0
                    subsection.Questions
                        .filter(question => question.applied_marks > 0)
                        .slice(0, subsection.MustAnswerQuestions)
                        .forEach(question => {
                            question.score_status = true;
                            totalMarks += question.applied_marks; // Add to totalMarks
                        });
            
                    // Ensure remaining questions do not have the score_status field
                    subsection.Questions.forEach(question => {
                        if (question.score_status === undefined) {
                            delete question.score_status;
                        }
                    });
                });
            });
            
            
           // console.log(originalmarks);
           // res.status(200).send(originalmarks)
            
                   
            const result = await updatesinglefield(answerpapers, {
                "examid": req.body.examid,
                "paycode": req.body.paycode,
                "papercode": req.body.papercode,
                "suc": req.body.suc
            }, { "marksjson": req.body.marksjson ,"subjectmarks":totalMarks});

            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    paperinfo: async (req, res, next) => {
       
        try{ 
            const result = await readData(answerpapers, { _id: ObjectId(req.params.pid) });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    paperallotedinfo: async (req, res, next) => {
       
        try{ 
            const result = await readData(answerpapers, {"examid":req.body.examId,"branch":req.body.branch, "papercode":req.body.paperCode});
             
            const uniquePaycode = [];
            const seenNames = new Set();

                for (const item of result) {
                if (!seenNames.has(item.paycode)) {
                    if(item.paycode!=undefined){
                    uniquePaycode.push(item.paycode);
                    seenNames.add(item.paycode);
                    }
                }
                }
            
              
           var paycodewiseresult=[];
           var finalresult=[]
           var obj={};
           for(var i=0;i<uniquePaycode.length;i++){
            paycodewiseresult = result.filter(e => e.paycode === uniquePaycode[i]);
            pendingpapers = result.filter(e => e.paycode === uniquePaycode[i] && e.subjectmarks===undefined);
            valuedpapers = result.filter(e => e.paycode === uniquePaycode[i] && e.subjectmarks>=0);

            var facultypath = paycodewiseresult[0].paycode + "@" + req.body.examId;
            var base64Facultypath = Buffer.from(facultypath).toString('base64');
            
            
                    obj={
                        "paycode":paycodewiseresult[0].paycode,
                        "staffinfo":paycodewiseresult[0].staffinfo[0].facultyName,
                        "alloted":paycodewiseresult.length,
                        "pending":pendingpapers.length,
                        "valued":valuedpapers.length,
                        "path":base64Facultypath
                    }
                    finalresult.push(obj)
                }

            res.status(200).send(finalresult)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    ,

    saveanswerpdf: [upload.single('pdfFile'), async (req, res, next) => { 
        try {
            // Extracting campus, examid, papercode, and subjectname from the request body
            const { campus, examid, papercode, subjectname,suc } = req.body;
    
            // Define the folder structure: 'annotated_pdfs/<campus>/<examid>'
            const campusFolder = campus; // Use the campus from the request
            const examFolder = examid;   // Use the examid from the request
            const subjectFolder = subjectname+'-'+papercode;
    
            // Define the directory path where the PDF will be saved
            const uploadDir = path.join(path.dirname(__dirname), 'annotated_pdfs', campusFolder, examFolder, subjectFolder);
    
            // Check if the directory exists, and if not, create it
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true, mode: 0o777 });
                console.log(`Created directory: ${uploadDir}`); // Log the creation of the folder
            }
    
            // Define the file path (e.g., 1.pdf) inside the newly created folder for the examid
            const destinationPath = path.join(uploadDir, suc+'.pdf');
    
            // Check if a file has been uploaded (via multer)
            if (!req.file) {
                return res.status(400).send('PDF file is required.');
            }
    
            // Move the uploaded file from the temp directory to the desired folder
            const tempPath = req.file.path; // Temp file path from multer
    
            // Move the file to the destination
            fs.rename(tempPath, destinationPath, (err) => {
                if (err) {
                    console.error('Failed to move the file:', err);
                    return res.status(500).send(`Failed to move the file: ${err.message}`);
                }
    
                // Successfully saved the PDF file
                res.send(`File successfully uploaded as 1.pdf in ${campusFolder}/${examFolder}/`);
            });
    
        } catch (err) {
            // Handle errors and return the error message
            res.status(500).json({ error: err.message });
        }
    }],
    savepdf: async (req, res, next) => {
       
        try {

           const uploadDir = path.join('/app/annotated_pdfs/',req.params.campus,req.params.exam,req.params.subject+"-"+req.params.papercode);

            // // Create the directory if it doesn't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true, mode: 0o777 });
            }
    
            const destinationPath = path.join(uploadDir, req.params.suc+'.pdf');
    
            // Check if we received data in the request
            const pdfData = req.body;
    
            if (!pdfData || pdfData.length === 0) {
                return res.status(400).send('Failed to get PDF data.');
            }
    
            // Ensure the data is a Buffer (raw binary data)
            const pdfBuffer = Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);
    
            // Write the PDF data to a file
            fs.writeFile(destinationPath, pdfBuffer, (err) => {
                if (err) {
                    console.error('Failed to write file:', err);
                    return res.status(500).send('Failed to write file.');
                }
    
                // File successfully written
                res.send(`File successfully written: ${uploadDir} bytes`);
            });
    
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ error: err.message });
        }
    },
    facultystudentmarks: async (req, res, next) => {
       
        try{ 
           // console.log({ "examid": req.body.examid, "papercode": req.body.papercode ,"suc": req.body.suc })
            const result = await readData(answerpapers, { "examid": req.body.examid, "papercode": req.body.papercode ,"suc": req.body.suc });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    studentresult: async (req, res, next) => {
        try{
            const result = await readData(answerpapers, {"examid":req.body.examid,"branch":req.body.campus,"papercode":req.body.papercode, "marksjson": { $exists: true }});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    subjectmarks: async (req, res, next) => {
        try{
            const result = await readData(answerpapers, {"examid":req.body.examid,"branch":req.body.campus,"papercode":req.body.papercode,"subject":req.body.subject, "subjectmarks": { $exists: true }});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    updatestudentinfo: async (req, res, next) => {
        try {
            const result = await answerpapers.distinct("suc", { "examid": req.params.examid});

   
            for (const sucValue of result) {
                try {

                  //  const response = await axios.get(`http://10.70.9.204:3006/api/student/getstudentboardid/${sucValue}`);
                  const response = await axios.get(`http://10.70.9.204:3006/api/student/getstudentboardid/${sucValue}`);


                    if (response.status === 200 && response.data.length > 0) {
                        const stddata = response.data[0];
                        
                        console.log( { "examid": req.params.examid , "suc": sucValue }, // Match the document
                            { $set: { "studentinfo": stddata } })
    
                        await answerpapers.updateMany(
                            { "examid": req.params.examid , "suc": sucValue }, // Match the document
                            { $set: { "studentinfo": stddata } }
                        );

                    }
                } catch (error) {
                    console.error(`Failed for suc=${sucValue}:`, error.message);
                    continue; // Continue the loop even if an error occurs
                }
            }
    
            res.send("Updated all the data");
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    sectionreport: async (req, res, next) => {
        try{ 
            const result = await readData(answerpapers, {
                "studentinfo.sec_id": req.body.section_id,
                "examid": req.body.exam_id
              });

             
              const uniqueStudents = Array.from(new Map(result.map(item => [item.suc, item])).values());

              const uniqueSubjects = Array.from(new Map(result.map(item => [item.subject, item])).values());

            
              var  studentobj={};var studentfinalarray=[];


              for(var i=0;i<uniqueStudents.length;i++){

                var studentprofilearray = result.filter(e => e.suc === uniqueStudents[i].suc)
               
                var studentmarksdata=[];var markobj={};var marksarray=[];
                for(var j=0;j<uniqueSubjects.length;j++){


                    studentmarksdata = studentprofilearray.filter(e => e.subject === uniqueSubjects[j].subject);

                    //console.log(studentmarksdata)

                    if(studentmarksdata.length>0){
                        stdsubmarks = studentmarksdata[0].subjectmarks
                    }else{
                        stdsubmarks = 0
                    }
                    markobj={
                        "subject" : uniqueSubjects[j].subject,
                        "marks" : stdsubmarks
                    }
                   // console.log(markobj)
                    marksarray.push(markobj);

                }
                 studentobj={
                    "std_id":uniqueStudents[i].std_id,
                    "suc":uniqueStudents[i].suc,
                    "studentName":uniqueStudents[i].studentinfo[0].student_name,
                    "branch" : uniqueStudents[i].studentinfo[0].campus_name,
                    "course" : uniqueStudents[i].studentinfo[0].course_name,
                    "section" : uniqueStudents[i].studentinfo[0].section_name,
                    "roll_no" : uniqueStudents[i].studentinfo[0].roll_no,
                    "marksobj":marksarray
                }
                studentfinalarray.push(studentobj);

              }

             // console.log(studentfinalarray)

            res.status(200).send(studentfinalarray)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    getexamsubjectsuclist: async (req, res, next) => {
        try{ 
            const result = await readData(answerpapers, { branch: req.body.branch, examid: req.body.examid, subject: req.body.subject },{ _id: 0, suc: 1 });

            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    scrutinyallotment: async (req, res, next) => {
        try{

           
            for(var i=0;i<req.body.length;i++){

            const result = await readData(answerpapers, {"examid":req.body[0].exam,"branch":req.body[0].branch,"subject":req.body[0].subject,"scrutinyinfo": { $exists: false }});

                for(var j=0;j<req.body[i].allocated;j++){
                    result[j].scrutverified=0
                    result[j].verificationerror=0
                    result[j].scrutinypaycode=req.body[i].paycode
                    result[j].scrutinyinfo=req.body[i].scrutinyinfo
                    
                    await updateData(answerpapers, result[j]._id, result[j]);
                 
                }
               
                }   


            res.status(200).send({ "result" :'Alloted' })
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    scrutinyallotmentinfo: async (req, res, next) => {
       
        try{ 
            const result = await readData(answerpapers, {"examid":req.body.examId,"branch":req.body.branch, "papercode":req.body.paperCode});
             
            const uniquePaycode = [];
            const seenNames = new Set();

                for (const item of result) {
                if (!seenNames.has(item.scrutinypaycode)) {
                    if(item.scrutinypaycode!=undefined){
                    uniquePaycode.push(item.scrutinypaycode);
                    seenNames.add(item.scrutinypaycode);
                    }
                }
                }
           
           var paycodewiseresult=[];
           var finalresult=[]
           var obj={};
           for(var i=0;i<uniquePaycode.length;i++){
            paycodewiseresult = result.filter(e => e.scrutinypaycode === uniquePaycode[i]);
            pendingpapers = result.filter(e => e.scrutinypaycode === uniquePaycode[i] && e.scrutverified===0);
            valuedpapers = result.filter(e => e.scrutinypaycode === uniquePaycode[i] && e.scrutverified==1);
        
                    obj={
                        "paycode":paycodewiseresult[0].scrutinypaycode,
                        "staffinfo":paycodewiseresult[0].scrutinyinfo[0].facultyName,
                        "alloted":paycodewiseresult.length,
                        "pending":pendingpapers.length,
                        "valued":valuedpapers.length
                    }
                    finalresult.push(obj)
                }

            res.status(200).send(finalresult)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    scrutinyunallotment: async (req, res, next) => {
        try{

            const result = await updateunsetmanyfield(answerpapers, {
                examid: req.body.examid,
                branch: req.body.branch,
                subject: req.body.subject,
                scrutinypaycode:  req.body.scrutinypaycode,
                scrutverified:  0
              },
              {
                $unset: { scrutinypaycode: 1 }
              });


            res.status(200).send({ "result" :'Unalloted' })
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    

    scrutinyallotedpaper: async (req, res, next) => {
        try{
            const result = await readData(answerpapers, {"scrutinypaycode":req.params.paycode});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    

    scrutinyupdate: async (req, res, next) => {
        try{
            const result = await updateData(answerpapers,{ _id: req.body.paperid }, 
                { $set: { 
                    scrutverified : req.body.scrutverified,
                    scrutinizedat : new Date(), 
                } });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },
    

    scrutinyerrorupdate: async (req, res, next) => {
        try{
            const result = await updateData(answerpapers,{ _id: req.body.paperid }, 
                { $set: { 
                    scrutverified : req.body.scrutverified,
                    verificationerror : req.body.verificationerror,
                    verificationremarks : req.body.verificationremarks,
                    scrutinizedat : new Date(), 
                } });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    employeesummary: async (req, res, next) => {
        try {
            const result = await answerpapers.aggregate([
                {
                    $facet: {
                        completed_pending: [
                            { $match: { "paycode": parseInt(parseInt(req.params.paycode)) } },
                            { 
                                $group: {
                                    _id: null,
                                    completed: { 
                                        $sum: { 
                                            $cond: { 
                                                if: { $gt: [{ $size: { $ifNull: ["$marksjson", []] } }, 0] }, 
                                                then: 1, 
                                                else: 0 
                                            } 
                                        } 
                                    },
                                    pending: { 
                                        $sum: { 
                                            $cond: { 
                                                if: { $eq: [{ $size: { $ifNull: ["$marksjson", []] } }, 0] }, 
                                                then: 1, 
                                                else: 0 
                                            } 
                                        } 
                                    }
                                }
                            }
                        ],
                        scrutiny_completed: [
                            { $match: { "scrutinypaycode": parseInt(req.params.paycode), "scrutverified": 1 } },
                            { $group: { _id: null, scrutinycompleted: { $sum: 1 } } }
                        ],
                        scrutiny_pending: [
                            { $match: { "scrutinypaycode": parseInt(req.params.paycode), "scrutverified": 0 } },
                            { $group: { _id: null, scrutinypending: { $sum: 1 } } }
                        ],
                        scrutiny_error: [
                            { $match: { "scrutinypaycode": parseInt(req.params.paycode), "scrutinyerror": 1, "scrutverified": 0 } },
                            { $group: { _id: null, scrutinyerror: { $sum: 1 } } }
                        ]
                    }
                }
            ]);
        
        
            res.status(200).send({
                valuationcompleted: result[0].completed_pending.length ? result[0].completed_pending[0].completed : 0,
                valuationpending: result[0].completed_pending.length ? result[0].completed_pending[0].pending : 0,
                scrutinycompleted: result[0].scrutiny_completed.length ? result[0].scrutiny_completed[0].scrutinycompleted : 0,
                scrutinypending: result[0].scrutiny_pending.length ? result[0].scrutiny_pending[0].scrutinypending : 0,
                scrutinyerror: result[0].scrutiny_error.length ? result[0].scrutiny_error[0].scrutinyerror : 0
            });
        
        } catch (err) {
            console.error("Aggregation Error:", err);
            res.status(500).json({ error: err.message });
        }
        
    },
    

    studentexamresult: async (req, res, next) => {
        try{
            const result = await readData(answerpapers, {"examid":req.params.exam,"suc":req.params.suc});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
   
    

}


function sortByAppliedMarks(arr) {
    return arr.sort((a, b) => (b.applied_marks || 0) - (a.applied_marks || 0));
  }
function sortByQNumber(arr) {
    return arr.sort((a, b) => (a.QNo || 0) - (b.QNo || 0));
  }
  
