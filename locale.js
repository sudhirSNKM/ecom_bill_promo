const translations = {
    en: {
        s1Title: "Book a Demo",
        s1Sub: "Experience the future of retail infrastructure.",
        s1Cta: "Begin Tour ↓",

        s2Title: "Our Features",
        s2Sub: "Point of Sale, Billing, and Ecommerce all in one unified ecosystem.",
        // Admin Override
        s2TitleAdmin: "Stock Levels",
        s2SubAdmin: "Real-time inventory monitoring across all warehouses.",

        s3Title: "Pricing Strategy",
        s3Sub: "Simple, predictable billing that scales with your business.",

        s4Title: "Global Branches",
        s4Sub: "Managing inventory across multiple locations effortlessly.",

        s5Title: "Contact Us",
        s5Sub: "Let's build something exceptional together.",
        s5Cta: "Talk to Sales"
    },
    es: {
        s1Title: "Reserva una Demostración",
        s1Sub: "Experimenta el futuro de la infraestructura minorista.",
        s1Cta: "Comenzar Recorrido ↓",

        s2Title: "Nuestras Características",
        s2Sub: "Punto de Venta, Facturación y Comercio Electrónico unidos en un solo ecosistema.",
        s2TitleAdmin: "Niveles de Stock",
        s2SubAdmin: "Monitoreo de inventario en tiempo real en todos los almacenes.",

        s3Title: "Estrategia de Precios",
        s3Sub: "Facturación simple y predecible que escala con tu negocio.",

        s4Title: "Sucursales Globales",
        s4Sub: "Gestionando el inventario en múltiples ubicaciones sin esfuerzo.",

        s5Title: "Contáctanos",
        s5Sub: "Construyamos algo excepcional juntos.",
        s5Cta: "Hablar con Ventas"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Get primary browser language (e.g. 'en-US' -> 'en')
    const userLang = navigator.language.split('-')[0];
    const t = translations[userLang] || translations.en;

    // Simulated Role Logic (replace with actual auth context in production)
    // For demonstration, you could change this to 'admin' to see "Stock Levels" on wall 2
    const userRole = 'customer';

    if (userRole === 'admin') {
        // Override the section 2 language dictionary to Admin specific keys
        t.s2Title = t.s2TitleAdmin;
        t.s2Sub = t.s2SubAdmin;

        // Also change the bullet points physically if admin
        const featuresList = document.getElementById('feature-list');
        if (featuresList) {
            featuresList.innerHTML = `
        <li>Warehouse A: High</li>
        <li>Warehouse B: Critical Low</li>
        <li>In-Transit: 450 units</li>
      `;
        }
    }

    // Apply translations to DOM elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerHTML = t[key];
        }
    });
});
