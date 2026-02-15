# Base de Données Mock Server - LocalMarket

## 📊 Vue d'Ensemble

Le fichier `db.json` contient une base de données **complète et cohérente** pour alimenter toute l'application LocalMarket.

### Statistiques Globales

- **Utilisateurs**: 30 (1 admin, 10 vendeurs, 19 clients)
- **Vendeurs**: 10 boutiques vérifiées
- **Produits**: 120 produits actifs
- **Commandes**: 60 commandes avec historique complet
- **Avis**: 150 reviews clients
- **Wishlists**: 40 produits favoris
- **Panier**: 15 items actifs
- **Notifications**: 30 notifications
- **Revenu total**: 4,201,150 FCFA
- **Panier moyen**: 82,187 FCFA

---

## 👥 Utilisateurs (users)

### Comptes de Test

#### Admin
- **Email**: `admin@localmarket.bf`
- **Password**: `password123`
- **Rôle**: Admin
- **Accès**: Dashboard admin complet

#### Vendeurs (10)
- **Email**: `user{id}@localmarket.bf` (où role = "vendor")
- **Password**: `password123`
- **Rôle**: Vendor
- **Accès**: Dashboard vendeur, gestion produits/commandes

#### Clients (19)
- **Email**: `user{id}@localmarket.bf` (où role = "customer")
- **Password**: `password123`
- **Rôle**: Customer
- **Accès**: Catalogue, panier, commandes, profil

