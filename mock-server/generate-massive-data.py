import json
import random
from datetime import datetime, timedelta

# Configuration
NUM_USERS = 30
NUM_VENDORS = 12
NUM_PRODUCTS = 120
NUM_ORDERS = 60
NUM_REVIEWS = 150
NUM_WISHLISTS = 40
NUM_CART_ITEMS = 15

# Données de base
FIRST_NAMES = [
    "Amidou", "Fatoumata", "Ablasse", "Aminata", "Boureima", "Rasmata", "Salif", 
    "Mariame", "Issa", "Hawa", "Moussa", "Aicha", "Ibrahim", "Mariam", "Souleymane",
    "Zenabou", "Adama", "Safiatou", "Ousmane", "Rokia", "Seydou", "Kadiatou",
    "Mamadou", "Asseta", "Yacouba", "Nana", "Boubacar", "Awa", "Karim", "Fanta"
]

LAST_NAMES = [
    "Ouedraogo", "Compaore", "Sawadogo", "Kabore", "Traore", "Sankara", "Yameogo",
    "Zoungrana", "Ouattara", "Diallo", "Guigma", "Sana", "Zongo", "Tapsoba",
    "Nikiema", "Ilboudo", "Konate", "Cisse", "Sow", "Barry"
]

CITIES = [
    "Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Banfora",
    "Kaya", "Fada N'Gourma", "Dedougou", "Tenkodogo", "Gaoua"
]

PRODUCT_NAMES = {
    "Cereales & Graines": [
        "Mil Local Rouge", "Mil Blanc", "Sorgho Rouge", "Sorgho Blanc", "Mais Blanc",
        "Mais Jaune", "Riz Local Parfume", "Riz Etuve", "Fonio Blanc", "Fonio Noir",
        "Haricot Niebe Rouge", "Haricot Niebe Blanc", "Arachide Decortiqu", "Arachide Coque",
        "Sesame Blanc", "Sesame Noir", "Voandzou", "Pois de Terre"
    ],
    "Fruits & Legumes": [
        "Mangues Amelie", "Mangues Kent", "Tomates Fraiches", "Tomates Cerises",
        "Oignons Rouges", "Oignons Blancs", "Piments Verts", "Piments Rouges",
        "Aubergines Locales", "Aubergines Blanches", "Gombos Frais", "Carottes",
        "Choux Pommes", "Choux Fleurs", "Pasteques", "Melons", "Bananes Plantain",
        "Bananes Douces", "Oranges", "Citrons", "Papayes", "Avocats", "Ananas"
    ],
    "Artisanat": [
        "Masque Bobo", "Masque Mossi", "Statuette Bronze", "Statuette Bois",
        "Collier Perles", "Collier Cauris", "Bracelet Cuir", "Bracelet Perles",
        "Tambour Djembe", "Tambour Balafon", "Calebasse Decoree", "Calebasse Simple",
        "Sac Tisse Main", "Sac Cuir", "Panier Tresse", "Panier Osier",
        "Sculpture Bois", "Sculpture Pierre", "Poterie Traditionnelle"
    ],
    "Textile & Faso Dan Fani": [
        "Tissu Faso Dan Fani Premium", "Tissu Faso Dan Fani Classic", "Boubou Homme",
        "Boubou Femme", "Robe Femme Faso", "Robe Cocktail", "Echarpe Tissee",
        "Echarpe Brodee", "Nappe Traditionnelle", "Nappe Moderne", "Pagne Wax",
        "Pagne Batik", "Chemise Homme", "Ensemble Femme"
    ],
    "Karite & Produits Cosmetiques": [
        "Beurre de Karite Bio 500g", "Beurre de Karite Bio 1kg", "Beurre de Karite 250g",
        "Huile de Karite", "Creme Visage Karite", "Creme Corps Karite",
        "Baume a Levres Karite", "Savon au Karite", "Savon Noir Africain",
        "Shampoing Karite", "Apres-Shampoing Karite", "Masque Cheveux Karite"
    ],
    "Epices & Condiments": [
        "Soumbala", "Piment Moulu", "Piment Entier", "Gingembre Seche",
        "Gingembre Frais", "Ail en Poudre", "Ail Frais", "Poivre Noir",
        "Curcuma", "Curry Local", "Sel Gemme", "Cube Maggi Local"
    ],
    "Volaille & Oeufs": [
        "Poulet Bicyclette", "Poulet Fermier", "Pintade", "Canard",
        "Oeufs Frais (30)", "Oeufs Frais (12)", "Oeufs Bio (30)"
    ],
    "Miel & Produits de la Ruche": [
        "Miel Pur 500ml", "Miel Pur 1L", "Miel Pur 250ml", "Propolis",
        "Cire d'Abeille", "Pollen", "Gelee Royale"
    ],
    "Boissons Traditionnelles": [
        "Jus de Bissap 1L", "Jus de Bissap 500ml", "Jus de Gingembre 1L",
        "Jus de Gingembre 500ml", "Jus de Tamarin 1L", "Jus de Baobab 1L",
        "Dolo Traditionnel 1L", "Zoom-Koom 1L"
    ],
    "Tubercules & Racines": [
        "Ignames", "Patates Douces", "Patates Douces Violettes", "Manioc",
        "Taro", "Pommes de Terre Locales"
    ]
}

