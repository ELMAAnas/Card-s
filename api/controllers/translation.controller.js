const mongoose = require('mongoose');
const User = require('../models/user.model')(mongoose);
const Translation = require('../models/translation.model')(mongoose);

const isSameDay = (date1, date2) => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  return d1.getTime() === d2.getTime();
};

exports.saveTranslation = async (req, res) => {
  try {
    const { sourceText, translatedText } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date();
    const lastTranslationDate = user.lastTranslationDate ? new Date(user.lastTranslationDate) : null;

    if (!lastTranslationDate || !isSameDay(today, lastTranslationDate)) {
      console.log('Resetting translation count');
      user.translationCount = 5;
    }

    if (user.translationCount > 0) {
      const translation = new Translation({ sourceText, translatedText, user: user._id });
      await translation.save();
    
      user.translations.push(translation);
      user.translationCount -= 1;
      user.lastTranslationDate = new Date();

      console.log('Saving new translation, updating last translation date to', user.lastTranslationDate);
    
      await user.save();
    
      res.status(200).json(translation);
    } else {
      res.status(403).json({ message: 'Daily translation limit reached' });
    }
    
  } catch (error) {
    console.error('Error saving translation', error);
    res.status(500).json({ message: 'Error saving translation', error: error.message });
  }
};

exports.getTranslations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const translations = await Translation.find({user: userId});
    
    if (!translations) {
      return res.status(404).json({ message: 'Translations not found' });
    }

    res.status(200).json(translations);
  } catch (error) {
    console.error('Error retrieving translations', error);
    res.status(500).json({ message: 'Error retrieving translations', error: error.message });
  }
};

exports.deleteTranslation = async (req, res) => {
  const userId = req.params.userId;
  const translationId = req.params.translationId;

  try {
    const translation = await Translation.findOne({ _id: translationId, user: userId });

    if (!translation) {
      return res.status(404).json({ message: `Translation with id=${translationId} not found` });
    }

    await Translation.findByIdAndRemove(translationId);

    res.status(200).json({ message: "Translation was deleted successfully!" });
  } catch (err) {
    console.error('Error deleting translation', err);
    res.status(500).json({ message: "Could not delete Translation with id=" + translationId, error: err.message });
  }
};
