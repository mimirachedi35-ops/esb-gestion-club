# E.S.Bougara — Gestion du Club

Application web pour gérer les judokas, l'assurance, les cotisations, les présences
et les statistiques du club.

Ce guide vous explique comment mettre l'application en ligne **gratuitement**, sans
dépendre de Claude, avec :
- **MongoDB Atlas** → la base de données qui garde vos informations en sécurité, pour toujours.
- **GitHub** → l'endroit où le code du site est stocké.
- **Render** → le service qui fait tourner le site 24h/24 avec une adresse internet (URL).

---

## Étape 1 — Créer la base de données (MongoDB Atlas)

1. Allez sur https://www.mongodb.com/cloud/atlas/register et créez un compte gratuit.
2. Créez un nouveau projet, puis un cluster gratuit (choisissez l'option **M0 / Free**).
3. Dans **Database Access**, créez un utilisateur avec un nom d'utilisateur et un mot de passe (notez-les).
4. Dans **Network Access**, ajoutez l'adresse `0.0.0.0/0` (autoriser toutes les connexions) pour que Render puisse s'y connecter.
5. Cliquez sur **Connect** → **Drivers**, copiez l'URL qui ressemble à :
   ```
   mongodb+srv://VOTRE_UTILISATEUR:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/esbougara?retryWrites=true&w=majority
   ```
   Remplacez `VOTRE_UTILISATEUR` et `VOTRE_MOT_DE_PASSE` par ceux créés à l'étape 3.
   Gardez cette adresse — c'est votre `MONGODB_URI`.

## Étape 2 — Mettre le code sur GitHub

1. Créez un compte sur https://github.com si vous n'en avez pas.
2. Créez un nouveau dépôt (repository), par exemple nommé `esb-gestion-club`.
3. Sur votre ordinateur, dans le dossier de ce projet, exécutez :
   ```
   git init
   git add .
   git commit -m "Première version de l'application E.S.Bougara"
   git branch -M main
   git remote add origin https://github.com/VOTRE_NOM/esb-gestion-club.git
   git push -u origin main
   ```
   (Ou utilisez le bouton "Upload files" sur le site de GitHub si vous préférez ne pas
   utiliser de ligne de commande.)

## Étape 3 — Déployer sur Render

1. Allez sur https://render.com et créez un compte (vous pouvez vous connecter avec GitHub).
2. Cliquez sur **New +** → **Web Service**.
3. Connectez votre dépôt GitHub `esb-gestion-club`.
4. Configurez :
   - **Name** : `esb-gestion-club` (ou ce que vous voulez)
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : Free
5. Dans **Environment Variables**, ajoutez :
   - `MONGODB_URI` = l'adresse copiée à l'étape 1
6. Cliquez sur **Create Web Service**. Render va installer et démarrer le site (2 à 5 minutes).
7. Une fois terminé, vous obtenez une adresse du type :
   ```
   https://esb-gestion-club.onrender.com
   ```
   C'est l'adresse de votre application, accessible depuis n'importe quel téléphone ou ordinateur.

> **Remarque (plan gratuit Render)** : sur le plan gratuit, le site "s'endort" après
> 15 minutes sans visite, puis met 30-60 secondes à se réveiller à la prochaine visite.
> Vos données ne sont jamais perdues (elles sont dans MongoDB, pas sur Render).
> Si vous voulez que le site soit toujours instantané, un plan payant Render (~7$/mois)
> supprime ce délai.

---

## Étape 4 — Installer l'application sur votre téléphone et votre ordinateur

Une fois le site en ligne à son adresse Render :

**Sur téléphone (Android / Chrome) :**
1. Ouvrez le lien du site dans Chrome.
2. Appuyez sur les 3 points en haut à droite → **"Ajouter à l'écran d'accueil"** (ou "Installer l'application").
3. L'icône du club apparaît sur votre écran d'accueil comme une vraie application.

**Sur téléphone (iPhone / Safari) :**
1. Ouvrez le lien dans Safari.
2. Appuyez sur le bouton **Partager** → **"Sur l'écran d'accueil"**.

**Sur ordinateur (Chrome / Edge) :**
1. Ouvrez le lien du site.
2. Cliquez sur l'icône d'installation dans la barre d'adresse (petit écran avec une flèche),
   ou menu ⋮ → **"Installer E.S.Bougara"**.
3. L'application s'ouvre alors dans sa propre fenêtre, avec son icône, comme un logiciel normal.

---

## Codes d'accès

- **Entraîneurs** : `esb2026`
- **Administrateur (accès complet)** : `omar1208`

## Support

Toutes les données (judokas, cotisations, présences, archives de saisons) sont
stockées dans MongoDB Atlas et restent disponibles tant que le compte MongoDB
existe (gratuit, sans limite de durée sur le plan M0).
