module.exports = app => {
  const trans = require("../controllers/translation.controller.js");
  const authMiddleware = require('../middlewares/auth.middleware.js');

  var router = require("express").Router();

  // Create a new translation for a User
  router.post("/:userId/translations", authMiddleware, trans.saveTranslation);

  // Get translations for a User
  router.get("/:userId/translations", authMiddleware, trans.getTranslations);

  // Delete a translation of a User
  router.delete("/:userId/translations/:translationId", authMiddleware, trans.deleteTranslation);

  app.use("/api/users", router);
};
