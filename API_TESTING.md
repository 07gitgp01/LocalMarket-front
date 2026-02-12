# Test de l'API LocalMarket

## Exemples de requêtes cURL

### 1. Vérifier que l'API fonctionne
```bash
curl http://localhost:3000/api/health
```

### 2. Récupérer tous les produits
```bash
curl http://localhost:3000/api/products
```

### 3. Récupérer toutes les catégories
```bash
curl http://localhost:3000/api/categories
```

### 4. Récupérer tous les vendeurs
```bash
curl http://localhost:3000/api/vendors
```

### 5. Recherche de produits
```bash
# Recherche par mot-clé
curl "http://localhost:3000/api/products/search?q=mil"

# Recherche par catégorie
curl "http://localhost:3000/api/products/search?category=Céréales & Graines"

# Recherche avec prix
curl "http://localhost:3000/api/products/search?minPrice=500&maxPrice=1000"

# Produits featured
curl "http://localhost:3000/api/products/search?featured=true"

# Recherche combinée
curl "http://localhost:3000/api/products/search?q=karité&featured=true&minPrice=1000"
```

### 6. Statistiques
```bash
curl http://localhost:3000/api/stats
```

### 7. Connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@localmarket.bf","password":"admin123"}'
```

### 8. Inscription
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"nouveau@localmarket.bf",
    "password":"password123",
    "firstName":"Abdoul",
    "lastName":"Kader",
    "phone":"+226 70 11 22 33",
    "role":"customer"
  }'
```

### 9. Récupérer les régions
```bash
curl http://localhost:3000/api/regions
```

### 10. Récupérer une région spécifique
```bash
curl http://localhost:3000/api/regions/1
```

### 11. Récupérer les commandes
```bash
curl http://localhost:3000/api/orders
```

### 12. Récupérer le panier
```bash
curl http://localhost:3000/api/cart
```

### 13. Récupérer les avis
```bash
curl http://localhost:3000/api/reviews
```

## Exemples PowerShell (Windows)

### 1. Vérifier que l'API fonctionne
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
```

### 2. Récupérer tous les produits
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Get
```

### 3. Connexion
```powershell
$body = @{
    email = "admin@localmarket.bf"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### 4. Statistiques
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/stats" -Method Get
```

### 5. Recherche de produits
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products/search?q=mil&featured=true" -Method Get
```

## Test avec Postman

Importez cette collection dans Postman :

```json
{
  "info": {
    "name": "LocalMarket API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/health"
      }
    },
    {
      "name": "Get Products",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/products"
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"admin@localmarket.bf\",\n  \"password\": \"admin123\"\n}"
        },
        "url": "http://localhost:3000/api/auth/login"
      }
    },
    {
      "name": "Search Products",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/api/products/search?q=mil&featured=true",
          "query": [
            {
              "key": "q",
              "value": "mil"
            },
            {
              "key": "featured",
              "value": "true"
            }
          ]
        }
      }
    },
    {
      "name": "Get Stats",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/stats"
      }
    }
  ]
}
```

## Résultats Attendus

### Health Check
```json
{
  "status": "ok",
  "timestamp": "2024-06-22T10:00:00.000Z",
  "message": "LocalMarket API is running"
}
```

### Stats
```json
{
  "totalProducts": 10,
  "totalOrders": 2,
  "totalVendors": 10,
  "totalUsers": 10,
  "totalRevenue": 37500,
  "pendingOrders": 1,
  "deliveredOrders": 1,
  "activeProducts": 10,
  "featuredProducts": 5
}
```

### Login Response
```json
{
  "accessToken": "[BASE64_TOKEN]",
  "user": {
    "id": 1,
    "email": "admin@localmarket.bf",
    "firstName": "Amidou",
    "lastName": "Ouédraogo",
    "role": "admin",
    "phone": "+226 70 12 34 56",
    "avatar": "https://i.pravatar.cc/150?img=1"
  }
}
```
