const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require("morgan");
const verifyToken = require("./middlewares/auth.middleware.js");

// Ajout de la configuration dotenv
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.get('/', (req, res) => {
  res.json({message: 'hello api'});
});

// Inclure le middleware d'authentification dans les routes que vous souhaitez protéger
require('./routes/users.routes')(app, verifyToken);
// Ajout de la route des traductions
require('./routes/translations.routes')(app, verifyToken);

const port = process.env.PORT || 4400;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
}).on('error', err => console.log(err));

const connectionString = process.env.MONGODB_URI;

// Configuration de Mongoose et connexion à MongoDB
const mongoose = require('mongoose');
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connexion à MongoDB réussie');
})
.catch(err => {
  console.error('Erreur de connexion à MongoDB:', err);
});

