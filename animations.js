/* ============================================================
   MarsCart — Clean Animation System
   Standard scroll + GSAP ScrollTrigger only (no Lenis inertia)
   Stryds / Linear / Stripe feel
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ── GUARD ───────────────────────────────────────────────── */
    if (typeof gsap === 'undefined') { console.warn('[MarsCart] GSAP not loaded.'); return; }
    gsap.registerPlugin(ScrollTrigger);

    /* ── HORIZONTAL SCROLL — Roles Gallery ────────────────────
       Equivalent to framer-motion:
         const x = useTransform(scrollYProgress, [0,1], [0, -totalDistance])
       GSAP scrub does identical thing via ScrollTrigger scrub:1
    ─────────────────────────────────────────────────────────── */
    (function initRolesHScroll() {
        const container = document.getElementById('rolesScrollContainer');
        const gallery = document.getElementById('rolesGallery');
        const fill = document.getElementById('rolesProgressFill');
        if (!container || !gallery) return;

        const cards = Array.from(gallery.querySelectorAll('.role-hcard'));
        const cardW = cards[0]?.offsetWidth || 460;
        const gap = 32;
        const totalPan = (cards.length - 1) * (cardW + gap);

        // Initial state: fade all non-first cards
        gsap.set(cards, { scale: 0.93, opacity: 0.5 });
        gsap.set(cards[0], { scale: 1.0, opacity: 1 });

        gsap.to(gallery, {
            x: -totalPan,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.2,
                onUpdate: (self) => {
                    if (fill) fill.style.width = (self.progress * 100) + '%';
                    const activeIdx = Math.round(self.progress * (cards.length - 1));
                    cards.forEach((c, i) => {
                        gsap.to(c, {
                            scale: i === activeIdx ? 1.0 : 0.93,
                            opacity: i === activeIdx ? 1 : 0.5,
                            duration: 0.35,
                            overwrite: 'auto',
                            ease: 'power2.out'
                        });
                    });
                }
            }
        });
    })();

    /* ── SPRING CARD STACK — Customer Experience ───────────────
       Cards slide up from below with springy bounce on scroll enter.
       NO rotation — content must be readable.
       Each card triggers independently as it enters viewport.
    ─────────────────────────────────────────────────────────── */
    (function initCxCards() {
        const wraps = document.querySelectorAll('.cx-card-wrap');
        if (!wraps.length) return;

        wraps.forEach((wrap) => {
            const card = wrap.querySelector('.cx-card');
            const splash = wrap.querySelector('.cx-splash');

            if (!card) return;

            // Start state: below screen, invisible
            gsap.set(card, { y: 80, opacity: 0 });

            // Spring entrance: y → 0, opacity → 1
            gsap.to(card, {
                y: 0,
                opacity: 1,
                duration: 0.85,
                ease: 'back.out(1.4)',   // gentle spring — readable, no rotation
                scrollTrigger: {
                    trigger: wrap,
                    start: 'top 82%',
                    toggleActions: 'play none none reverse',
                }
            });

            // Splash glow fades in softly
            if (splash) {
                gsap.from(splash, {
                    opacity: 0,
                    scale: 0.5,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: wrap,
                        start: 'top 82%',
                        toggleActions: 'play none none reverse',
                    }
                });
            }
        });
    })();

    /* ── 1. NAVBAR — compact on scroll ──────────────────────── */
    ScrollTrigger.create({
        start: 'top -60',
        onEnter: () => document.getElementById('navbar')?.classList.add('scrolled'),
        onLeaveBack: () => document.getElementById('navbar')?.classList.remove('scrolled'),
    });

    /* ── 2. HERO ENTRANCE — crisp slides on page load ────────── */
    const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    heroTl
        .from('.hero-badge', { y: 20, opacity: 0, duration: 0.55 }, 0.1)
        .from('.hero-headline', { y: 60, opacity: 0, duration: 0.75 }, 0.2)
        .from('.hero-sub', { y: 40, opacity: 0, duration: 0.6 }, 0.38)
        .from('.hero-actions', { y: 30, opacity: 0, duration: 0.55 }, 0.50)
        .from('.hero-stats', { y: 20, opacity: 0, duration: 0.5 }, 0.62)
        .from('.hero-visual', { y: 50, opacity: 0, duration: 0.75, ease: 'power2.out' }, 0.25);

    /* ── 3. SECTION FADE + RISE — quick & snappy ────────────── */
    gsap.utils.toArray('.section').forEach((sec) => {
        gsap.from(sec, {
            opacity: 0, y: 40, duration: 0.7, ease: 'power2.out',
            scrollTrigger: {
                trigger: sec, start: 'top 88%', toggleActions: 'play none none none'
            }
        });
    });

    /* ── 4. SECTION LABELS + TITLES ─────────────────────────── */
    gsap.utils.toArray('.section-label').forEach(el =>
        gsap.from(el, {
            y: 20, opacity: 0, duration: 0.5, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        })
    );
    gsap.utils.toArray('.section-title').forEach(el =>
        gsap.from(el, {
            y: 40, opacity: 0, duration: 0.65, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        })
    );
    gsap.utils.toArray('.section-sub').forEach(el =>
        gsap.from(el, {
            y: 25, opacity: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        })
    );

    /* ── 5. MODULE CARDS — snappy stagger ───────────────────── */
    if (document.querySelector('.module-card')) {
        gsap.from('.module-card', {
            y: 50, opacity: 0, duration: 0.65, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: '.modules-grid', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    /* ── 6. BENTO CARDS — stagger grid ──────────────────────── */
    if (document.querySelector('.bento-card')) {
        gsap.from('.bento-card', {
            y: 60, opacity: 0, duration: 0.65, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: '.features-bento', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    /* ── 7. ANALYTICS ───────────────────────────────────────── */
    if (document.querySelector('.analytics-metric')) {
        gsap.from('.analytics-metric', {
            y: 35, opacity: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out',
            scrollTrigger: { trigger: '.analytics-sidebar', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }
    if (document.querySelector('.chart-card')) {
        gsap.from('.chart-card', {
            y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: '.analytics-main', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    /* ── 8. TECH CARDS ───────────────────────────────────────── */
    if (document.querySelector('.tech-card')) {
        gsap.from('.tech-card', {
            y: 45, opacity: 0, duration: 0.6, stagger: 0.09, ease: 'power2.out',
            scrollTrigger: { trigger: '#tech', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    /* ── 9. REVIEW CARDS ─────────────────────────────────────── */
    if (document.querySelector('.review-card')) {
        gsap.from('.review-card', {
            y: 45, opacity: 0, duration: 0.65, stagger: 0.07, ease: 'power2.out',
            scrollTrigger: { trigger: '.reviews-grid', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    /* ── 10. BLOG CARDS ─────────────────────────────────────── */
    if (document.querySelector('.blog-card')) {
        gsap.from('.blog-card', {
            y: 45, opacity: 0, duration: 0.65, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: '.blog-grid', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    /* ── 11. JOURNEY STEPS ───────────────────────────────────── */
    if (document.querySelector('.journey-step')) {
        gsap.from('.journey-step', {
            y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.journey-flow', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    /* ── 12. SECURITY ────────────────────────────────────────── */
    if (document.querySelector('.security-row')) {
        gsap.from('.security-row', {
            y: 35, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.security-grid', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    /* ── 13. CTA HEADLINE ────────────────────────────────────── */
    if (document.querySelector('.cta-headline')) {
        const ctaTl = gsap.timeline({
            scrollTrigger: { trigger: '#cta', start: 'top 85%', toggleActions: 'play none none none' }
        });
        ctaTl
            .from('.cta-headline', { y: 60, opacity: 0, duration: 0.75, ease: 'power3.out' })
            .from('.cta-sub', { y: 35, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
            .from('.cta-actions', { y: 25, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35');
    }

    /* ── 14. LOGO STRIP ─────────────────────────────────────── */
    if (document.querySelector('.logo-item')) {
        gsap.from('.logo-item', {
            y: 15, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out',
            scrollTrigger: { trigger: '.logos-section', start: 'top 92%', toggleActions: 'play none none none' }
        });
    }

    /* ── 15. FOOTER ──────────────────────────────────────────── */
    if (document.querySelector('.footer')) {
        gsap.from('.footer', {
            opacity: 0, y: 25, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: '.footer', start: 'top 96%', toggleActions: 'play none none none' }
        });
    }

});
