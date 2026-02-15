const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Fonction pour faire une requête HTTP
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

// Tests des endpoints
async function testEndpoints() {
    console.log('='.repeat(60));
    console.log('TEST DES ENDPOINTS API - LocalMarket Mock Server');
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
        { name: 'Stats', path: '/stats' },
        { name: 'Single Product', path: '/products/1' },
        { name: 'Single Vendor', path: '/vendors/1' },
        { name: 'Single Order', path: '/orders/1' }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            const result = await makeRequest(test.path);
            const isArray = Array.isArray(result);
            const count = isArray ? result.length : (result ? 'OK' : 'Empty');
            
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

    // Afficher quelques statistiques détaillées
    try {
        const stats = await makeRequest('/stats');
        console.log('');
        console.log('STATISTIQUES GLOBALES:');
        console.log(`  - Utilisateurs:     ${stats.totalUsers}`);
        console.log(`  - Vendeurs:         ${stats.totalVendors}`);
        console.log(`  - Produits:         ${stats.totalProducts}`);
        console.log(`  - Commandes:        ${stats.totalOrders}`);
        console.log(`  - Revenu total:     ${stats.totalRevenue.toLocaleString()} FCFA`);
        console.log(`  - Panier moyen:     ${stats.averageOrderValue.toLocaleString()} FCFA`);
        console.log(`  - Produits actifs:  ${stats.activeProducts}`);
        console.log(`  - Vendeurs verifies: ${stats.verifiedVendors}`);
    } catch (error) {
        console.log('Erreur lors de la recuperation des stats:', error.message);
    }

    console.log('');
    console.log('='.repeat(60));
}

// Attendre que le serveur soit prêt
setTimeout(() => {
    testEndpoints().catch(console.error);
}, 2000);
