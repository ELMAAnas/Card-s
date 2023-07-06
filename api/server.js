const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const https = require('https');
const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');

// Middleware d'authentification
const verifyToken = require("./middlewares/auth.middleware.js");

// Importation des routes
const userRoutes = require('./routes/users.routes');
const translationsRoutes = require('./routes/translations.routes');

// Ajout de la configuration dotenv
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("combined"));

app.get('/', (req, res) => {
  res.json({message: 'hello api'});
});

// Configuration de Mongoose et connexion à MongoDB
const connectionString = 'mongodb://127.0.0.1:27017/cards_db';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connexion à MongoDB réussie');
  
  // Inclure le middleware d'authentification dans les routes que vous souhaitez protéger
  userRoutes(app, verifyToken);
  // Ajout de la route des traductions
  translationsRoutes(app, verifyToken);

  const port = process.env.PORT || 4400;
  const httpsPort = process.env.HTTPS_PORT || 4443; // Choisir un autre port pour HTTPS

  // Lire les fichiers de certificat
  let privateKey, certificate;
  try {
    privateKey = fs.readFileSync('./key.pem', 'utf8');
    certificate = fs.readFileSync('./cert.pem', 'utf8');
  } catch (err) {
    console.error("Error reading certificate files:", err);
    process.exit(1);
  }

  const credentials = {key: privateKey, cert: certificate};

  // Créer le serveur HTTPS
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(httpsPort, () => {
    console.log(`Serveur HTTPS démarré sur le port ${httpsPort}`);
  });

  // Rediriger toutes les requêtes HTTP vers HTTPS
  const httpApp = express();

  httpApp.use((req, res, next) => {
      if(!req.secure) {
          const secureUrl = "https://" + req.headers.host + req.url; 
          res.writeHead(301, { "Location":  secureUrl });
          res.end();
      }
  });

  httpApp.listen(port, () => {
      console.log(`Serveur HTTP démarré sur le port ${port}`);
  });

})
.catch(err => {
  console.error('Erreur de connexion à MongoDB:', err);
  process.exit(1); // Arrêter le processus si la connexion échoue
});
