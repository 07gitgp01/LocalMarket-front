export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    apiTimeout: 30000,
    appName: 'LocalMarket',
    appVersion: '1.0.0',

    // Feature Flags
    enablePWA: true,
    enableI18n: true,
    enableAnalytics: false,
    enableChatSupport: true,

    // Payment Configuration (Senegal)
    payment: {
        orangeMoney: {
            enabled: true,
            apiKey: '',
            merchantId: ''
        },
        wave: {
            enabled: true,
            apiKey: '',
            merchantId: ''
        }
    },

    // Maps Configuration
    googleMapsApiKey: '',

    // Upload Configuration
    upload: {
        maxFileSize: 5242880, // 5MB
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp']
    },

    // Pagination
    pagination: {
        defaultPageSize: 12,
        pageSizeOptions: [12, 24, 36, 48]
    },

    // Social Media
    social: {
        facebook: 'https://facebook.com/localmarket',
        twitter: 'https://twitter.com/localmarket',
        instagram: 'https://instagram.com/localmarket',
        whatsapp: '+221770000000'
    }
};
