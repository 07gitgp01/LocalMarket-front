import json
import random

# URLs d'images valides et testées (Unsplash avec IDs complets)
CATEGORY_IMAGES = {
    "Cereales & Graines": [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
        "https://images.unsplash.com/photo-1595855759920-86582396756a?w=800&q=80",
        "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80",
    ],
    "Fruits & Legumes": [
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
        "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&q=80",
        "https://images.unsplash.com/photo-1587049352846-4a222e784084?w=800&q=80",
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80",
    ],
    "Artisanat": [
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80",
        "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80",
    ],
    "Textile & Faso Dan Fani": [
        "https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=800&q=80",
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    ],
    "Karite & Produits Cosmetiques": [
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80",
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80",
    ],
    "Epices & Condiments": [
        "https://images.unsplash.com/photo-1596040033229-a0b3b1b1e2a0?w=800&q=80",
        "https://images.unsplash.com/photo-1599909533730-f9d7e4d3a3e3?w=800&q=80",
        "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&q=80",
    ],
    "Volaille & Oeufs": [
        "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80",
        "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=800&q=80",
        "https://images.unsplash.com/photo-1569288063643-5d29ad64df09?w=800&q=80",
    ],
    "Miel & Produits de la Ruche": [
        "https://images.unsplash.com/photo-1587049352846-4a222e784084?w=800&q=80",
        "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
        "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&q=80",
    ],
    "Boissons Traditionnelles": [
        "https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80",
        "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
        "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80",
    ],
    "Tubercules & Racines": [
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
        "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80",
        "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800&q=80",
    ]
}

# Image par défaut
DEFAULT_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"

def fix_product_images():
    # Lire le fichier db.json
    with open('db.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Fixer les images des produits
    for product in data.get('products', []):
        category = product.get('category', '')
        
        # Obtenir les images pour cette catégorie
        category_imgs = CATEGORY_IMAGES.get(category, [DEFAULT_IMAGE])
        
        # Assigner 2 images aléatoires de la catégorie
        if len(category_imgs) >= 2:
            product['images'] = random.sample(category_imgs, 2)
        else:
            product['images'] = [category_imgs[0], category_imgs[0]]
    
    # Sauvegarder
    with open('db.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Images corrigees pour {len(data.get('products', []))} produits")
    print("\nCategories traitees:")
    categories = set(p.get('category') for p in data.get('products', []))
    for cat in sorted(categories):
        count = len([p for p in data.get('products', []) if p.get('category') == cat])
        img_count = len(CATEGORY_IMAGES.get(cat, []))
        print(f"  - {cat}: {count} produits ({img_count} images disponibles)")

if __name__ == "__main__":
    fix_product_images()
