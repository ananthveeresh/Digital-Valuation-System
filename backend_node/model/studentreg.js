module.exports = mongoose => {
    const studentreg = mongoose.model(
      "studentregistration",
      mongoose.Schema(
        {
          course : { type: Object, require: true },          
          language: { type: String, require: true },
          board_id : { type:String},
          suc: { type: String, require: true , unique:true },
          studentinfo: { type: Array, require: true },
          studentname: { type: String, require: true},
          dob: { type: String, require: true},
          gender : { type: String, require: true},
          religion: { type: String, require: true},
          reservation  : { type: String, require: true},
          physicallychallenged : { type: String, require: true},
          studentemail : { type: String, require: true},
          studentmobilenumber  : { type: String, require: true },          
          studentwhatsappnumber : { type: String, require: true },
          studentaddress: { type: String, require: true },
          studentaadhaarnumber : { type: String, require: true},
          mole1: { type: String, require: true},
          mole2 : { type: String, require: true},
          fathername: { type: String, require: true},
          fathermobilenumber  : { type: String},
          fatheremail : { type: String, require: true},
          mothername : { type: String, require: true},
          mothermobilenumber  : { type: String, require: true },          
          motheremail : { type: String, require: true },
          sscboard: { type: String, require: true },
          sschallticketnumber  : { type: String, require: true},
          sscgpa : { type: String, require: true},
          sscyearofpass : { type: String, require: true},
          interboard: { type: String, require: true},
          interhallticketnumber   : { type: String, require: true},
          interpercentage : { type: String, require: true},
          interyearofpass : { type: String, require: true},
          certificates : { type: Array},
          paymentinfo : { type: Array}
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return studentreg;
  };