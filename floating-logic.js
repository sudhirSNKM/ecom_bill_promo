// Logic for UI floating cards & cart drawer
document.addEventListener('DOMContentLoaded', () => {
    // 1. Configurator Logic
    const configBtns = document.querySelectorAll('.config-btn');
    configBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            configBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // This would normally change a texture or material in Three.js
            // Because we're using Procedural geometry right now, we can alter the color as a demo
            if(window.marsCart3D && window.marsCart3D.activeModel) {
                const matType = btn.getAttribute('data-mat');
                const mat = window.marsCart3D.activeModel.material;
                if(mat) {
                    if (matType === 'default') mat.color.setHex(0xffffff); // Oak
                    if (matType === 'walnut') mat.color.setHex(0x5c4033);  // Walnut
                    if (matType === 'fabric') mat.color.setHex(0xd0d0d0);  // Linen
                }
            }
        });
    });

    // 2. Cart Drawer Logic
    const cartDrawer = document.getElementById('cart-drawer');
    const openBtns = document.querySelectorAll('.open-cart-btn');
    const closeBtn = document.querySelector('.close-drawer');

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => cartDrawer.classList.add('open'));
    });
    closeBtn?.addEventListener('click', () => cartDrawer.classList.remove('open'));

    // 3. GSAP trigger for the floating card in the E-commerce section
    if (typeof gsap !== 'undefined') {
        gsap.to('#floating-buy', {
            scrollTrigger: {
                trigger: '#tech', // We used the id #tech for the E-com section
                start: 'top center',
                end: 'bottom center',
                toggleActions: 'play reverse play reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        });
    }
});
