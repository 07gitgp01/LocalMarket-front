const path = require('path');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const PORT = process.env.PORT || 3000;

// Ajouter un delay pour simuler un réseau réel
server.use((req, res, next) => {
    setTimeout(next, 1000);
});

// Apply middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.use(jsonServer.bodyParser);

// Route de santé
server.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'LocalMarket API is running'
    });
});

// Route de recherche de produits
server.get('/api/products/search', (req, res) => {
    const { q, category, minPrice, maxPrice, vendorId, featured, _sort, _order } = req.query;
    let products = router.db.get('products').value();
    const vendors = router.db.get('vendors').value();

    if (q) {
        const query = q.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            (p.tags || []).some(tag => tag.toLowerCase().includes(query))
        );
    }

    if (category) {
        products = products.filter(p => p.category === category);
    }

    if (minPrice) {
        products = products.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
        products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (vendorId) {
        products = products.filter(p => p.vendorId === parseInt(vendorId));
    }

    if (featured === 'true') {
        products = products.filter(p => p.featured === true);
    }

    // Tri
    if (_sort) {
        const order = _order === 'desc' ? -1 : 1;
        products = [...products].sort((a, b) => {
            if (a[_sort] < b[_sort]) return -1 * order;
            if (a[_sort] > b[_sort]) return 1 * order;
            return 0;
        });
    }

    // Joindre les données vendeur (équivalent de _expand=vendor)
    products = products.map(p => ({
        ...p,
        vendor: vendors.find(v => v.id === p.vendorId) || null
    }));

    res.json(products);
});

// Route de statistiques
server.get('/api/stats', (req, res) => {
    const products = router.db.get('products').value();
    const orders = router.db.get('orders').value();
    const vendors = router.db.get('vendors').value();
    const users = router.db.get('users').value();

    const stats = {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalVendors: vendors.length,
        totalUsers: users.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: orders.filter(o => o.status === 'processing' || o.status === 'pending').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        activeProducts: products.filter(p => p.isActive).length,
        featuredProducts: products.filter(p => p.featured).length,
    };

    res.json(stats);
});

// Route de login simple (pour développement)
server.post('/api/auth/login', (req, res) => {
    try {
        const body = req.body || {};
        const { email, password } = body;

        if (!email) {
            return res.status(400).json({ error: 'Email requis' });
        }

        const users = router.db.get('users').value() || [];
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur introuvable' });
        }

        const token = Buffer.from(JSON.stringify({
            userId: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + 86400000
        })).toString('base64');

        res.json({
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                role: user.role || 'customer',
                phone: user.phone || '',
                avatar: user.avatar || null
            }
        });
    } catch (err) {
        console.error('[LOGIN ERROR]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Route d'inscription simple
server.post('/api/auth/register', (req, res) => {
    const { email, password, firstName, lastName, phone, role = 'customer' } = req.body;
    const users = router.db.get('users').value();

    // Vérifier si l'utilisateur existe déjà
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already  exists' });
    }

    const newUser = {
        id: users.length + 1,
        email,
        password: '$2a$10$JGhkFLEWK1OfzJ.JQzBfHOqT.aUL93vQ4T8v6.CdHxXQ81K5M5v72', // Hash factice
        firstName,
        lastName,
        role,
        phone,
        address: {
            street: '',
            city: '',
            region: '',
            postalCode: ''
        },
        status: 'active',
        createdAt: new Date().toISOString()
    };

    router.db.get('users').push(newUser).write();

    const token = Buffer.from(JSON.stringify({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        exp: Date.now() + 86400000
    })).toString('base64');

    res.status(201).json({
        accessToken: token,
        user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
            phone: newUser.phone
        }
    });
});

// Utiliser le router par défaut
// Ajouter le préfixe /api à toutes les routes
server.use('/api', router);

// Démarrer le serveur
server.listen(PORT, () => {
    console.log('');
    console.log('🚀 =============================================');
    console.log('   LocalMarket Mock API Server is running!');
    console.log('   =============================================');
    console.log('');
    console.log(`   📍 API URL: http://localhost:${PORT}/api`);
    console.log('');
    console.log('   📚 Available endpoints:');
    console.log('   ├─ GET    /api/health');
    console.log('   ├─ GET    /api/products/search');
    console.log('   ├─ GET    /api/stats');
    console.log('   ├─ POST   /api/auth/login');
    console.log('   ├─ POST   /api/auth/register');
    console.log('   ├─ GET    /api/users');
    console.log('   ├─ GET    /api/products');
    console.log('   ├─ GET    /api/categories');
    console.log('   ├─ GET    /api/vendors');
    console.log('   ├─ GET    /api/orders');
    console.log('   ├─ GET    /api/regions');
    console.log('   ├─ GET    /api/cart');
    console.log('   └─ GET    /api/reviews');
    console.log('');
    console.log('   ⏱️  Response delay: 1000ms');
    console.log('   🔄 Watch mode: enabled');
    console.log('');
    console.log('   ✅ Ready to accept requests!');
    console.log('');
});
