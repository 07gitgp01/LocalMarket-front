# LocalMarket - Configuration JSON Server & Données Mock - TERMINÉ ✅

## 📋 Résumé du PROMPT 2

Configuration complète de JSON Server avec des données réalistes pour le Burkina Faso.

## ✅ Données Créées

### 1. **Users (10 entrées)** 
- 1 Administrateur
- 4 Vendeurs  
- 5 Clients
- Données réalistes avec noms burkinabé (Ouédraogo, Compaoré, Sawadogo, Kaboré, etc.)
- Adresses dans différentes villes

### 2. **Regions (10 entrées)**
Toutes les 13 régions du Burkina Faso :
- Centre (Ouagadougou)
- Hauts-Bassins (Bobo-Dioulasso)
- Centre-Ouest (Koudougou)
- Nord (Ouahigouya)
- Est (Fada N'Gourma)
- Sud-Ouest (Gaoua)
- Cascades (Banfora)
- Sahel (Dori)
- Plateau-Central (Ziniaré)
- Centre-Nord (Kaya)

Avec population, superficie et provinces pour chaque région.

### 3. **Categories (10 entrées)**
1. Céréales & Graines (Mil, sorgho, maïs)
2. Fruits & Légumes
3. Artisanat
4. Textile & Faso Dan Fani
5. Karité & Produits Cosmétiques  
6. Épices & Condiments (Soumbala)
7. Volaille & Œufs (Poulets bicyclette)
8. Miel & Produits de la Ruche
9. Boissons Traditionnelles (Dolo, bissap, zom-ko)
10. Tubercules & Racines

### 4. **Vendors (10 entrées)**
Vendeurs variés :
- Coopérative Wend Panga (Céréales)
- Artisanat de Bobo
- Karité d'Or
- Faso Dan Fani Traditionnel
- Fruits du Sahel
- Miel du Burkina
- Épices du Faso
- Volaille Bio Faso
- Boissons Délices du Sahel
- Ignames de l'Ouest

Chaque vendeur inclut :
- Informations complètes (logo, banner, description)
- Localisation GPS
- Heures d'ouverture
- Contact (téléphone, email, WhatsApp)
- Note et nombre d'avis
- Statut vérifié

### 5. **Products (10 entrées initiales)**
Produits variés représentant le Burkina Faso :
1. Mil Local
2. Sorgho Rouge
3. Maïs Blanc
4. Mangues Amélie
5.  Tomates Fraîches
6. Masque Bobo (artisanat)
7. Panier Tressé
8. Tissu Faso Dan Fani Premium
9. Beurre de Karité Bio 500g
10. Savon au Karité

Chaque produit avec :
- Images, prix, stock
- Notes et avis
- Tags et attributs
- Informations vendeur

### 6. **Orders (2 entrées)**
Commandes de démonstration :
- ORD-BF-2024-001 (livrée)
- ORD-BF-2024-002 (en cours)

Avec :
- Détails des articles
- Adresse de livraison
- Méthode de paiement (Orange Money, Wave)
- Statuts

### 7. **Cart (2 entrées)**
Paniers actifs pour utilisateurs

### 8. **Reviews (4 entrées)**
Avis clients vérifiés sur différents produits

## 🔧 Fichiers Créés

### `mock-server/db.json`
Base de données JSON complète générée automatiquement

### `mock-server/server.js`
Serveur JSON Server personnalisé avec :
- **Authentication JWT** (json-server-auth)
- **Routes personnalisées** :
  - `/api/health` - Vérification serveur
  - `/api/products/search` - Recherche produits avec filtres
  - `/api/stats` - Statistiques dashboard
- **Delay de 1000ms** pour simuler réseau réel
- **Watch mode** pour recharger automatiquement

### `mock-server/generate-db.js`
Script Node.js pour générer/régénérer la base de données

## 📦 Scripts NPM

```json
{
  "start:api": "node mock-server/server.js",
  "start:dev": "concurrently \"npm run start\" \"npm run start:api\""
}
```

## 🚀 Utilisation

### Démarrer JSON Server seul
```bash
npm run start:api
```

Le serveur démarre sur `http://localhost:3000`

### Démarrer App + API simultanément
```bash
npm run start:dev
```

- App Angular : `http://localhost:4200`
- API Mock : `http://localhost:3000`

### Régénérer la base de données
```bash
cd mock-server
node generate-db.js
```

## 🔐 Authentification

Le serveur utilise `json-server-auth` pour l'authentification :

### Endpoints disponibles
- `POST /api/register` - Inscription
- `POST /api/login` - Connexion

### Exemple de login
```bash
POST http://localhost:3000/api/login
Content-Type: application/json

{
  "email": "admin@localmarket.bf",
  "password": "admin123"
}
```

Réponse :
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@localmarket.bf",
    "firstName": "Amidou",
    ...
  }
}
```

## 📊 Statistiques

```
✅ Fichier db.json généré avec succès!
📊 Statistiques:
  - Utilisateurs: 10
  - Régions: 10
  - Catégories: 10
  - Vendeurs: 10
  - Produits: 10
  - Commandes: 2
  - Panier: 2
  - Avis: 4
```

## 🔗 Relations entre Tables

- **Users ↔ Vendors** : `user.vendorId → vendor.id`
- **Vendors ↔ Regions** : `vendor.regionId → region.id`
- **Products ↔ Vendors** : `product.vendorId → vendor.id`
- **Products ↔ Categories** : `product.category → category.name`
- **Orders ↔ Users** : `order.userId → user.id`
- **Orders ↔ Products** : `order.items.productId → product.id`
- **Cart ↔ Users** : `cart.userId → user.id`
- **Cart ↔ Products** : `cart.productId → product.id`
- **Reviews ↔ Products** : `review.productId → product.id`
- **Reviews ↔ Users** : `review.userId → user.id`

## 🎯 Routes API Personnalisées

### Recherche de produits
```
GET /api/products/search?q=mil&category=Céréales&minPrice=400&maxPrice=600&featured=true
```

### Statistiques Dashboard
```
GET /api/stats
```

Retourne :
```json
{
  "totalProducts": 10,
  "totalOrders": 2,
  "totalVendors": 10,
  "totalUsers": 10,
  "totalRevenue": 37500,
  "pendingOrders": 1,
  "deliveredOrders": 1
}
```

## 🌍 Spécificités Burkina Faso

### Produits Locaux
- Mil, sorgho, maïs (céréales de base)
- Beurre de karité
- Faso Dan Fani (tissu traditionnel)
- Soumbala (condiment)
- Dolo (bière de mil)
- Poulets bicyclette
- Artisanat bobo

### Villes  
-  Ouagadougou (capitale)
- Bobo-Dioulasso (2e ville)
- Koudougou
- Ouahigouya
- Banfora
- Kaya
- Dori

### Moyens de Paiement
- Orange Money
- Wave (Moov Money)
- Cash on Delivery

## ⏭️ Prochaines Étapes

Le **PROMPT 2 est TERMINÉ** ✅

Vous pouvez maintenant :
1. Tester l'API avec Postman ou curl
2. Développer les services Angular pour consommer l'API
3. Passer au **PROMPT 3** (probablement services & HTTP)

---

✨ **Configuration JSON Server terminée avec succès !**
