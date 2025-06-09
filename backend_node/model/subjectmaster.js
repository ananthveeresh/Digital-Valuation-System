module.exports = mongoose => {
    const subjectmaster = mongoose.model(
      "subjectmaster",
      mongoose.Schema(
        {
          SubjectId : { type: Number, require: true },          
          UniversityName: { type: String, require: true },
          SemName: { type: Number, require: true },
          GroupName: { type: String, require: true },
          SubjectName: { type: String, require: true },
          ShortCode: { type: String, require: true }
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return subjectmaster;
  };