module.exports = (mongoose) => {
    const modelName = 'Translation';
  
    if (mongoose.models[modelName]) {
      return mongoose.models[modelName];
    }
  
    const translationSchema = new mongoose.Schema({
      translations: [
        {
          sourceText: String,
          translatedText: String,
        },
      ],
      translationCount: { type: Number, default: 5 },
      lastTranslationDate: { type: Date, default: null },
    });
  
    return mongoose.model(modelName, translationSchema);
};