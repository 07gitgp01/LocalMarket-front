# 🔐 Guide de Connexion - LocalMarket

## Comptes de Test Disponibles

### 👨‍💼 Admin
- **Email:** `admin@localmarket.bf`
- **Mot de passe:** `password123`
- **Accès:** Dashboard Admin complet
- **Redirection:** `/admin`

### 🏪 Vendeur (Vendor)
- **Email:** `user5@localmarket.bf`
- **Mot de passe:** `password123`
- **Accès:** Dashboard Vendeur (Analytics + CRUD Produits)
- **Redirection:** `/vendor-dashboard`
- **VendorId:** 1

### 👤 Client (Customer)
- **Email:** `user2@localmarket.bf`
- **Mot de passe:** `password123`
- **Accès:** Site public + Commandes + Profil
- **Redirection:** `/` (page d'accueil)

---

## 🛡️ Système d'Authentification

### Guards Implémentés

#### 1. **authGuard** - Protection Routes Authentifiées
```typescript
// Vérifie si l'utilisateur est connecté
// Redirige vers /auth/login si non connecté
// Sauvegarde returnUrl pour redirection après login
```

**Routes protégées:**
- `/profile` - Profil utilisateur
- `/orders` - Commandes
- `/checkout` - Processus de paiement
- `/vendor-dashboard` - Dashboard vendeur
- `/admin` - Dashboard admin

#### 2. **vendorGuard** - Protection Espace Vendeur
```typescript
// Vérifie si role = 'vendor' OU 'admin'
// Admin a accès à tout
// Redirige vers / si client connecté
// Redirige vers /auth/login si non connecté
```

**Routes protégées:**
- `/vendor-dashboard/**` - Tout l'espace vendeur

#### 3. **roleGuard** - Protection par Rôle Spécifique
```typescript
// Vérifie si le rôle correspond aux rôles autorisés
// Utilise route.data['roles'] pour définir les rôles
// Redirige vers / si rôle insuffisant
```

**Routes protégées:**
- `/admin/**` - Uniquement admin

---

## 🔄 Flux d'Authentification

### Connexion
1. Utilisateur entre email/password
2. POST `/api/auth/login`
3. Réception `{ accessToken, user }`
4. Sauvegarde dans localStorage
5. Mise à jour du signal `currentUserSignal`
6. Redirection selon rôle:
   - **Admin** → `/admin`
   - **Vendor** → `/vendor-dashboard`
   - **Customer** → `/` ou `returnUrl`

### Déconnexion
1. Suppression localStorage (`accessToken`, `user`)
2. Reset du signal `currentUserSignal`
3. Redirection vers `/auth/login`
4. Notification "Vous êtes déconnecté"

---

## 🚀 Connexion Rapide (Boutons Demo)

La page de login inclut 3 boutons pour connexion rapide:
- **Admin** - Remplit automatiquement les credentials admin
- **Vendeur** - Remplit automatiquement les credentials vendeur
- **Client** - Remplit automatiquement les credentials client

---

## 📋 Routes par Rôle

### 🌐 Routes Publiques (Tous)
```
/                    - Accueil
/products            - Liste produits
/products/:id        - Détail produit
/cart                - Panier
/regions             - Régions
/vendors             - Liste vendeurs publique
/auth/login          - Connexion
/auth/register       - Inscription
```

### 👤 Routes Client (Customer)
```
/profile             - Profil
/orders              - Liste commandes
/orders/:id          - Détail commande
/checkout            - Paiement
/checkout/success    - Confirmation
```

### 🏪 Routes Vendeur (Vendor)
```
/vendor-dashboard                  - Layout principal
/vendor-dashboard/analytics        - Dashboard Analytics
/vendor-dashboard/products         - Liste produits
/vendor-dashboard/products/new     - Nouveau produit
/vendor-dashboard/products/edit/:id - Modifier produit
/vendor-dashboard/orders           - Commandes vendeur
/vendor-dashboard/profile          - Profil boutique
```

### 👨‍💼 Routes Admin (Admin)
```
/admin                - Layout principal
/admin/dashboard      - Dashboard admin
/admin/users          - Gestion utilisateurs
/admin/vendors        - Gestion vendeurs
/admin/products       - Gestion produits
/admin/orders         - Gestion commandes
/admin/statistics     - Statistiques globales
```

---

## 🔧 Configuration Technique

### AuthService Signals
```typescript
currentUser = signal<User | null>(null)
isAuthenticated = computed(() => !!currentUser())
isAdmin = computed(() => currentUser()?.role === 'admin')
isVendor = computed(() => currentUser()?.role === 'vendor' || isAdmin())
```

### User Model
```typescript
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'vendor' | 'customer';
  phone: string;
  address: Address;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  vendorId?: number; // Pour les vendeurs
  createdAt: string;
}
```

### AuthResponse
```typescript
interface AuthResponse {
  accessToken: string;
  user: User;
}
```

---

## ✅ Vérifications de Sécurité

### ✓ Token JWT
- Stocké dans localStorage
- Envoyé dans headers HTTP via interceptor
- Vérifié côté serveur (json-server-auth)

### ✓ Guards Angular
- authGuard - Authentification requise
- vendorGuard - Rôle vendeur/admin requis
- roleGuard - Rôles spécifiques requis

### ✓ Redirections Automatiques
- Non connecté → `/auth/login`
- Rôle insuffisant → `/`
- Après login → Route appropriée selon rôle

### ✓ Notifications Utilisateur
- Succès de connexion
- Erreurs d'authentification
- Accès refusé
- Déconnexion

---

## 🧪 Tests de Connexion

### Test 1: Connexion Admin
1. Aller sur `/auth/login`
2. Cliquer "Admin" (connexion rapide)
3. Vérifier redirection vers `/admin`
4. Vérifier accès dashboard admin

### Test 2: Connexion Vendeur
1. Aller sur `/auth/login`
2. Cliquer "Vendeur" (connexion rapide)
3. Vérifier redirection vers `/vendor-dashboard`
4. Vérifier accès analytics et produits

### Test 3: Connexion Client
1. Aller sur `/auth/login`
2. Cliquer "Client" (connexion rapide)
3. Vérifier redirection vers `/`
4. Vérifier accès profil et commandes

### Test 4: Protection Routes
1. Se déconnecter
2. Essayer d'accéder `/vendor-dashboard`
3. Vérifier redirection vers `/auth/login`
4. Vérifier notification "Veuillez vous connecter"

### Test 5: Rôles Insuffisants
1. Se connecter comme client
2. Essayer d'accéder `/vendor-dashboard`
3. Vérifier redirection vers `/`
4. Vérifier notification "Espace réservé aux vendeurs"

---

## 📝 Notes Importantes

- **Tous les mots de passe:** `password123`
- **Hash bcrypt:** Géré par json-server-auth
- **Persistence:** localStorage (côté client)
- **Expiration token:** Non implémentée (TODO)
- **Refresh token:** Non implémenté (TODO)
- **2FA:** Non implémenté (TODO)

---

## 🚨 Troubleshooting

### Problème: "Email ou mot de passe incorrect"
- Vérifier que json-server tourne sur port 3000
- Vérifier les credentials dans db.json
- Vérifier la console pour erreurs HTTP

### Problème: Redirection incorrecte après login
- Vérifier `redirectAfterLogin()` dans AuthService
- Vérifier le rôle de l'utilisateur dans db.json
- Vérifier les routes dans app.routes.ts

### Problème: Guard bloque l'accès
- Vérifier que l'utilisateur est connecté
- Vérifier le rôle de l'utilisateur
- Vérifier les guards appliqués à la route
- Vérifier la console pour messages d'erreur

---

**Dernière mise à jour:** 12 Février 2026
