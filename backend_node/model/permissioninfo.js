module.exports = mongoose => {
    const permissioninfo = mongoose.model(
      "permissioninfo",
      mongoose.Schema(
        {
          suc : { type: String, require: true },          
          studentinfo: { type: Array, require: true },
          examinfo: { type: Array, require: true },
          permissionreason: { type: String, require: true },
          authorizedby: { type: String, require: true },
          filepath: { type: Array, require: true }
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return permissioninfo;
  };