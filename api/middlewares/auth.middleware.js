const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log('Token:', token); // Ajouter cette ligne pour afficher le token
    const decoded = jwt.verify(token, secret);
    console.log('Decoded:', decoded); // Ajouter cette ligne pour afficher les informations décodées
    req.userData = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error); // Ajouter cette ligne pour afficher l'erreur
    return res.status(401).json({ message: 'Authentification échouée' });
  }
};
