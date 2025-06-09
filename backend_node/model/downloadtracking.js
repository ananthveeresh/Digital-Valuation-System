module.exports = mongoose => {
    const downloadtracking = mongoose.model(
      "downloadtracking",
      mongoose.Schema(
        {
          role : { type: String, require: true },          
          userinfo: { type: Array, require: true },
          examinfo: { type: Array, require: true },
          suc: { type: String, require: true },
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return downloadtracking;
  };