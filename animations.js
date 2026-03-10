/* ============================================================
   MarsCart — Complete Animation System v4
   Covers EVERY section · Mouse Parallax · Scroll Parallax
   Liquid Glass · Spring Cards · Horizontal Scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    if (typeof gsap === 'undefined') { console.warn('[MarsCart] GSAP not loaded.'); return; }
    gsap.registerPlugin(ScrollTrigger);

    /* ════════════════════════════════════════════════════════════
       UTILITY — safe query, only runs if elements exist
    ════════════════════════════════════════════════════════════ */
    const q = (sel) => document.querySelector(sel);
    const qa = (sel) => [...document.querySelectorAll(sel)];

    /* ════════════════════════════════════════════════════════════
       1. NAVBAR — liquid glass tightens on scroll
    ════════════════════════════════════════════════════════════ */
    ScrollTrigger.create({
        start: 'top -60',
        onEnter: () => q('#navbar')?.classList.add('scrolled'),
        onLeaveBack: () => q('#navbar')?.classList.remove('scrolled'),
    });

    /* ════════════════════════════════════════════════════════════
       2. MOUSE PARALLAX — Hero orbs follow cursor at different depths
    ════════════════════════════════════════════════════════════ */
    if (q('.hero')) {
        let mx = 0, my = 0, cx = 0, cy = 0;
        document.addEventListener('mousemove', (e) => {
            mx = (e.clientX / window.innerWidth - 0.5) * 2;
            my = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        (function raf() {
            cx += (mx - cx) * 0.07;
            cy += (my - cy) * 0.07;
            qa('.mouse-parallax').forEach((el) => {
                const d = parseFloat(el.dataset.depth) || 0.05;
                el.style.transform = `translate(${cx * d * 120}px, ${cy * d * 80}px)`;
            });
            requestAnimationFrame(raf);
        })();
    }

    /* ════════════════════════════════════════════════════════════
       3. SCROLL PARALLAX — hero layers move at different speeds
    ════════════════════════════════════════════════════════════ */
    if (q('.hero-content')) {
        gsap.to('.hero-content', {
            yPercent: -12, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });
    }
    if (q('.hero-visual')) {
        gsap.to('.hero-visual', {
            yPercent: -22, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
        });
    }
    if (q('.hero-bg-grid')) {
        gsap.to('.hero-bg-grid', {
            opacity: 0, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: '35% top', scrub: 1 }
        });
    }

    /* ════════════════════════════════════════════════════════════
       4. HERO ENTRANCE — staggered text rise on load
    ════════════════════════════════════════════════════════════ */
    gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-badge', { y: 24, opacity: 0, duration: 0.7 }, 0.1)
        .from('.hero-headline', { y: 70, opacity: 0, duration: 0.85 }, 0.2)
        .from('.hero-sub', { y: 40, opacity: 0, duration: 0.7 }, 0.38)
        .from('.hero-actions', { y: 30, opacity: 0, duration: 0.6 }, 0.52)
        .from('.hero-stats', { y: 20, opacity: 0, duration: 0.55 }, 0.65)
        .from('.hero-visual', { y: 60, opacity: 0, duration: 0.85 }, 0.28);

    /* ════════════════════════════════════════════════════════════
       5. FLOATING CARDS — hero cards gently bob up/down
    ════════════════════════════════════════════════════════════ */
    qa('.floating-card').forEach((card, i) => {
        gsap.to(card, {
            y: i % 2 === 0 ? -10 : -14,
            duration: 2.8 + i * 0.4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });
    });

    /* ── SECTION REVEAL — universal fade-in ── */
    qa('.section').forEach((sec) => {
        // Skip sections that have specialized internal stagger animations to avoid conflicts
        const skip = ['platform', 'features', 'analytics', 'tech'];
        if (skip.includes(sec.id)) return;

        gsap.from(sec, {
            opacity: 0, y: 40, duration: 0.8, ease: 'power2.out',
            scrollTrigger: {
                trigger: sec, start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    });

    /* ════════════════════════════════════════════════════════════
       7. SECTION LABELS · TITLES · SUBS — individual reveals
    ════════════════════════════════════════════════════════════ */
    qa('.section-label').forEach(el =>
        gsap.from(el, {
            y: 18, opacity: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        })
    );
    qa('.section-title').forEach(el =>
        gsap.from(el, {
            y: 48, opacity: 0, duration: 0.75, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        })
    );
    qa('.section-sub').forEach(el =>
        gsap.from(el, {
            y: 28, opacity: 0, duration: 0.65, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        })
    );

    /* ── PLATFORM — module cards spring up ── */
    if (q('.modules-grid')) {
        gsap.from('.module-card', {
            y: 50,
            opacity: 0,
            scale: 0.98,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.modules-grid',
                start: 'top 92%',
                toggleActions: 'play none none none',
                once: true
            }
        });
    }

    /* ════════════════════════════════════════════════════════════
       9. HORIZONTAL SCROLL — Roles Gallery
    ════════════════════════════════════════════════════════════ */
    (function initRolesHScroll() {
        const container = q('#rolesScrollContainer');
        const gallery = q('#rolesGallery');
        const fill = q('#rolesProgressFill');
        if (!container || !gallery) return;

        const cards = qa('.role-hcard');
        const cardW = cards[0]?.offsetWidth || 460;
        const totalPan = (cards.length - 1) * (cardW + 32);

        gsap.set(cards, { scale: 0.93, opacity: 0.5 });
        gsap.set(cards[0], { scale: 1.0, opacity: 1 });

        gsap.to(gallery, {
            x: -totalPan, ease: 'none',
            scrollTrigger: {
                trigger: container, start: 'top top', end: 'bottom bottom',
                scrub: 1.2,
                onUpdate: (self) => {
                    if (fill) fill.style.width = (self.progress * 100) + '%';
                    const idx = Math.round(self.progress * (cards.length - 1));
                    cards.forEach((c, i) => gsap.to(c, {
                        scale: i === idx ? 1.0 : 0.93,
                        opacity: i === idx ? 1 : 0.5,
                        duration: 0.35, overwrite: 'auto', ease: 'power2.out'
                    }));
                }
            }
        });
    })();

    /* ════════════════════════════════════════════════════════════
       10. SPRING CARDS — Customer Experience
    ════════════════════════════════════════════════════════════ */
    qa('.cx-card-wrap').forEach((wrap) => {
        const card = wrap.querySelector('.cx-card');
        const splash = wrap.querySelector('.cx-splash');
        if (!card) return;
        gsap.set(card, { y: 80, opacity: 0 });
        gsap.to(card, {
            y: 0, opacity: 1, duration: 0.85, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: wrap, start: 'top 82%', toggleActions: 'play none none reverse' }
        });
        if (splash) gsap.from(splash, {
            opacity: 0, scale: 0.5, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: wrap, start: 'top 82%', toggleActions: 'play none none reverse' }
        });
    });

    /* ── BUSINESS MANAGEMENT — bento cards spring up ── */
    if (q('.features-bento')) {
        gsap.from('.bento-card', {
            y: 60,
            opacity: 0,
            scale: 0.98,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.features-bento',
                start: 'top 92%',
                toggleActions: 'play none none none',
                once: true
            }
        });
    }

    /* ════════════════════════════════════════════════════════════
       12. ANALYTICS — metrics + chart cards stagger
    ════════════════════════════════════════════════════════════ */
    if (q('.analytics-metric')) {
        gsap.from('.analytics-metric', {
            y: 50, opacity: 0, duration: 0.65, stagger: 0.09, ease: 'power2.out',
            scrollTrigger: { trigger: '#analytics', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }
    if (q('.chart-card')) {
        gsap.from('.chart-card', {
            y: 40, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.analytics-main', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    /* ════════════════════════════════════════════════════════════
       13. TECH — section title parallax + cards stagger
       Note: tech-cards live inside .journey-flow in #tech
    ════════════════════════════════════════════════════════════ */
    if (q('#tech .tech-card')) {
        // Left column: heading + buy card animate together
        if (q('.floating-buy-card')) {
            gsap.from('.floating-buy-card', {
                y: 50, opacity: 0, duration: 0.85, ease: 'back.out(1.2)',
                scrollTrigger: { trigger: '.tech-left', start: 'top 82%', toggleActions: 'play none none none' }
            });
        }
        // Right column: tech cards stagger in
        gsap.from('#tech .tech-card', {
            y: 48, opacity: 0, duration: 0.65, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '.tech-cards-col', start: 'top 82%', toggleActions: 'play none none none' }
        });
        // Badges pop in last
        if (q('.tech-badge')) {
            gsap.from('.tech-badge', {
                y: 16, opacity: 0, scale: 0.88, duration: 0.45, stagger: 0.07, ease: 'back.out(1.5)',
                scrollTrigger: { trigger: '.tech-badges', start: 'top 88%', toggleActions: 'play none none none' }
            });
        }
    }

    /* ── SECURITY — phone mockups stagger up ── */
    if (q('.sec-phone')) {
        gsap.from('.sec-phone', {
            y: 80, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: '.sec-phones', start: 'top 85%', toggleActions: 'play none none none' }
        });
        if (q('.sec-callout')) {
            gsap.from('.sec-callout', {
                y: 32, opacity: 0, duration: 0.7, ease: 'power2.out',
                scrollTrigger: { trigger: '.sec-callout', start: 'top 92%', toggleActions: 'play none none none' }
            });
        }
    }

    /* ════════════════════════════════════════════════════════════
       15. REVIEWS — summary boxes + cards stagger
    ════════════════════════════════════════════════════════════ */
    if (q('.reviews-summary')) {
        gsap.from('.reviews-summary > *', {
            y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.reviews-summary', start: 'top 84%', toggleActions: 'play none none none' }
        });
    }
    if (q('.review-card')) {
        gsap.from('.review-card', {
            y: 55, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: '.reviews-grid', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    /* ════════════════════════════════════════════════════════════
       16. BLOG — cards stagger with slight scale
    ════════════════════════════════════════════════════════════ */
    if (q('.blog-card')) {
        gsap.from('.blog-card', {
            y: 60, opacity: 0, scale: 0.96, duration: 0.7, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.blog-grid', start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    /* ════════════════════════════════════════════════════════════
       17. CTA — headline + sub + actions timeline
    ════════════════════════════════════════════════════════════ */
    if (q('.cta-headline')) {
        const ctaTl = gsap.timeline({
            scrollTrigger: { trigger: '#cta', start: 'top 85%', toggleActions: 'play none none none' }
        });
        ctaTl
            .from('.cta-headline', { y: 60, opacity: 0, duration: 0.85, ease: 'power3.out' })
            .from('.cta-sub', { y: 32, opacity: 0, duration: 0.65, ease: 'power2.out' }, '-=0.45')
            .from('.cta-actions', { y: 24, opacity: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35');
    }

    /* ════════════════════════════════════════════════════════════
       18. LOGOS STRIP + FOOTER
    ════════════════════════════════════════════════════════════ */
    if (q('.logo-item')) {
        gsap.from('.logo-item', {
            y: 18, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out',
            scrollTrigger: { trigger: '.logos-section', start: 'top 92%', toggleActions: 'play none none none' }
        });
    }
    if (q('.footer')) {
        gsap.from('.footer', {
            opacity: 0, y: 24, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: '.footer', start: 'top 96%', toggleActions: 'play none none none' }
        });
    }

    /* ════════════════════════════════════════════════════════════
       19. SCROLL PARALLAX — section background blob elements
    ════════════════════════════════════════════════════════════ */
    qa('.parallax-blob').forEach((blob) => {
        gsap.to(blob, {
            yPercent: -40, ease: 'none',
            scrollTrigger: {
                trigger: blob.closest('[class]'), start: 'top bottom', end: 'bottom top', scrub: 1.5
            }
        });
    });

});
