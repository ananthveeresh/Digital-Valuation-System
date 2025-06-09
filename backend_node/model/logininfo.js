module.exports = mongoose => {
    const logininfo = mongoose.model(
      "logininfo",
      mongoose.Schema(
        {        
          mobileno: { type: String },
          otp: { type: Number },
          status: { type: Number },
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return logininfo;
  };