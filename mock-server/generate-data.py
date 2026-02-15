import json
import random
from datetime import datetime, timedelta

# Charger le fichier existant
with open('db.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Garder les données existantes de base
users = data['users']
regions = data['regions']
categories = data['categories']
vendors = data['vendors']

# Générer plus de produits (50 produits au total)
products_data = [
    # Céréales (vendor 1)
    {"name": "Riz Local Parfumé", "category": "Céréales & Graines", "price": 650, "vendorId": 1, "stock": 400},
    {"name": "Fonio Blanc", "category": "Céréales & Graines", "price": 800, "vendorId": 1, "stock": 200},
    {"name": "Haricot Niébé", "category": "Céréales & Graines", "price": 550, "vendorId": 1, "stock": 350},
    {"name": "Arachide Décortiquée", "category": "Céréales & Graines", "price": 700, "vendorId": 1, "stock": 300},
    
    # Fruits & Légumes (vendor 5)
    {"name": "Oignons Rouges", "category": "Fruits & Légumes", "price": 400, "vendorId": 5, "stock": 500},
    {"name": "Piments Verts", "category": "Fruits & Légumes", "price": 800, "vendorId": 5, "stock": 150},
    {"name": "Aubergines Locales", "category": "Fruits & Légumes", "price": 500, "vendorId": 5, "stock": 200},
    {"name": "Gombos Frais", "category": "Fruits & Légumes", "price": 600, "vendorId": 5, "stock": 180},
    {"name": "Carottes", "category": "Fruits & Légumes", "price": 450, "vendorId": 5, "stock": 250},
    {"name": "Choux", "category": "Fruits & Légumes", "price": 350, "vendorId": 5, "stock": 200},
    {"name": "Pastèques", "category": "Fruits & Légumes", "price": 2000, "vendorId": 5, "stock": 100},
    {"name": "Bananes Plantain", "category": "Fruits & Légumes", "price": 1200, "vendorId": 5, "stock": 300},
    
    # Artisanat (vendor 2)
    {"name": "Statuette Bronze", "category": "Artisanat", "price": 12000, "vendorId": 2, "stock": 15},
    {"name": "Collier Perles", "category": "Artisanat", "price": 8000, "vendorId": 2, "stock": 30},
    {"name": "Bracelet Cuir", "category": "Artisanat", "price": 3500, "vendorId": 2, "stock": 50},
    {"name": "Tambour Djembé", "category": "Artisanat", "price": 35000, "vendorId": 2, "stock": 10},
    {"name": "Calebasse Décorée", "category": "Artisanat", "price": 6000, "vendorId": 2, "stock": 25},
    {"name": "Sac Tissé Main", "category": "Artisanat", "price": 7500, "vendorId": 2, "stock": 40},
    
    # Textile (vendor 4)
    {"name": "Boubou Homme", "category": "Textile & Faso Dan Fani", "price": 45000, "vendorId": 4, "stock": 20},
    {"name": "Robe Femme Faso", "category": "Textile & Faso Dan Fani", "price": 38000, "vendorId": 4, "stock": 25},
    {"name": "Écharpe Tissée", "category": "Textile & Faso Dan Fani", "price": 8000, "vendorId": 4, "stock": 50},
    {"name": "Nappe Traditionnelle", "category": "Textile & Faso Dan Fani", "price": 15000, "vendorId": 4, "stock": 30},
    
    # Karité (vendor 3)
    {"name": "Beurre de Karité 1kg", "category": "Karité & Produits Cosmétiques", "price": 6500, "vendorId": 3, "stock": 80},
    {"name": "Huile de Karité", "category": "Karité & Produits Cosmétiques", "price": 4500, "vendorId": 3, "stock": 60},
    {"name": "Crème Visage Karité", "category": "Karité & Produits Cosmétiques", "price": 5000, "vendorId": 3, "stock": 100},
    {"name": "Baume à Lèvres Karité", "category": "Karité & Produits Cosmétiques", "price": 2000, "vendorId": 3, "stock": 150},
    
    # Épices
    {"name": "Soumbala", "category": "Épices & Condiments", "price": 1500, "vendorId": 1, "stock": 200},
    {"name": "Piment Moulu", "category": "Épices & Condiments", "price": 1200, "vendorId": 1, "stock": 250},
    {"name": "Gingembre Séché", "category": "Épices & Condiments", "price": 2000, "vendorId": 1, "stock": 150},
    {"name": "Ail en Poudre", "category": "Épices & Condiments", "price": 1800, "vendorId": 1, "stock": 180},
    
    # Volaille
    {"name": "Poulet Bicyclette", "category": "Volaille & Œufs", "price": 4500, "vendorId": 5, "stock": 50},
    {"name": "Œufs Frais (30)", "category": "Volaille & Œufs", "price": 3000, "vendorId": 5, "stock": 100},
    {"name": "Pintade", "category": "Volaille & Œufs", "price": 5500, "vendorId": 5, "stock": 30},
    
    # Miel
    {"name": "Miel Pur 500ml", "category": "Miel & Produits de la Ruche", "price": 4000, "vendorId": 3, "stock": 80},
    {"name": "Propolis", "category": "Miel & Produits de la Ruche", "price": 3500, "vendorId": 3, "stock": 40},
    {"name": "Cire d'Abeille", "category": "Miel & Produits de la Ruche", "price": 2500, "vendorId": 3, "stock": 60},
    
    # Boissons
    {"name": "Jus de Bissap 1L", "category": "Boissons Traditionnelles", "price": 1500, "vendorId": 5, "stock": 200},
    {"name": "Jus de Gingembre 1L", "category": "Boissons Traditionnelles", "price": 1500, "vendorId": 5, "stock": 200},
    {"name": "Jus de Tamarin 1L", "category": "Boissons Traditionnelles", "price": 1800, "vendorId": 5, "stock": 150},
    {"name": "Dolo Traditionnel 1L", "category": "Boissons Traditionnelles", "price": 1000, "vendorId": 5, "stock": 100},
    
    # Tubercules
    {"name": "Ignames", "category": "Tubercules & Racines", "price": 800, "vendorId": 5, "stock": 300},
    {"name": "Patates Douces", "category": "Tubercules & Racines", "price": 600, "vendorId": 5, "stock": 400},
    {"name": "Manioc", "category": "Tubercules & Racines", "price": 500, "vendorId": 5, "stock": 350},
]

products = []
for i, p in enumerate(products_data, start=11):
    products.append({
        "id": i,
        "vendorId": p["vendorId"],
        "name": p["name"],
        "slug": p["name"].lower().replace(" ", "-").replace("é", "e").replace("è", "e").replace("ê", "e"),
        "description": f"{p['name']} de qualité supérieure, produit local du Burkina Faso",
        "category": p["category"],
        "subCategory": p["category"].split("&")[0].strip(),
        "price": p["price"],
        "compareAtPrice": int(p["price"] * 1.2) if random.random() > 0.5 else None,
        "unit": "kg" if "kg" not in p["name"] else "pièce",
        "images": [f"https://images.unsplash.com/photo-{random.randint(1500000000000, 1700000000000)}?w=800"],
        "stock": p["stock"],
        "minOrder": 1,
        "maxOrder": min(50, p["stock"] // 2),
        "rating": round(random.uniform(4.2, 5.0), 1),
        "reviewCount": random.randint(10, 150),
        "featured": random.random() > 0.7,
        "tags": random.sample(["bio", "local", "frais", "artisanal", "traditionnel"], k=random.randint(1, 3)),
        "attributes": {"origin": random.choice(["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora"])},
        "isActive": True,
        "createdAt": (datetime.now() - timedelta(days=random.randint(1, 180))).isoformat()
    })

# Ajouter les 10 produits existants
existing_products = data['products'][:10]
all_products = existing_products + products

# Générer plus de commandes (20 commandes)
orders = []
statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
payment_methods = ["orange_money", "wave", "cash_on_delivery"]

for i in range(1, 21):
    num_items = random.randint(1, 4)
    items = []
    subtotal = 0
    
    for _ in range(num_items):
        product = random.choice(all_products)
        quantity = random.randint(1, 5)
        total = product["price"] * quantity
        subtotal += total
        
        items.append({
            "productId": product["id"],
            "name": product["name"],
            "quantity": quantity,
            "price": product["price"],
            "total": total,
            "vendorId": product["vendorId"]
        })
    
    shipping_cost = random.choice([1000, 1500, 2000])
    discount = random.choice([0, 500, 1000, 1500]) if random.random() > 0.7 else 0
    total = subtotal + shipping_cost - discount
    
    status = random.choice(statuses)
    created_date = datetime.now() - timedelta(days=random.randint(1, 90))
    
    order = {
        "id": i,
        "userId": random.choice([4, 5, 7, 9, 10, 12, 13, 14, 15]),
        "orderNumber": f"ORD-BF-2024-{str(i).zfill(3)}",
        "status": status,
        "items": items,
        "subtotal": subtotal,
        "shippingCost": shipping_cost,
        "tax": 0,
        "discount": discount,
        "total": total,
        "paymentMethod": random.choice(payment_methods),
        "paymentStatus": "paid" if status in ["delivered", "shipped"] else "pending",
        "shippingAddress": {
            "firstName": "Client",
            "lastName": "Test",
            "phone": "+226 70 00 00 00",
            "street": "Secteur 15",
            "city": random.choice(["Ouagadougou", "Bobo-Dioulasso", "Koudougou"]),
            "region": "Centre",
            "postalCode": "01 BP 1234"
        },
        "createdAt": created_date.isoformat(),
        "updatedAt": (created_date + timedelta(hours=random.randint(1, 48))).isoformat()
    }
    
    if status == "delivered":
        order["deliveryDate"] = (created_date + timedelta(days=random.randint(2, 7))).isoformat()
    elif status in ["processing", "shipped"]:
        order["estimatedDeliveryDate"] = (created_date + timedelta(days=random.randint(3, 10))).isoformat()
    
    orders.append(order)

# Générer des reviews (50 reviews)
reviews = []
review_titles = [
    "Excellent produit!", "Très satisfait", "Bonne qualité", "Je recommande",
    "Produit conforme", "Livraison rapide", "Très bon rapport qualité/prix",
    "Parfait!", "Produit de qualité", "Très content de mon achat"
]

for i in range(1, 51):
    product = random.choice(all_products)
    reviews.append({
        "id": i,
        "productId": product["id"],
        "userId": random.choice([4, 5, 7, 9, 10, 12, 13, 14, 15]),
        "rating": random.randint(4, 5),
        "title": random.choice(review_titles),
        "comment": f"Très bon produit, je suis satisfait de la qualité. {random.choice(['Je recommande!', 'Livraison rapide.', 'Conforme à la description.'])}",
        "helpful": random.randint(0, 50),
        "verified": random.random() > 0.3,
        "createdAt": (datetime.now() - timedelta(days=random.randint(1, 60))).isoformat()
    })

# Générer des wishlists (10 wishlists)
wishlists = []
for i in range(1, 11):
    user_id = random.choice([4, 5, 7, 9, 10, 12, 13, 14, 15])
    product = random.choice(all_products)
    wishlists.append({
        "id": i,
        "userId": user_id,
        "productId": product["id"],
        "addedAt": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat()
    })

# Générer des stats globales
stats = {
    "totalProducts": len(all_products),
    "totalOrders": len(orders),
    "totalVendors": len(vendors),
    "totalUsers": len(users),
    "totalRevenue": sum(o["total"] for o in orders if o["paymentStatus"] == "paid"),
    "pendingOrders": len([o for o in orders if o["status"] == "pending"]),
    "deliveredOrders": len([o for o in orders if o["status"] == "delivered"]),
    "activeProducts": len([p for p in all_products if p["isActive"]]),
    "featuredProducts": len([p for p in all_products if p["featured"]])
}

# Créer le nouveau fichier db.json
new_data = {
    "users": users,
    "regions": regions,
    "categories": categories,
    "vendors": vendors,
    "products": all_products,
    "orders": orders,
    "cart": [],
    "reviews": reviews,
    "wishlist": wishlists,
    "stats": stats
}

# Sauvegarder
with open('db.json', 'w', encoding='utf-8') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=2)

print("Base de donnees enrichie creee avec succes!")
print("Statistiques:")
print(f"   - Utilisateurs: {len(users)}")
print(f"   - Vendeurs: {len(vendors)}")
print(f"   - Produits: {len(all_products)}")
print(f"   - Commandes: {len(orders)}")
print(f"   - Avis: {len(reviews)}")
print(f"   - Wishlists: {len(wishlists)}")
print(f"   - Revenu total: {stats['totalRevenue']:,} FCFA")