SHOP_NAMES = [
    "Cooperative Wend Panga", "Artisanat de Bobo", "Karite d'Or", "Faso Dan Fani Traditionnel",
    "Fruits du Sahel", "Bio Burkina", "Terroir du Faso", "Saveurs Locales",
    "Artisans du Sahel", "Tissage Traditionnel", "Marche Vert", "Epicerie du Village"
]

# Générer utilisateurs
def generate_users(num):
    users = []
    # Admin
    users.append({
        "id": 1,
        "email": "admin@localmarket.bf",
        "password": "$2a$10$JGhkFLEWK1OfzJ.JQzBfHOqT.aUL93vQ4T8v6.CdHxXQ81K5M5v72",
        "firstName": "Amidou",
        "lastName": "Ouedraogo",
        "role": "admin",
        "phone": "+226 70 12 34 56",
        "address": {
            "street": "Avenue Kwame Nkrumah",
            "city": "Ouagadougou",
            "region": "Centre",
            "postalCode": "01 BP 1234"
        },
        "avatar": "https://i.pravatar.cc/150?img=1",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z"
    })
    
    # Vendors et Customers
    vendor_count = 0
    for i in range(2, num + 1):
        is_vendor = vendor_count < NUM_VENDORS and random.random() > 0.6
        if is_vendor:
            vendor_count += 1
            
        user = {
            "id": i,
            "email": f"user{i}@localmarket.bf",
            "password": "$2a$10$JGhkFLEWK1OfzJ.JQzBfHOqT.aUL93vQ4T8v6.CdHxXQ81K5M5v72",
            "firstName": random.choice(FIRST_NAMES),
            "lastName": random.choice(LAST_NAMES),
            "role": "vendor" if is_vendor else "customer",
            "phone": f"+226 {random.randint(60, 79)} {random.randint(10, 99)} {random.randint(10, 99)} {random.randint(10, 99)}",
            "address": {
                "street": f"Secteur {random.randint(1, 30)}",
                "city": random.choice(CITIES),
                "region": random.choice(["Centre", "Hauts-Bassins", "Centre-Ouest", "Nord"]),
                "postalCode": f"01 BP {random.randint(1000, 9999)}"
            },
            "avatar": f"https://i.pravatar.cc/150?img={i}",
            "status": "active",
            "createdAt": (datetime.now() - timedelta(days=random.randint(30, 365))).isoformat()
        }
        
        if is_vendor:
            user["vendorId"] = vendor_count
            
        users.append(user)
    
    return users

