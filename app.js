/* ============================================================
   MARSCART — UI Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    /* ============================================================
       1. NAVBAR — scroll shadow
    ============================================================ */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    /* ============================================================
       2. MOBILE HAMBURGER
    ============================================================ */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger?.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        const isOpen = mobileMenu.classList.contains('open');
        spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
        spans[1].style.opacity = isOpen ? '0' : '';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });

    /* ============================================================
       3. ROLE TABS (Legacy toggles kept for UI forms if needed)
    ============================================================ */
    document.querySelectorAll('.role-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const role = tab.dataset.role;
            // Tell 3d-scene to swap out models based on role tab click
            if(window.marsCart3D) {
              window.marsCart3D.loadRoleModel(role);
            }
            
            document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.role-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.querySelector(".role-panel[data-role='"+role+"']");
            if (panel) panel.classList.add('active');
        });
    });

    console.log('%cMarsCart Platform', 'font-size:24px;font-weight:900;color:#D0E84D;background:#0a0a0a;padding:8px 16px;border-radius:6px;');
    console.log('%cPOS • Billing • Inventory • Ecommerce', 'color:#888;font-size:12px;');
});
