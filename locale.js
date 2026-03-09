const translations = {
    en: {
        heroTag: "Now with AI-powered inventory forecasting",
        heroTitle: "The Smartest Way to Run",
        heroHighlight: "Your Retail Business",
        heroSub: "POS • Billing • Inventory • Ecommerce. Built for brands that demand excellence.",
        ctaStart: "Get Started →",
        ctaSlogan: "Plans Starting At"
    },
    es: {
        heroTag: "Ahora con pronóstico de inventario por IA",
        heroTitle: "La forma más inteligente de",
        heroHighlight: "Manejar Tu Negocio",
        heroSub: "TPV • Facturación • Inventario • Ecommerce. Creado para marcas que exigen excelencia.",
        ctaStart: "Empezar →",
        ctaSlogan: "Planes Desde"
    },
    fr: {
        heroTag: "Maintenant avec prévisions d'inventaire IA",
        heroTitle: "La façon la plus intelligente de gérer",
        heroHighlight: "Votre Commerce de Détail",
        heroSub: "PDV • Facturation • Inventaire • E-commerce. Conçu pour les marques qui exigent l'excellence.",
        ctaStart: "Commencer →",
        ctaSlogan: "Forfaits À Partir De"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Get primary browser language (e.g. 'en-US' -> 'en')
    const userLang = navigator.language.split('-')[0];
    const t = translations[userLang] || translations.en;

    // Apply translations to DOM elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerHTML = t[key];
        }
    });
});
