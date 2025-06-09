module.exports = mongoose => {
    const campusmaster = mongoose.model(
      "campusmaster",
      mongoose.Schema(
        {
          campus_id : { type: Number, require: true },          
          campus_name: { type: String, require: true },
          campus_city : { type: String, require: true },
          campus_address: { type: String, require: true},
          campus_shortcode: { type: String, require: true},
          campusorder : { type: String},
          inst_id: { type: Number},
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return campusmaster;
  };