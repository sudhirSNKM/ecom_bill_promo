/* ============================================================
   MarsCart — Stryds-style Animation System
   Lenis smooth scroll + GSAP ScrollTrigger
   Targets ACTUAL class names used in index.html
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ── GUARD ───────────────────────────────────────────────── */
    if (typeof gsap === 'undefined') { console.warn('[MarsCart] GSAP not loaded.'); return; }
    gsap.registerPlugin(ScrollTrigger);

    /* ── 1. LENIS SMOOTH SCROLL ─────────────────────────────── */
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: 0.08,
            smooth: true,
            smoothTouch: false,
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    /* ── 2. NAVBAR scroll glass tighten ─────────────────────── */
    ScrollTrigger.create({
        start: 'top -60',
        onEnter: () => document.getElementById('navbar')?.classList.add('scrolled'),
        onLeaveBack: () => document.getElementById('navbar')?.classList.remove('scrolled'),
    });

    /* ── 3. HERO entrance — text slides 120px up ─────────────── */
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .from('.hero-badge', { y: 20, opacity: 0, duration: 0.7 }, 0.1)
        .from('.hero-headline', { y: 120, opacity: 0, duration: 1.2 }, 0.25)
        .from('.hero-sub', { y: 60, opacity: 0, duration: 1.0 }, 0.45)
        .from('.hero-actions', { y: 40, opacity: 0, duration: 0.9 }, 0.60)
        .from('.hero-stats', { y: 30, opacity: 0, duration: 0.8 }, 0.75)
        .from('.hero-visual', { y: 80, opacity: 0, duration: 1.3, ease: 'power2.out' }, 0.30);

    /* ── 4. DASHBOARD PARALLAX scrub ─────────────────────────── */
    if (document.querySelector('.dashboard-frame')) {
        gsap.to('.dashboard-frame', {
            y: -100, ease: 'none',
            scrollTrigger: { trigger: '.hero', scrub: 1.5, start: 'top top', end: 'bottom top' }
        });
    }

    /* ── 5. SECTION FADE-IN ──────────────────────────────────── */
    gsap.utils.toArray('.section').forEach((sec) => {
        gsap.from(sec, {
            opacity: 0, y: 60, duration: 1.0, ease: 'power2.out',
            scrollTrigger: { trigger: sec, start: 'top 87%', toggleActions: 'play none none none' }
        });
    });

    /* ── 6. SECTION TITLE / LABEL reveals ───────────────────── */
    gsap.utils.toArray('.section-label').forEach(el =>
        gsap.from(el, {
            y: 28, opacity: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        })
    );
    gsap.utils.toArray('.section-title').forEach(el =>
        gsap.from(el, {
            y: 50, opacity: 0, duration: 0.9, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        })
    );
    gsap.utils.toArray('.section-sub').forEach(el =>
        gsap.from(el, {
            y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        })
    );

    /* ── 7. PLATFORM module-cards stagger ───────────────────── */
    if (document.querySelector('.module-card')) {
        gsap.from('.module-card', {
            y: 70, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '.modules-grid', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 8. BENTO (features) stagger ────────────────────────── */
    if (document.querySelector('.bento-card')) {
        gsap.from('.bento-card', {
            y: 80, opacity: 0, duration: 1.0, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '.features-bento', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 9. ANALYTICS METRICS stagger ───────────────────────── */
    if (document.querySelector('.analytics-metric')) {
        gsap.from('.analytics-metric', {
            y: 50, opacity: 0, duration: 0.75, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.analytics-sidebar', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }
    if (document.querySelector('.chart-card')) {
        gsap.from('.chart-card', {
            y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.analytics-main', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 10. TECH CARDS stagger ─────────────────────────────── */
    if (document.querySelector('.tech-card')) {
        gsap.from('.tech-card', {
            y: 60, opacity: 0, duration: 0.85, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '#tech', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 11. REVIEW CARDS stagger ───────────────────────────── */
    if (document.querySelector('.review-card')) {
        gsap.from('.review-card', {
            y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '.reviews-grid', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 12. BLOG CARDS stagger ─────────────────────────────── */
    if (document.querySelector('.blog-card')) {
        gsap.from('.blog-card', {
            y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '.blog-grid', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 13. LOGO STRIP ─────────────────────────────────────── */
    if (document.querySelector('.logo-item')) {
        gsap.from('.logo-item', {
            y: 20, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out',
            scrollTrigger: { trigger: '.logos-section', start: 'top 92%', toggleActions: 'play none none none' }
        });
    }

    /* ── 14. CTA section big headline ───────────────────────── */
    if (document.querySelector('.cta-headline')) {
        gsap.from('.cta-headline', {
            y: 80, opacity: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: '#cta', start: 'top 85%', toggleActions: 'play none none none' }
        });
        gsap.from('.cta-sub', {
            y: 40, opacity: 0, duration: 1.0, ease: 'power2.out', delay: 0.2,
            scrollTrigger: { trigger: '#cta', start: 'top 85%', toggleActions: 'play none none none' }
        });
        gsap.from('.cta-actions', {
            y: 30, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.4,
            scrollTrigger: { trigger: '#cta', start: 'top 85%', toggleActions: 'play none none none' }
        });
    }

    /* ── 15. SECURITY GRID ──────────────────────────────────── */
    if (document.querySelector('.security-row')) {
        gsap.from('.security-row', {
            y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '.security-grid', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 16. JOURNEY STEPS stagger ──────────────────────────── */
    if (document.querySelector('.journey-step')) {
        gsap.from('.journey-step', {
            y: 60, opacity: 0, duration: 0.85, stagger: 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: '.journey-flow', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 17. ROLES TAB panel slide-in ───────────────────────── */
    if (document.querySelector('.role-panel.active')) {
        gsap.from('.role-panel.active', {
            y: 40, opacity: 0, duration: 1.0, ease: 'power2.out',
            scrollTrigger: { trigger: '#roles', start: 'top 80%', toggleActions: 'play none none none' }
        });
    }

    /* ── 18. FOOTER fade ────────────────────────────────────── */
    if (document.querySelector('.footer')) {
        gsap.from('.footer', {
            opacity: 0, y: 30, duration: 0.9, ease: 'power2.out',
            scrollTrigger: { trigger: '.footer', start: 'top 95%', toggleActions: 'play none none none' }
        });
    }

});