### Structure User
```json
{
  "id": 1,
  "email": "admin@localmarket.bf",
  "password": "$2a$10$...",
  "firstName": "Amidou",
  "lastName": "Ouedraogo",
  "role": "admin|vendor|customer",
  "phone": "+226 70 12 34 56",
  "address": {
    "street": "Avenue Kwame Nkrumah",
    "city": "Ouagadougou",
    "region": "Centre",
    "postalCode": "01 BP 1234"
  },
  "avatar": "https://i.pravatar.cc/150?img=1",
  "status": "active",
  "vendorId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 🏪 Vendeurs (vendors)

### Boutiques Disponibles

1. **Cooperative Wend Panga** - Céréales & Graines
2. **Artisanat de Bobo** - Artisanat
3. **Karité d'Or** - Produits cosmétiques
4. **Faso Dan Fani Traditionnel** - Textile
5. **Fruits du Sahel** - Fruits & Légumes
6. **Bio Burkina** - Produits bio
7. **Terroir du Faso** - Artisanat
8. **Saveurs Locales** - Volaille & Œufs
9. **Marché Vert** - Fruits & Légumes
10. **Épicerie du Village** - Épices & Condiments

### Structure Vendor
```json
{
  "id": 1,
  "userId": 2,
  "shopName": "Cooperative Wend Panga",
  "description": "Specialiste des produits locaux...",
  "logo": "https://i.pravatar.cc/200?img=30",
  "banner": "https://images.unsplash.com/...",
  "category": "Cereales & Graines",
  "rating": 4.8,
  "reviewCount": 156,
  "productCount": 28,
  "verified": true,
  "regionId": 1,
  "location": {
    "street": "Marché Rood Woko",
    "city": "Ouagadougou",
    "region": "Centre",
    "coordinates": { "lat": 12.3714, "lng": -1.5197 }
  },
  "contact": {
    "phone": "+226 71 23 45 67",
    "email": "contact@wendpanga.bf",
    "whatsapp": "+226 71 23 45 67"
  },
  "businessHours": {
    "monday": "08:00-18:00",
    "tuesday": "08:00-18:00",
    "wednesday": "08:00-18:00",
    "thursday": "08:00-18:00",
    "friday": "08:00-18:00",
    "saturday": "08:00-14:00",
    "sunday": "Fermé"
  }
}
```

---

## 🛍️ Produits (products)

### Catégories (10)

1. **Céréales & Graines** (18 produits)
   - Mil, Sorgho, Maïs, Riz, Fonio, Haricot, Arachide, Sésame

2. **Fruits & Légumes** (23 produits)
   - Mangues, Tomates, Oignons, Piments, Aubergines, Gombos, Carottes, Choux, Pastèques, Bananes

3. **Artisanat** (19 produits)
   - Masques, Statuettes, Colliers, Bracelets, Djembé, Calebasses, Sacs, Paniers, Sculptures

4. **Textile & Faso Dan Fani** (14 produits)
   - Tissus, Boubous, Robes, Écharpes, Nappes, Pagnes

5. **Karité & Produits Cosmétiques** (12 produits)
   - Beurre de karité (250g, 500g, 1kg), Huile, Crèmes, Baumes, Savons, Shampoings

6. **Épices & Condiments** (12 produits)
   - Soumbala, Piment, Gingembre, Ail, Poivre, Curcuma, Curry

7. **Volaille & Œufs** (7 produits)
   - Poulets, Pintades, Canards, Œufs

8. **Miel & Produits de la Ruche** (7 produits)
   - Miel (250ml, 500ml, 1L), Propolis, Cire, Pollen, Gelée royale

9. **Boissons Traditionnelles** (8 produits)
   - Bissap, Gingembre, Tamarin, Baobab, Dolo, Zoom-Koom

10. **Tubercules & Racines** (6 produits)
    - Ignames, Patates douces, Manioc, Taro, Pommes de terre

### Structure Product
```json
{
  "id": 1,
  "vendorId": 1,
  "name": "Mil Local Rouge",
  "slug": "mil-local-rouge",
  "description": "Mil Local Rouge de qualite superieure...",
  "category": "Cereales & Graines",
  "subCategory": "Cereales",
  "price": 800,
  "compareAtPrice": 960,
  "unit": "kg",
  "images": [
    "https://images.unsplash.com/photo-1658026174774?w=800",
    "https://images.unsplash.com/photo-1540493990137?w=800"
  ],
  "stock": 250,
  "minOrder": 1,
  "maxOrder": 50,
  "rating": 4.7,
  "reviewCount": 87,
  "featured": true,
  "tags": ["bio", "local", "frais"],
  "attributes": {
    "origin": "Ouagadougou",
    "certification": "Bio"
  },
  "isActive": true,
  "createdAt": "2025-07-11T13:53:41.853996"
}
```

---

## 📦 Commandes (orders)

### Statuts des Commandes

- **Pending**: 7 commandes (en attente de paiement)
- **Processing**: 13 commandes (en préparation)
- **Shipped**: 7 commandes (expédiées)
- **Delivered**: 28 commandes (livrées)
- **Cancelled**: 5 commandes (annulées)

### Méthodes de Paiement

- **Orange Money**: Mobile money
- **Wave**: Mobile money
- **Cash on Delivery**: Paiement à la livraison

### Structure Order
```json
{
  "id": 1,
  "userId": 12,
  "orderNumber": "ORD-BF-2024-0001",
  "status": "delivered",
  "items": [
    {
      "productId": 45,
      "name": "Collier Perles",
      "quantity": 2,
      "price": 8000,
      "total": 16000,
      "vendorId": 2
    }
  ],
  "subtotal": 16000,
  "shippingCost": 1500,
  "tax": 0,
  "discount": 0,
  "total": 17500,
  "paymentMethod": "orange_money",
  "paymentStatus": "paid",
  "shippingAddress": {
    "firstName": "Aminata",
    "lastName": "Kabore",
    "phone": "+226 73 45 67 89",
    "street": "Secteur 15",
    "city": "Ouagadougou",
    "region": "Centre",
    "postalCode": "01 BP 4567"
  },
  "createdAt": "2025-11-15T13:53:41.868988",
  "updatedAt": "2025-11-17T08:53:41.868988",
  "deliveryDate": "2025-11-21T13:53:41.868988"
}
```

---

## ⭐ Avis (reviews)

### Statistiques

- **Total**: 150 avis
- **Notes**: Principalement 4-5 étoiles
- **Vérifiés**: ~70% des avis sont vérifiés (achat confirmé)

### Structure Review
```json
{
  "id": 1,
  "productId": 45,
  "userId": 12,
  "rating": 5,
  "title": "Excellent produit!",
  "comment": "Tres bon produit, je suis satisfait de la qualite. Je recommande!",
  "helpful": 34,
  "verified": true,
  "createdAt": "2025-12-15T13:53:41.873988"
}
```

---

## ❤️ Wishlist

- **Total**: 40 produits en favoris
- Associés à différents utilisateurs clients
- Permet de suivre les produits préférés

### Structure Wishlist
```json
{
  "id": 1,
  "userId": 12,
  "productId": 45,
  "addedAt": "2026-01-20T13:53:41.876989"
}
```

---

## 🛒 Panier (cart)

- **Total**: 15 items actifs
- Items temporaires avant commande
- Quantités variables

### Structure Cart
```json
{
  "id": 1,
  "userId": 12,
  "productId": 45,
  "quantity": 2,
  "addedAt": "2026-02-11T11:53:41.877989"
}
```

---

## 🔔 Notifications

### Types de Notifications

- **order_confirmed**: Commande confirmée
- **order_shipped**: Commande expédiée
- **order_delivered**: Commande livrée
- **product_back_in_stock**: Produit de nouveau disponible
- **promotion**: Promotion spéciale
- **new_review**: Nouvel avis client

### Structure Notification
```json
{
  "id": 1,
  "userId": 12,
  "type": "order_confirmed",
  "title": "Commande confirmee",
  "message": "Votre commande #ORD-BF-2024-0045 a ete confirmee",
  "read": false,
  "createdAt": "2026-02-11T09:53:41.879989"
}
```

---

## 🌍 Régions (regions)

10 régions du Burkina Faso avec données démographiques:

1. **Centre** - Ouagadougou (2,415,266 habitants)
2. **Hauts-Bassins** - Bobo-Dioulasso (1,703,668 habitants)
3. **Centre-Ouest** - Koudougou (1,522,910 habitants)
4. **Nord** - Ouahigouya (1,385,107 habitants)
5. **Est** - Fada N'Gourma (1,572,206 habitants)
6. **Sud-Ouest** - Gaoua (741,197 habitants)
7. **Cascades** - Banfora (716,561 habitants)
8. **Sahel** - Dori (1,446,570 habitants)
9. **Plateau-Central** - Ziniaré (771,606 habitants)
10. **Centre-Nord** - Kaya (1,599,354 habitants)

---

## 📈 Statistiques (stats)

Statistiques globales calculées automatiquement:

```json
{
  "totalProducts": 120,
  "totalOrders": 60,
  "totalVendors": 10,
  "totalUsers": 30,
  "totalRevenue": 4201150,
  "pendingOrders": 7,
  "processingOrders": 13,
  "shippedOrders": 7,
  "deliveredOrders": 28,
  "cancelledOrders": 5,
  "activeProducts": 115,
  "featuredProducts": 40,
  "verifiedVendors": 10,
  "averageOrderValue": 82187,
  "lastUpdated": "2026-02-12T13:53:41.879989"
}
```

---

## 🚀 Utilisation

### Démarrer le serveur

```bash
# Depuis le dossier mock-server
npm run server

