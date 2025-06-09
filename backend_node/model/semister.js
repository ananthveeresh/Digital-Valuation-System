module.exports = mongoose => {
    const semister = mongoose.model(
      "semister",
      mongoose.Schema(
        {
          examId : { type: Number, require: true },          
          examName: { type: String, require: true },
          examDate: { type: String, require: true },
          campus: { type: Array, require: true},
          semister: { type: String, require: true},
          fromDate : { type: Date},
          endDate: { type: Date},
          hallticketissue : { type: Number},
          hallticketstart : { type: Date},
          hallticketend : { type: Date}
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return semister;
  };