// Script pour générer des données complètes pour db.json
// Usage: node generate-db.js > db.json

const fs = require('fs');
const path = require('path');

// Lire le fichier actuel
const currentDb = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));

// Ajouter les produits manquants (10 produits minimum par catégorie)
const products = [
    // Céréales & Graines
    { id: 1, vendorId: 1, name: "Mil Local", slug: "mil-local", description: "Mil rouge de qualité supérieure cultivé localement", category: "Céréales & Graines", subCategory: "Céréales", price: 500, compareAtPrice: 600, unit: "kg", images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800"], stock: 500, minOrder: 1, maxOrder: 100, rating: 4.8, reviewCount: 45, featured: true, tags: ["bio", "local"], attributes: { origin: "Ouahigouya", certification: "Bio" }, isActive: true, createdAt: "2024-01-20T00:00:00.000Z" },
    { id: 2, vendorId: 1, name: "Sorgho Rouge", slug: "sorgho-rouge", description: "Sorgho rouge du Sahel pour plats traditionnels", category: "Céréales & Graines", subCategory: "Céréales", price: 450, compareAtPrice: null, unit: "kg", images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800"], stock: 300, minOrder: 1, maxOrder: 80, rating: 4.7, reviewCount: 32, featured: false, tags: ["local"], attributes: { origin: "Kaya" }, isActive: true, createdAt: "2024-01-22T00:00:00.000Z" },
    { id: 3, vendorId: 1, name: "Maïs Blanc", slug: "mais-blanc", description: "Maïs blanc frais pour préparation de tô", category: "Céréales & Graines", subCategory: "Céréales", price: 400, compareAtPrice: 500, unit: "kg", images: ["https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800"], stock: 450, minOrder: 1, maxOrder: 100, rating: 4.6, reviewCount: 28, featured: true, tags: ["local", "frais"], attributes: { origin: "Bobo-Dioulasso" }, isActive: true, createdAt: "2024-01-25T00:00:00.000Z" },

    // Fruits &  Légumes  
    { id: 4, vendorId: 5, name: "Mangues Amélie", slug: "mangues-amelie", description: "Mangues Amélie juteuses et sucrées", category: "Fruits & Légumes", subCategory: "Fruits", price: 1000, compareAtPrice: 1200, unit: "kg", images: ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=800"], stock: 200, minOrder: 1, maxOrder: 50, rating: 4.9, reviewCount: 89, featured: true, tags: ["frais", "saison"], attributes: { origin: "Banfora" }, isActive: true, createdAt: "2024-02-01T00:00:00.000Z" },
    { id: 5, vendorId: 5, name: "Tomates Fraîches", slug: "tomates-fraiches", description: "Tomates fraîches du maraîchage local", category: "Fruits & Légumes", subCategory: "Légumes", price: 600, compareAtPrice: null, unit: "kg", images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800"], stock: 150, minOrder: 1, maxOrder: 30, rating: 4.5, reviewCount: 56, featured: false, tags: ["frais", "local"], attributes: { origin: "Ouagadougou" }, isActive: true, createdAt: "2024-02-05T00:00:00.000Z" },

    // Artisanat
    { id: 6, vendorId: 2, name: "Masque Bobo", slug: "masque-bobo", description: "Masque traditionnel sculpté à la main", category: "Artisanat", subCategory: "Art", price: 15000, compareAtPrice: 18000, unit: "pièce", images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800"], stock: 25, minOrder: 1, maxOrder: 5, rating: 4.9, reviewCount: 67, featured: true, tags: ["artisanat", "fait-main"], attributes: { material: "Bois d'ébène", artisan: "Coopérative Bobo" }, isActive: true, createdAt: "2024-02-10T00:00:00.000Z" },
    { id: 7, vendorId: 2, name: "Panier Tressé", slug: "panier-tresse", description: "Panier en paille tressée artisanal", category: "Artisanat", subCategory: "Décoration", price: 5000, compareAtPrice: 6000, unit: "pièce", images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"], stock: 40, minOrder: 1, maxOrder: 10, rating: 4.7, reviewCount: 34, featured: false, tags: ["artisanat", "déco"], attributes: { dimensions: "40x30cm" }, isActive: true, createdAt: "2024-02-12T00:00:00.000Z" },

    // Textile & Faso Dan Fani
    { id: 8, vendorId: 4, name: "Tissu Faso Dan Fani Premium", slug: "faso-dan-fani-premium", description: "Tissu traditionnel tissé main motifs géométriques", category: "Textile & Faso Dan Fani", subCategory: "Tissus", price: 25000, compareAtPrice: 30000, unit: "pièce (6 yards)", images: ["https://images.unsplash.com/photo-1618453292507-4959ece6429e?w=800"], stock: 30, minOrder: 1, maxOrder: 5, rating: 4.8, reviewCount: 92, featured: true, tags: ["traditionnel", "fait-main"], attributes: { couleurs: "Rouge, Vert, Noir" }, isActive: true, createdAt: "2024-02-15T00:00:00.000Z" },

    // Karité & Cosmétiques
    { id: 9, vendorId: 3, name: "Beurre de Karité Bio 500g", slug: "beurre-karite-bio-500g", description: "Beurre de karité 100% naturel certifié bio", category: "Karité & Produits Cosmétiques", subCategory: "Soins Corps", price: 3500, compareAtPrice: 4000, unit: "pot 500g", images: ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800"], stock: 100, minOrder: 1, maxOrder: 20, rating: 4.9, reviewCount: 156, featured: true, tags: ["bio", "naturel"], attributes: { certification: "Ecocert", origine: "Koudougou" }, isActive: true, createdAt: "2024-02-20T00:00:00.000Z" },
    { id: 10, vendorId: 3, name: "Savon au Karité", slug: "savon-karite", description: "Savon artisanal au beurre de karité", category: "Karité & Produits Cosmétiques", subCategory: "Soins Corps", price: 1500, compareAtPrice: null, unit: "pièce", images: ["https://images.unsplash.com/photo-1600857544200-e3b00f884d87?w=800"], stock: 200, minOrder: 1, maxOrder: 30, rating: 4.6, reviewCount: 78, featured: false, tags: ["naturel", "artisanal"], attributes: { poids: "150g" }, isActive: true, createdAt: "2024-02-22T00:00:00.000Z" }
];

// Ajouter les commandes
const orders = [
    {
        id: 1,
        userId: 4,
        orderNumber: "ORD-BF-2024-001",
        status: "delivered",
        items: [
            { productId: 1, name: "Mil Local", quantity: 10, price: 500, total: 5000, vendorId: 1 },
            { productId: 4, name: "Mangues Amélie", quantity: 5, price: 1000, total: 5000, vendorId: 5 }
        ],
        subtotal: 10000,
        shippingCost: 1500,
        tax: 0,
        discount: 0,
        total: 11500,
        paymentMethod: "orange_money",
        paymentStatus: "paid",
        shippingAddress: {
            firstName: "Aminata",
            lastName: "Kaboré",
            phone: "+226 73 45 67 89",
            street: "Secteur 15",
            city: "Ouagadougou",
            region: "Centre",
            postalCode: "01 BP 4567"
        },
        deliveryDate: "2024-06-18T14:30:00.000Z",
        createdAt: "2024-06-15T10:00:00.000Z",
        updatedAt: "2024-06-18T14:30:00.000Z"
    },
    {
        id: 2,
        userId: 5,
        orderNumber: "ORD-BF-2024-002",
        status: "processing",
        items: [
            { productId: 6, name: "Masque Bobo", quantity: 1, price: 15000, total: 15000, vendorId: 2 },
            { productId: 9, name: "Beurre de Karité Bio 500g", quantity: 3, price: 3500, total: 10500, vendorId: 3 }
        ],
        subtotal: 25500,
        shippingCost: 2000,
        tax: 0,
        discount: 1500,
        total: 26000,
        paymentMethod: "wave",
        paymentStatus: "paid",
        shippingAddress: {
            firstName: "Boureima",
            lastName: "Traoré",
            phone: "+226 74 56 78 90",
            street: "Avenue de l'Indépendance",
            city: "Bobo-Dioulasso",
            region: "Hauts-Bassins",
            postalCode: "01 BP 5678"
        },
        estimatedDeliveryDate: "2024-06-25T00:00:00.000Z",
        createdAt: "2024-06-20T15:00:00.000Z",
        updatedAt: "2024-06-20T15:30:00.000Z"
    }
];

// Ajouter le panier
const cart = [
    { id: 1, userId: 4, productId: 8, quantity: 1, addedAt: "2024-06-22T10:00:00.000Z" },
    { id: 2, userId: 7, productId: 3, quantity: 10, addedAt: "2024-06-22T11:00:00.000Z" }
];

// Ajouter les avis
const reviews = [
    { id: 1, productId: 1, userId: 4, rating: 5, title: "Excellent mil !", comment: "Très bonne qualité, je recommande vivement!", helpful: 12, verified: true, createdAt: "2024-06-18T16:00:00.000Z" },
    { id: 2, productId: 4, userId: 5, rating: 5, title: "Mangues délicieuses", comment: "Juteuses et bien mûres, parfaites!", helpful: 18, verified: true, createdAt: "2024-06-19T10:00:00.000Z" },
    { id: 3, productId: 6, userId: 7, rating: 5, title: "Magnifique artisanat", comment: "Travail artisanal exceptionnel, très beau masque.", helpful: 25, verified: false, createdAt: "2024-06-20T14:00:00.000Z" },
    { id: 4, productId: 9, userId: 4, rating: 5, title: "Beurre de karité top qualité", comment: "Le meilleur beurre de karité que j'ai utilisé. Vraiment bio et efficace.", helpful: 34, verified: true, createdAt: "2024-06-21T09:00:00.000Z" }
];

// Fusionner avec la base existante
const completeDb = {
    ...currentDb,
    products,
    orders,
    cart,
    reviews,
    wishlist: []
};

// Écrire le fichier complet
fs.writeFileSync(
    path.join(__dirname, 'db.json'),
    JSON.stringify(completeDb, null, 2),
    'utf8'
);

console.log('✅ Fichier db.json généré avec succès!');
console.log(`📊 Statistiques:`);
console.log(`  - Utilisateurs: ${completeDb.users.length}`);
console.log(`  - Régions: ${completeDb.regions.length}`);
console.log(`  - Catégories: ${completeDb.categories.length}`);
console.log(`  - Vendeurs: ${completeDb.vendors.length}`);
console.log(`  - Produits: ${completeDb.products.length}`);
console.log(`  - Commandes: ${completeDb.orders.length}`);
console.log(`  - Panier: ${completeDb.cart.length}`);
console.log(`  - Avis: ${completeDb.reviews.length}`);
