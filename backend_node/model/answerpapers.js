module.exports = mongoose => {
    const answerpapers = mongoose.model(
      "answerpapers",
      mongoose.Schema(
        {
          examid : { type: String, require: true },          
          branch: { type: String, require: true},
          subject: { type: String, require: true},
          papercode : { type: String, require: true},
          suc : { type: String},
          filepath : { type: String },
          paycode : { type: Number},
          staffinfo: { type:Array},
          alloteddate: { type:Date},
          marksjson: { type:Array },
          subjectmarks:{ type:Number},
          studentinfo:{  type:Array},
          scrutinypaycode:{ type:Number},
          scrutinyinfo:{ type:Array},
          scrutverified:{ type:Number},
          verificationerror: { type: Number},
          verificationremarks: { type: String},
          scrutinizedat: { type: Date }
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return answerpapers;
  };