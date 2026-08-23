// Serveur de l'application E.S.Bougara
// Sert le site (dossier public/) et fournit une API pour lire/écrire les données du club
// dans une vraie base de données (MongoDB Atlas), afin que les informations restent
// enregistrées durablement, même après fermeture du navigateur ou redémarrage du serveur.

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERREUR : la variable d\'environnement MONGODB_URI est manquante.');
  console.error('Ajoutez-la dans les "Environment Variables" de votre service Render.');
}

mongoose.connect(MONGODB_URI, {})
  .then(() => console.log('Connecté à MongoDB avec succès.'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err.message));

// Un seul document est utilisé pour stocker toutes les données du club
// (judokas, séances, archives, réglages) sous forme d'un objet JSON unique.
const ClubDataSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'club-data' },
  value: { type: Object, default: {} },
  updatedAt: { type: Date, default: Date.now }
});
const ClubData = mongoose.model('ClubData', ClubDataSchema);

app.use(express.json({ limit: '15mb' })); // 15mb pour autoriser les photos des judokas
app.use(express.static(path.join(__dirname, 'public')));

// Récupérer les données du club
app.get('/api/data', async (req, res) => {
  try {
    const doc = await ClubData.findOne({ key: 'club-data' });
    res.json(doc ? doc.value : null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur de lecture des données.' });
  }
});

// Enregistrer les données du club (remplace l'ensemble du document)
app.post('/api/data', async (req, res) => {
  try {
    await ClubData.findOneAndUpdate(
      { key: 'club-data' },
      { value: req.body, updatedAt: new Date() },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur d\'enregistrement des données.' });
  }
});

app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => {
  console.log(`Serveur E.S.Bougara démarré sur le port ${PORT}`);
});
