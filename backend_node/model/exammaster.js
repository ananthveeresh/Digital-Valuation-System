module.exports = mongoose => {
    const exammaster = mongoose.model(
      "exammaster",
      mongoose.Schema(
        {
          examId : { type: Number, require: true },          
          examName: { type: String, require: true },
          examDate: { type: String, require: true },
          campus: { type: String, require: true},
          semister: { type: String, require: true},
          subjectId : { type: String},
          subjectName: { type: String},
          subjectcode: { type: String},
          papercode : { type: String},
          staffdetails : { type: Array},
          papertype : { type: Number}
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return exammaster;
  };