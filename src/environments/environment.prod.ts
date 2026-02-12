export const environment = {
    production: true,
    apiUrl: 'https://api.localmarket.sn',
    apiTimeout: 30000,
    appName: 'LocalMarket',
    appVersion: '1.0.0',

    // Feature Flags
    enablePWA: true,
    enableI18n: true,
    enableAnalytics: true,
    enableChatSupport: true,

    // Payment Configuration (Senegal)
    payment: {
        orangeMoney: {
            enabled: true,
            apiKey: process.env['ORANGE_MONEY_API_KEY'] || '',
            merchantId: process.env['ORANGE_MONEY_MERCHANT_ID'] || ''
        },
        wave: {
            enabled: true,
            apiKey: process.env['WAVE_API_KEY'] || '',
            merchantId: process.env['WAVE_MERCHANT_ID'] || ''
        }
    },

    // Maps Configuration
    googleMapsApiKey: process.env['GOOGLE_MAPS_API_KEY'] || '',

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
