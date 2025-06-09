module.exports = mongoose => {
    const project = mongoose.model(
      "adminusers",
      mongoose.Schema(
        {        
          UserId: { type: Number, require: true, unique: true },
          FullName: { type: String, require: true },
          UserName: { type: String, require: true },
          Password: { type: String, require: true },
          UserLevel: { type: String, require: true },
          UserCampus: { type: Array, require: true },
          createdAt: { type: Date, default: Date.now }
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return project;
  };