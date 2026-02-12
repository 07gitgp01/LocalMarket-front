# LocalMarket - Plateforme E-commerce Burkinabé 🇧🇫

LocalMarket est une application web moderne permettant de connecter les producteurs locaux du Burkina Faso avec les consommateurs, offrant une expérience d'achat fluide, locale et authentique.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v18 ou v20 recommandés)
- NPM

### Installation
```bash
git clone <repository-url>
cd local-market
npm install
```

### Lancer en Développement
Cette commande lance à la fois l'application Angular (Port 4200) et le Mock Server (Port 3000).
```bash
npm run dev
```
Ouvrez votre navigateur sur `http://localhost:4200`.

## 🛠 Commandes Disponibles

- `npm start:app` : Lance uniquement le frontend.
- `npm start:api` : Lance uniquement le backend simulé (Mock Server).
- `npm run build:prod` : Compile l'application pour la production.
- `npm test` : Lance les tests unitaires.
- `npm run docker:build` : Construit l'image Docker.

## 📦 Architecture

- **Frontend** : Angular 18/19+ (Standalone Components), Tailwind CSS, Angular Material.
- **State Management** : Services RxJS (Signal-ready).
- **Backend Mock** : JSON Server + JSON Server Auth.
- **PWA** : Support hors-ligne et installation mobile activé.

## 🚢 Déploiement

### Docker
```bash
docker-compose up --build -d
```
L'application sera accessible sur `http://localhost`.

### Vercel / Netlify
Le projet est configuré pour être déployé facilement.
Pour Vercel, utilisez le fichier `vercel.json` inclus.

## 👥 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | admin@localmarket.bf | admin123 |
| **Vendeur** | vendeur@localmarket.bf | vendeur123 |
| **Client** | client@localmarket.bf | client123 |

---
Développé avec ❤️ pour le Burkina Faso.