# Générer vendeurs
def generate_vendors(users):
    vendors = []
    vendor_users = [u for u in users if u.get("role") == "vendor"]
    
    categories = list(PRODUCT_NAMES.keys())
    
    for i, user in enumerate(vendor_users, start=1):
        vendor = {
            "id": i,
            "userId": user["id"],
            "shopName": SHOP_NAMES[i-1] if i <= len(SHOP_NAMES) else f"Boutique {user['firstName']}",
            "description": f"Specialiste des produits locaux du Burkina Faso - {random.choice(categories)}",
            "logo": f"https://i.pravatar.cc/200?img={30+i}",
            "banner": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=300&fit=crop",
            "category": random.choice(categories),
            "rating": round(random.uniform(4.2, 5.0), 1),
            "reviewCount": random.randint(50, 300),
            "productCount": random.randint(10, 50),
            "verified": random.random() > 0.2,
            "regionId": random.randint(1, 10),
            "location": {
                "street": user["address"]["street"],
                "city": user["address"]["city"],
                "region": user["address"]["region"],
                "coordinates": {
                    "lat": round(random.uniform(9.0, 15.0), 4),
                    "lng": round(random.uniform(-5.5, 2.0), 4)
                }
            },
            "contact": {
                "phone": user["phone"],
                "email": f"contact@{user['lastName'].lower()}.bf",
                "whatsapp": user["phone"]
            },
            "businessHours": {
                "monday": "08:00-18:00",
                "tuesday": "08:00-18:00",
                "wednesday": "08:00-18:00",
                "thursday": "08:00-18:00",
                "friday": "08:00-18:00",
                "saturday": "08:00-14:00",
                "sunday": "Ferme"
            },
            "createdAt": user["createdAt"]
        }
        vendors.append(vendor)
    
    return vendors

# Générer produits
def generate_products(vendors, num):
    products = []
    product_id = 1
    
    for category, names in PRODUCT_NAMES.items():
        for name in names:
            if product_id > num:
                break
                
            vendor = random.choice(vendors)
            base_price = random.choice([400, 450, 500, 600, 800, 1000, 1200, 1500, 2000, 3000, 5000, 8000, 12000, 15000, 25000, 35000, 45000])
            
            product = {
                "id": product_id,
                "vendorId": vendor["id"],
                "name": name,
                "slug": name.lower().replace(" ", "-").replace("'", "-"),
                "description": f"{name} de qualite superieure, produit local du Burkina Faso. Ideal pour vos preparations culinaires et besoins quotidiens.",
                "category": category,
                "subCategory": category.split("&")[0].strip(),
                "price": base_price,
                "compareAtPrice": int(base_price * random.uniform(1.15, 1.3)) if random.random() > 0.5 else None,
                "unit": random.choice(["kg", "piece", "litre", "paquet", "sac"]),
                "images": [
                    f"https://images.unsplash.com/photo-{random.randint(1500000000000, 1700000000000)}?w=800",
                    f"https://images.unsplash.com/photo-{random.randint(1500000000000, 1700000000000)}?w=800"
                ],
                "stock": random.randint(10, 500),
                "minOrder": 1,
                "maxOrder": random.randint(20, 100),
                "rating": round(random.uniform(4.0, 5.0), 1),
                "reviewCount": random.randint(5, 200),
                "featured": random.random() > 0.7,
                "tags": random.sample(["bio", "local", "frais", "artisanal", "traditionnel", "certifie"], k=random.randint(1, 3)),
                "attributes": {
                    "origin": random.choice(CITIES),
                    "certification": random.choice(["Bio", "Ecocert", "Local", None])
                },
                "isActive": random.random() > 0.05,
                "createdAt": (datetime.now() - timedelta(days=random.randint(1, 300))).isoformat()
            }
            
            products.append(product)
            product_id += 1
            
            if product_id > num:
                break
    
    return products

# Générer commandes
def generate_orders(users, products, num):
    orders = []
    customer_users = [u for u in users if u["role"] == "customer"]
    statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    payment_methods = ["orange_money", "wave", "cash_on_delivery"]
    
    for i in range(1, num + 1):
        user = random.choice(customer_users)
        num_items = random.randint(1, 5)
        items = []
        subtotal = 0
        
        for _ in range(num_items):
            product = random.choice(products)
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
        
        shipping_cost = random.choice([1000, 1500, 2000, 2500])
        discount = random.choice([0, 500, 1000, 1500, 2000]) if random.random() > 0.6 else 0
        total = subtotal + shipping_cost - discount
        
        status = random.choices(statuses, weights=[15, 20, 15, 40, 10])[0]
        created_date = datetime.now() - timedelta(days=random.randint(1, 120))
        
        order = {
            "id": i,
            "userId": user["id"],
            "orderNumber": f"ORD-BF-2024-{str(i).zfill(4)}",
            "status": status,
            "items": items,
            "subtotal": subtotal,
            "shippingCost": shipping_cost,
            "tax": 0,
            "discount": discount,
            "total": total,
            "paymentMethod": random.choice(payment_methods),
            "paymentStatus": "paid" if status in ["delivered", "shipped", "processing"] else "pending",
            "shippingAddress": {
                "firstName": user["firstName"],
                "lastName": user["lastName"],
                "phone": user["phone"],
                "street": user["address"]["street"],
                "city": user["address"]["city"],
                "region": user["address"]["region"],
                "postalCode": user["address"]["postalCode"]
            },
            "createdAt": created_date.isoformat(),
            "updatedAt": (created_date + timedelta(hours=random.randint(1, 72))).isoformat()
        }
        
        if status == "delivered":
            order["deliveryDate"] = (created_date + timedelta(days=random.randint(2, 10))).isoformat()
        elif status in ["processing", "shipped"]:
            order["estimatedDeliveryDate"] = (datetime.now() + timedelta(days=random.randint(1, 7))).isoformat()
        
        orders.append(order)
    
    return orders

