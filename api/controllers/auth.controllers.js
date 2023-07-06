const bcrypt = require('bcrypt');
const { User } = require("../models");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  console.log("hachage démarré")
  // Hash password
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(req.body.mot_de_passe, saltRounds);

    // Create a new user
    const user = new User({
      pseudo: req.body.pseudo,
      mot_de_passe: hashedPassword,
      nom: req.body.nom,
      prenom: req.body.prenom,
      date_naissance: req.body.date_naissance,
      // Include other fields as necessary
    });

    // Save user in the database
    const data = await user.save();

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }
};


exports.authentificate = (req, res) => {
  // Check user credentials
  User.findOne({ pseudo: req.body.pseudo })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found!" });
      }

      // Compare the password with bcrypt
      bcrypt.compare(req.body.mot_de_passe, user.mot_de_passe, function(err, result) {
        if (result) {
          // The passwords match
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 86400, // expires in 24 hours
          });

          const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d', // expires in 7 days
          });

          res.status(200).send({
            message: "Successful login!",
            userId: user._id,
            token: token,
            refreshToken: refreshToken,
          });
        } else {
          // The passwords do not match
          return res.status(401).send({ message: "Invalid credentials!" });
        }
      });
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    });
};


exports.refreshToken = (req, res) => {
  const refreshToken = req.body.token;
  
  if (refreshToken == null) return res.sendStatus(401);
  
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 86400, // expires in 24 hours
    });
    
    res.json({ accessToken: accessToken });
  })
}


