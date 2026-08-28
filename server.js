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

// Fiche publique d'un judoka (accessible sans connexion, via le QR code de sa carte).
// Ne renvoie QUE des informations non sensibles : nom, prénom, photo, sexe, catégorie.
// Ne renvoie JAMAIS : téléphone du tuteur, copies de documents, groupe sanguin, statut assurance...
app.get('/api/wrestler/:id', async (req, res) => {
  try {
    const doc = await ClubData.findOne({ key: 'club-data' });
    const wrestlers = (doc && doc.value && doc.value.wrestlers) || [];
    const w = wrestlers.find(x => x.id === req.params.id);
    if (!w) return res.status(404).json({ error: 'Introuvable' });
    const refYear = (doc.value.settings && doc.value.settings.refYear) || new Date().getFullYear();
    res.json({
      nom: w.nom,
      prenom: w.prenom,
      sexe: w.sexe,
      photo: w.photo || null,
      categorie: categorizeLabel(w.dateNaissance, refYear)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur de lecture.' });
  }
});

// Reproduit exactement la logique de catégorisation par âge utilisée côté client (voir categorize() dans index.html).
function categorizeLabel(dateNaissanceISO, refYear) {
  if (!dateNaissanceISO) return 'Baby Judo (Éveil)';
  const y = parseInt(dateNaissanceISO.slice(0, 4), 10);
  const diff = refYear - y;
  if (diff >= 20) return 'Seniors';
  if (diff >= 17) return 'Juniors';
  if (diff >= 14) return 'Cadets';
  if (diff >= 12) return 'Minimes';
  if (diff >= 10) return 'Benjamins';
  if (diff >= 8) return 'Poussins';
  return 'Baby Judo (Éveil)';
}

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
