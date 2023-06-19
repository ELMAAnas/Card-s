module.exports = (mongoose) => {
  const modelName = 'User';

  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }

  const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    pseudo: { type: String, required: true, unique: true },
    date_naissance: { type: Date, required: true },
    mot_de_passe: { type: String, required: true },
    translations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Translation' }],
  });

  return mongoose.model(modelName, userSchema);
};
