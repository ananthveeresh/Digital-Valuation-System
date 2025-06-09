module.exports = mongoose => {
    const questionmodal = mongoose.model(
      "questionmodel",
      mongoose.Schema(
        {
          modelId : { type: Number, require: true, unique: true },          
          questionSchema: { type: Array, require: true, unique: true },
          questionDescription: { type: Array, require: true },
          modelName: { type: String, require: true },
          totalMarks: { type: Number, require: true },
          createdAt: { type: Date, default: Date.now }
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return questionmodal;
  };