# Ou depuis la racine
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Endpoints API

- `GET /users` - Liste des utilisateurs
- `GET /vendors` - Liste des vendeurs
- `GET /products` - Liste des produits
- `GET /orders` - Liste des commandes
- `GET /reviews` - Liste des avis
- `GET /wishlist` - Liste des favoris
- `GET /cart` - Panier
- `GET /notifications` - Notifications
- `GET /stats` - Statistiques globales
- `GET /regions` - Régions
- `GET /categories` - Catégories

### Authentification

```bash
POST /login
{
  "email": "admin@localmarket.bf",
  "password": "password123"
}
```

---

## 🔄 Régénération des Données

Pour régénérer les données avec de nouvelles valeurs aléatoires:

```bash
python generate-massive-data.py
```

**Note**: Cela écrasera le fichier `db.json` existant. Un backup est automatiquement créé (`db.json.backup`).

---

## ✅ Cohérence des Données

Toutes les données sont **cohérentes** et **liées** entre elles:

- ✅ Chaque commande référence des produits et utilisateurs existants
- ✅ Chaque produit appartient à un vendeur existant
- ✅ Chaque vendeur est lié à un utilisateur avec rôle "vendor"
- ✅ Chaque avis référence un produit et un utilisateur existants
- ✅ Les statistiques sont calculées à partir des données réelles
- ✅ Les dates sont cohérentes (créées dans le passé, livrées après création)
- ✅ Les montants sont calculés correctement (subtotal + shipping - discount = total)

---

## 📝 Notes Importantes

1. **Mot de passe**: Tous les comptes utilisent `password123` (hashé en bcrypt)
2. **Images**: URLs Unsplash génériques (à remplacer par vraies images si besoin)
3. **Téléphones**: Format burkinabé (+226)
4. **Monnaie**: FCFA (Franc CFA)
5. **Langue**: Français (avec accents simplifiés pour compatibilité)

---

**Dernière mise à jour**: 12 février 2026
**Version**: 1.0.0
**Générée par**: generate-massive-data.py
