const { User } = require("../models");
const jwt = require("jsonwebtoken");

// Authenticate a User
exports.authentificate = (req, res) => {
  // Validate request
  if (!req.body.pseudo || !req.body.mot_de_passe) {
    res.status(400).send({ message: "Content can not be empty! auth" });
    return;
  }

  // Check user credentials
  User.findOne({ pseudo: req.body.pseudo })
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "User not found!" });
        return;
      }

      // Compare the password (you can use bcrypt if the password is hashed)
      if (user.mot_de_passe === req.body.mot_de_passe) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: 86400, // expires in 24 hours
        });

        res.status(200).send({
          message: "Successful login!",
          userId: user._id, // Ajoutez cette ligne pour inclure l'userId dans la réponse
          token: token, // Renvoyez le token avec la réponse
        });
      } else {
        res.status(401).send({ message: "Invalid credentials!" });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    });
};
