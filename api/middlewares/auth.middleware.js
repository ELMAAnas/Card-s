const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Token mal formé" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.userData = decoded;
    console.log(decoded);
    console.log('req.userData:', req.userData);
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du token JWT:', error);
    return res.status(401).json({ message: 'Authentification échouée' });
  }
};
