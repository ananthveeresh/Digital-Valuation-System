const { json } = require("body-parser");

require("../config/dbclass")();

const fs = require('fs');
const path = require('path');

module.exports = {


    fileinfo: async (req, res, next) => {
            var campus = req.body.campus;
            var sem = req.body.sem;
            var course = req.body.course;
            var subject = req.body.subject;

            const dirPath = path.join(__dirname, '../../ftpserver/' + campus + '/' + sem + '/' + course + '/' + subject + '/');

            function getPdfFiles(dir, fileList = []) {
            const files = fs.readdirSync(dir);

            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                getPdfFiles(filePath, fileList);
                } else if (path.extname(filePath) === '.pdf') {
                fileList.push(path.basename(file, '.pdf'));
                }
            });

            return fileList;
            }

            try {
            const pdfFiles = getPdfFiles(dirPath);
            const pdfCount = pdfFiles.length;
            res.json({ pdfFiles, pdfCount });
            } catch (error) {
            console.error('Error reading directory:', error);
            res.status(500).send('Error reading directory');
            }
    }

    

}