# Générer reviews
def generate_reviews(users, products, num):
    reviews = []
    customer_users = [u for u in users if u["role"] == "customer"]
    
    titles = [
        "Excellent produit!", "Tres satisfait", "Bonne qualite", "Je recommande vivement",
        "Produit conforme", "Livraison rapide", "Tres bon rapport qualite/prix",
        "Parfait!", "Produit de qualite", "Tres content de mon achat",
        "Super produit", "Conforme a mes attentes", "Tres bon produit local",
        "Qualite au rendez-vous", "Je racheterai"
    ]
    
    comments = [
        "Tres bon produit, je suis satisfait de la qualite.",
        "Excellent rapport qualite/prix. Je recommande!",
        "Produit conforme a la description. Livraison rapide.",
        "Tres content de mon achat. Produit authentique.",
        "Bonne qualite, je recommande ce vendeur.",
        "Produit frais et de qualite. Parfait!",
        "Conforme a mes attentes. Tres satisfait.",
        "Excellent produit local. Je racheterai.",
        "Tres bonne qualite. Emballage soigne.",
        "Produit authentique du Burkina. Top!"
    ]
    
    for i in range(1, num + 1):
        product = random.choice(products)
        user = random.choice(customer_users)
        
        review = {
            "id": i,
            "productId": product["id"],
            "userId": user["id"],
            "rating": random.choices([3, 4, 5], weights=[5, 30, 65])[0],
            "title": random.choice(titles),
            "comment": random.choice(comments),
            "helpful": random.randint(0, 80),
            "verified": random.random() > 0.2,
            "createdAt": (datetime.now() - timedelta(days=random.randint(1, 90))).isoformat()
        }
        reviews.append(review)
    
    return reviews

# Générer wishlists
def generate_wishlists(users, products, num):
    wishlists = []
    customer_users = [u for u in users if u["role"] == "customer"]
    
    for i in range(1, num + 1):
        user = random.choice(customer_users)
        product = random.choice(products)
        
        wishlist = {
            "id": i,
            "userId": user["id"],
            "productId": product["id"],
            "addedAt": (datetime.now() - timedelta(days=random.randint(1, 60))).isoformat()
        }
        wishlists.append(wishlist)
    
    return wishlists

