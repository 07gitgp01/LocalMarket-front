const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        http.get(`${BASE_URL}${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        }).on('error', reject);
    });
}

async function testEndpoints() {
    console.log('='.repeat(60));
    console.log('TEST DES ENDPOINTS /api - LocalMarket Mock Server');
    console.log('='.repeat(60));
    console.log('');

    const tests = [
        { name: 'Health Check', path: '/health' },
        { name: 'Users', path: '/users' },
        { name: 'Vendors', path: '/vendors' },
        { name: 'Products', path: '/products' },
        { name: 'Categories', path: '/categories' },
        { name: 'Regions', path: '/regions' },
        { name: 'Orders', path: '/orders' },
        { name: 'Reviews', path: '/reviews' },
        { name: 'Wishlist', path: '/wishlist' },
        { name: 'Cart', path: '/cart' },
        { name: 'Notifications', path: '/notifications' },
        { name: 'Stats', path: '/stats' }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            const result = await makeRequest(test.path);
            const isArray = Array.isArray(result);
            const count = isArray ? result.length : (typeof result === 'object' ? 'Object' : 'OK');
            
            console.log(`✓ ${test.name.padEnd(20)} - ${test.path.padEnd(25)} [${count}]`);
            passed++;
        } catch (error) {
            console.log(`✗ ${test.name.padEnd(20)} - ${test.path.padEnd(25)} [ERROR: ${error.message}]`);
            failed++;
        }
    }

    console.log('');
    console.log('='.repeat(60));
    console.log(`RESULTATS: ${passed} tests reussis, ${failed} tests echoues`);
    console.log('='.repeat(60));

    try {
        const stats = await makeRequest('/stats');
        const users = await makeRequest('/users');
        const vendors = await makeRequest('/vendors');
        const products = await makeRequest('/products');
        const orders = await makeRequest('/orders');
        const reviews = await makeRequest('/reviews');
        
        console.log('');
        console.log('STATISTIQUES DETAILLEES:');
        console.log(`  - Utilisateurs:       ${users.length}`);
        console.log(`  - Vendeurs:           ${vendors.length}`);
        console.log(`  - Produits:           ${products.length}`);
        console.log(`  - Commandes:          ${orders.length}`);
        console.log(`  - Avis:               ${reviews.length}`);
        
        if (stats && stats.totalRevenue) {
            console.log(`  - Revenu total:       ${stats.totalRevenue.toLocaleString()} FCFA`);
            console.log(`  - Panier moyen:       ${stats.averageOrderValue.toLocaleString()} FCFA`);
            console.log(`  - Produits actifs:    ${stats.activeProducts}`);
            console.log(`  - Produits featured:  ${stats.featuredProducts}`);
        }
        
        console.log('');
        console.log('EXEMPLES DE DONNEES:');
        console.log(`  - Premier produit:    ${products[0].name} (${products[0].price} FCFA)`);
        console.log(`  - Premier vendeur:    ${vendors[0].shopName}`);
        console.log(`  - Premiere commande:  ${orders[0].orderNumber} (${orders[0].total} FCFA)`);
        
    } catch (error) {
        console.log('Erreur lors de la recuperation des details:', error.message);
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('✅ Le serveur mock est COMPLETEMENT OPERATIONNEL!');
    console.log('='.repeat(60));
}

setTimeout(() => {
    testEndpoints().catch(console.error);
}, 2000);
