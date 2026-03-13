
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth <= 768;

    /* --- BASIC REVEAL (Safe for Desktop visibility) --- */
    // Instead of hiding them, we just gently animate them in
    gsap.utils.toArray('.section-title, .section-sub, .reveal').forEach(el => {
        gsap.fromTo(el, { opacity: 0.5, y: 20 }, {
            opacity: 1, y: 0, duration: 1,
            scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none none' }
        });
    });

    /* --- DESKTOP ROLES SCROLL --- */
    if (!isMobile) {
        const rc = document.querySelector('#rolesScrollContainer');
        const rg = document.querySelector('#rolesGallery');
        if (rc && rg) {
            gsap.to(rg, {
                x: () => -(rg.scrollWidth - window.innerWidth + 100),
                ease: "none",
                scrollTrigger: {
                    trigger: rc,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => "+=" + (rg.scrollWidth),
                    invalidateOnRefresh: true,
                }
            });
        }
    }

    /* --- MOBILE MENU --- */
    const ham = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (ham && menu) {
        ham.onclick = () => menu.classList.toggle('open');
        menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));
    }
});