# Générer cart items
def generate_cart_items(users, products, num):
    cart_items = []
    customer_users = [u for u in users if u["role"] == "customer"]
    
    for i in range(1, num + 1):
        user = random.choice(customer_users)
        product = random.choice(products)
        
        cart_item = {
            "id": i,
            "userId": user["id"],
            "productId": product["id"],
            "quantity": random.randint(1, 5),
            "addedAt": (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat()
        }
        cart_items.append(cart_item)
    
    return cart_items

# Générer notifications
def generate_notifications(users, num=30):
    notifications = []
    
    notification_types = [
        {"type": "order_confirmed", "title": "Commande confirmee", "message": "Votre commande #{order} a ete confirmee"},
        {"type": "order_shipped", "title": "Commande expediee", "message": "Votre commande #{order} est en cours de livraison"},
        {"type": "order_delivered", "title": "Commande livree", "message": "Votre commande #{order} a ete livree avec succes"},
        {"type": "product_back_in_stock", "title": "Produit disponible", "message": "Le produit que vous suivez est de nouveau en stock"},
        {"type": "promotion", "title": "Promotion speciale", "message": "Profitez de -20% sur une selection de produits"},
        {"type": "new_review", "title": "Nouvel avis", "message": "Un client a laisse un avis sur votre produit"}
    ]
    
    for i in range(1, num + 1):
        user = random.choice(users)
        notif_template = random.choice(notification_types)
        
        notification = {
            "id": i,
            "userId": user["id"],
            "type": notif_template["type"],
            "title": notif_template["title"],
            "message": notif_template["message"].replace("{order}", f"ORD-BF-2024-{random.randint(1, 100):04d}"),
            "read": random.random() > 0.4,
            "createdAt": (datetime.now() - timedelta(hours=random.randint(1, 168))).isoformat()
        }
        notifications.append(notification)
    
    return notifications

# Calculer stats
def calculate_stats(users, vendors, products, orders):
    paid_orders = [o for o in orders if o["paymentStatus"] == "paid"]
    
    stats = {
        "totalProducts": len(products),
        "totalOrders": len(orders),
        "totalVendors": len(vendors),
        "totalUsers": len(users),
        "totalRevenue": sum(o["total"] for o in paid_orders),
        "pendingOrders": len([o for o in orders if o["status"] == "pending"]),
        "processingOrders": len([o for o in orders if o["status"] == "processing"]),
        "shippedOrders": len([o for o in orders if o["status"] == "shipped"]),
        "deliveredOrders": len([o for o in orders if o["status"] == "delivered"]),
        "cancelledOrders": len([o for o in orders if o["status"] == "cancelled"]),
        "activeProducts": len([p for p in products if p["isActive"]]),
        "featuredProducts": len([p for p in products if p["featured"]]),
        "verifiedVendors": len([v for v in vendors if v["verified"]]),
        "averageOrderValue": int(sum(o["total"] for o in orders) / len(orders)) if orders else 0,
        "lastUpdated": datetime.now().isoformat()
    }
    
    return stats

# Régions (données existantes)
regions = [
    {"id": 1, "name": "Centre", "capital": "Ouagadougou", "population": 2415266, "area": 2805, "provinces": ["Kadiogo"]},
    {"id": 2, "name": "Hauts-Bassins", "capital": "Bobo-Dioulasso", "population": 1703668, "area": 25575, "provinces": ["Houet", "Kenedougou", "Tuy"]},
    {"id": 3, "name": "Centre-Ouest", "capital": "Koudougou", "population": 1522910, "area": 21691, "provinces": ["Boulkiemde", "Sanguie", "Sissili", "Ziro"]},
    {"id": 4, "name": "Nord", "capital": "Ouahigouya", "population": 1385107, "area": 17958, "provinces": ["Loroum", "Passore", "Yatenga", "Zondoma"]},
    {"id": 5, "name": "Est", "capital": "Fada N'Gourma", "population": 1572206, "area": 46707, "provinces": ["Gnagna", "Gourma", "Komandjoari", "Kompienga", "Tapoa"]},
    {"id": 6, "name": "Sud-Ouest", "capital": "Gaoua", "population": 741197, "area": 16153, "provinces": ["Bougouriba", "Ioba", "Noumbiel", "Poni"]},
    {"id": 7, "name": "Cascades", "capital": "Banfora", "population": 716561, "area": 15415, "provinces": ["Comoe", "Leraba"]},
    {"id": 8, "name": "Sahel", "capital": "Dori", "population": 1446570, "area": 35820, "provinces": ["Oudalan", "Seno", "Soum", "Yagha"]},
    {"id": 9, "name": "Plateau-Central", "capital": "Ziniare", "population": 771606, "area": 8575, "provinces": ["Ganzourgou", "Kourweogo", "Oubritenga"]},
    {"id": 10, "name": "Centre-Nord", "capital": "Kaya", "population": 1599354, "area": 19508, "provinces": ["Bam", "Namentenga", "Sanmatenga"]}
]

# Catégories (données existantes)
categories = [
    {"id": 1, "name": "Cereales & Graines", "slug": "cereales-graines", "description": "Mil, sorgho, mais, riz local et autres cereales", "icon": "pi-sun", "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400", "productCount": 18, "order": 1, "isActive": True},
    {"id": 2, "name": "Fruits & Legumes", "slug": "fruits-legumes", "description": "Produits frais de nos maraichers", "icon": "pi-shopping-bag", "image": "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=400", "productCount": 23, "order": 2, "isActive": True},
    {"id": 3, "name": "Artisanat", "slug": "artisanat", "description": "Objets d'art et artisanat burkinabe", "icon": "pi-gift", "image": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400", "productCount": 19, "order": 3, "isActive": True},
    {"id": 4, "name": "Textile & Faso Dan Fani", "slug": "textile-faso-dan-fani", "description": "Tissus traditionnels et vetements", "icon": "pi-th-large", "image": "https://images.unsplash.com/photo-1618453292507-4959ece6429e?w=400", "productCount": 14, "order": 4, "isActive": True},
    {"id": 5, "name": "Karite & Produits Cosmetiques", "slug": "karite-cosmetiques", "description": "Beurre de karite et produits derives", "icon": "pi-heart", "image": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400", "productCount": 12, "order": 5, "isActive": True},
    {"id": 6, "name": "Epices & Condiments", "slug": "epices-condiments", "description": "Soumbala, piment, gingembre et autres epices", "icon": "pi-star", "image": "https://images.unsplash.com/photo-1596040033229-a0b4f8e27bc8?w=400", "productCount": 12, "order": 6, "isActive": True},
    {"id": 7, "name": "Volaille & Oeufs", "slug": "volaille-oeufs", "description": "Poulets bicyclette et oeufs frais", "icon": "pi-circle", "image": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400", "productCount": 7, "order": 7, "isActive": True},
    {"id": 8, "name": "Miel & Produits de la Ruche", "slug": "miel-produits-ruche", "description": "Miel naturel et produits apicoles", "icon": "pi-globe", "image": "https://images.unsplash.com/photo-1587049352846-4a222e784084?w=400", "productCount": 7, "order": 8, "isActive": True},
    {"id": 9, "name": "Boissons Traditionnelles", "slug": "boissons-traditionnelles", "description": "Dolo, bissap, gingembre et jus locaux", "icon": "pi-cup", "image": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", "productCount": 8, "order": 9, "isActive": True},
    {"id": 10, "name": "Tubercules & Racines", "slug": "tubercules-racines", "description": "Ignames, patates douces, manioc", "icon": "pi-bookmark", "image": "https://images.unsplash.com/photo-1568584711271-3c08f2095e7c?w=400", "productCount": 6, "order": 10, "isActive": True}
]

print("Generation des donnees massives...")
print("=" * 60)

# Générer toutes les données
users = generate_users(NUM_USERS)
vendors = generate_vendors(users)
products = generate_products(vendors, NUM_PRODUCTS)
orders = generate_orders(users, products, NUM_ORDERS)
reviews = generate_reviews(users, products, NUM_REVIEWS)
wishlists = generate_wishlists(users, products, NUM_WISHLISTS)
cart_items = generate_cart_items(users, products, NUM_CART_ITEMS)
notifications = generate_notifications(users)
stats = calculate_stats(users, vendors, products, orders)

# Créer le fichier db.json
db = {
    "users": users,
    "regions": regions,
    "categories": categories,
    "vendors": vendors,
    "products": products,
    "orders": orders,
    "cart": cart_items,
    "reviews": reviews,
    "wishlist": wishlists,
    "notifications": notifications,
    "stats": stats
}

# Sauvegarder
with open('db.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("\nBase de donnees MASSIVE creee avec succes!")
print("=" * 60)
print(f"Utilisateurs:     {len(users)} ({len([u for u in users if u['role']=='customer'])} clients, {len([u for u in users if u['role']=='vendor'])} vendeurs, {len([u for u in users if u['role']=='admin'])} admin)")
print(f"Vendeurs:         {len(vendors)}")
print(f"Produits:         {len(products)}")
print(f"Commandes:        {len(orders)}")
print(f"Avis:             {len(reviews)}")
print(f"Wishlists:        {len(wishlists)}")
print(f"Panier:           {len(cart_items)}")
print(f"Notifications:    {len(notifications)}")
print(f"Revenu total:     {stats['totalRevenue']:,} FCFA")
print(f"Panier moyen:     {stats['averageOrderValue']:,} FCFA")
print("=" * 60)
print("\nL'application est maintenant COMPLETEMENT alimentee!")
