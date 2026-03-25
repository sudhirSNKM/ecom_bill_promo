/* ============================================================
   MarsCart — UI Logic (No Animations — Handled by animations.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. NAVBAR hamburger ─────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('active');
        });
        mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('active');
        }));
    }

    /* ── 2. Active nav link highlight on scroll ──────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const toIntersect = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            navLinks.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
            });
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => toIntersect.observe(s));

    /* ── 3. Pricing toggle (Annual / Monthly) ────────────── */
    const pricingToggle = document.getElementById('pricing-toggle');
    if (pricingToggle) {
        pricingToggle.addEventListener('change', () => {
            const isAnnual = pricingToggle.checked;
            document.querySelectorAll('.price-amount').forEach(el => {
                const monthly = el.dataset.monthly;
                const annual = el.dataset.annual;
                if (monthly && annual) el.textContent = isAnnual ? annual : monthly;
            });
        });
    }

    /* ── 4. Accordion / FAQ ──────────────────────────────── */
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    /* ── 5. Smooth anchor scroll (fallback if Lenis is loaded) ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

});
