# AuthAppBackend

## 📋 Description
AuthAppBackend est une API RESTful développée avec Node.js et Express qui gère l'authentification complète des utilisateurs. Ce système backend offre des fonctionnalités robustes d'enregistrement, de connexion, de vérification d'email, de réinitialisation de mot de passe, et plus encore.

## 🚀 Fonctionnalités

- **Authentification complète**
  - Inscription des utilisateurs
  - Connexion sécurisée
  - Déconnexion
  - Vérification de l'authentification
  
- **Sécurité**
  - Hachage des mots de passe avec bcryptjs
  - Authentification par JWT (JSON Web Tokens)
  - Cookies HTTP sécurisés

- **Vérification d'email**
  - Génération et envoi de codes OTP
  - Emails de vérification personnalisés
  - Expiration des codes après 24 heures

- **Réinitialisation de mot de passe**
  - Système complet de récupération de compte
  - Envoi de codes OTP temporaires (valides 15 minutes)
  - Emails de réinitialisation stylisés

- **Emails transactionnels**
  - Templates HTML responsifs
  - Emails de bienvenue
  - Notifications de sécurité

## 🛠️ Technologies

- **Node.js & Express** - Framework backend
- **MongoDB & Mongoose** - Base de données et ODM
- **JWT** - Gestion des sessions et tokens
- **bcryptjs** - Hachage sécurisé des mots de passe
- **Nodemailer** - Service d'envoi d'emails
- **dotenv** - Gestion des variables d'environnement
- **cookie-parser** - Manipulation des cookies
- **cors** - Gestion des requêtes cross-origin

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/waelby99/AuthNode.git
cd authappbackend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier le fichier .env avec vos propres valeurs

# Lancer le serveur de développement
npm run dev

# OU lancer en production
npm start
```

## 🔧 Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Serveur
PORT=5000
NODE_ENV=development # ou "production"

# Base de données
MONGODB_URI=mongodb://localhost:27017/authapp

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise

# Email
SENDER=votre_email@exemple.com
EMAIL_PASSWORD=votre_mot_de_passe_email
EMAIL_HOST=smtp.exemple.com
EMAIL_PORT=587
```

## 🔐 Routes API

### Authentification

- **POST /api/auth/register** - Inscription d'un nouvel utilisateur
  ```json
  {
    "name": "Prénom",
    "lname": "Nom",
    "email": "utilisateur@exemple.com",
    "password": "motdepasse123"
  }
  ```

- **POST /api/auth/login** - Connexion
  ```json
  {
    "email": "utilisateur@exemple.com",
    "password": "motdepasse123"
  }
  ```

- **POST /api/auth/logout** - Déconnexion

- **GET /api/auth/isauth** - Vérification d'authentification (protégée)

### Vérification d'email

- **POST /api/auth/sendverifycode** - Envoyer un code de vérification (protégée)

- **POST /api/auth/verify** - Vérifier l'email avec le code OTP (protégée)
  ```json
  {
    "otp": "123456"
  }
  ```

### Réinitialisation de mot de passe

- **POST /api/auth/sendreset** - Envoyer un code de réinitialisation
  ```json
  {
    "email": "utilisateur@exemple.com"
  }
  ```

- **POST /api/auth/resetpwd** - Réinitialiser le mot de passe
  ```json
  {
    "email": "utilisateur@exemple.com",
    "otp": "123456",
    "newPassword": "nouveau_mot_de_passe"
  }
  ```

### Utilisateur

- **GET /api/user/data** - Récupérer les données de l'utilisateur (protégée)

## 📝 Middlewares

- **userAuth** - Vérifie l'authentification via JWT dans les cookies

## 📋 Structure du projet

```
authappbackend/
├── config/
│   ├── mongodb.js
│   └── nodemailer.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   └── userAuth.js
├── models/
│   └── user.model.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## 📄 Licence

ISC

## 👨‍💻 Auteur

[Wael Ben Youssef]

---

⭐ Si vous trouvez ce projet utile, n'hésitez pas à lui attribuer une étoile sur GitHub ! ⭐
