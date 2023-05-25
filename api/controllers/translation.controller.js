const mongoose = require('mongoose');
const User = require('../models/user.model')(mongoose);

const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

exports.saveTranslation = async (req, res) => {
  try {
    const { userId, sourceText, translatedText } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date();
    const lastTranslationDate = user.lastTranslationDate ? new Date(user.lastTranslationDate) : null;
    if (!lastTranslationDate || !isSameDay(today, lastTranslationDate)) {
      user.translationCount = 5;
    }

    if (user.translationCount > 0) {
      user.translations.push({ sourceText, translatedText });
      user.translationCount -= 1;
      user.lastTranslationDate = new Date();

      const updatedUser = await user.save();
      res.status(200).json(updatedUser.translations);
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
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.translations);
  } catch (error) {
    console.error('Error retrieving translations', error);
    res.status(500).json({ message: 'Error retrieving translations', error: error.message });
  }
};

exports.deleteTranslation = async (req, res) => {
  const userId = req.params.userId;
  const translationId = req.params.translationId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const translationIndex = user.translations.findIndex(translation => translation._id.toString() === translationId);
    if (translationIndex === -1) {
      return res.status(404).json({ message: `Translation with id=${translationId} not found` });
    }

    user.translations.splice(translationIndex, 1);
    const updatedUser = await user.save();

    res.status(200).json({ message: "Translation was deleted successfully!", translations: updatedUser.translations });
  } catch (err) {
    console.error('Error deleting translation', err);
    res.status(500).json({ message: "Could not delete Translation with id=" + translationId, error: err.message });
  }
};