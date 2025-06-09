module.exports = mongoose => {
    const faculty = mongoose.model(
      "faculty",
      mongoose.Schema(
        {
          paycode : { type: Number, require: true },          
          facultyName: { type: String, require: true },
          subject: { type: String, require: true },
          branch: { type: String, require: true },
          mobile: { type: String},
          email : { type: String},
          emptype:{ type: String }
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return faculty;
  };