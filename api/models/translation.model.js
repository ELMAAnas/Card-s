module.exports = (mongoose) => {
  const modelName = 'Translation';

  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }

  const translationSchema = new mongoose.Schema({
    sourceText: String,
    translatedText: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });

  return mongoose.model(modelName, translationSchema);
};
