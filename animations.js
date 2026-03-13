/* ============================================================
   MarsCart — Complete Animation System v4
   Covers EVERY section · Mouse Parallax · Scroll Parallax
   Liquid Glass · Spring Cards · Horizontal Scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    if (typeof gsap === 'undefined') { console.warn('[MarsCart] GSAP not loaded.'); return; }
    gsap.registerPlugin(ScrollTrigger);

    /* ════════════════════════════════════════════════════════════
       0. LENIS SMOOTH SCROLL — Initializing momentum scroll
    ════════════════════════════════════════════════════════════ */
    const lenis = new Lenis({ duration: 1.3, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    /* ════════════════════════════════════════════════════════════
       UTILITY — safe query, only runs if elements exist
    ════════════════════════════════════════════════════════════ */
    const q = (sel) => document.querySelector(sel);
    const qa = (sel) => [...document.querySelectorAll(sel)];
    const isMobile = window.innerWidth <= 768;

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
       3. CINEMATIC HERO SCROLL — zoom + parallax + fade
    ════════════════════════════════════════════════════════════ */
    if (q('.hero-content')) {
        gsap.to('.hero-content', {
            y: -100, opacity: 0, scale: 0.95, 
            scrollTrigger: { trigger: '.hero', start: 'top top', end: '80% top', scrub: 1 }
        });
    }
    if (q('.hero-vid-shell')) {
        gsap.fromTo('.hero-vid-shell',
            { scale: 1.25, transformOrigin: 'top center' },
            {
                scale: 0.9, y: 50, opacity: 0, 
                scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
            }
        );
    }
    if (q('.hero-bg-grid')) {
        gsap.to('.hero-bg-grid', {
            y: 100, opacity: 0,
            scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: 1 }
        });
    }
    qa('.hero-orb').forEach((orb, i) => {
        gsap.to(orb, {
            y: (i + 1) * -150, x: (i % 2 === 0 ? 1 : -1) * 80,
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
        });
    });

        /* ════════════════════════════════════════════════════════════
       4. HERO ENTRANCE — staggered text rise on load
    ════════════════════════════════════════════════════════════ */
    gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from('.hero-badge', { y: 30, opacity: 0, duration: 1 }, 0.1)
        .from('.hero-headline > span', { 
            y: 80, opacity: 0, duration: 1.2, filter: 'blur(8px)', stagger: 0.15 
        }, 0.2)
        .from('.hero-sub', { y: 40, opacity: 0, duration: 1 }, 0.4)
        .from('.hero-actions .btn, .hero-actions .btn-uiverse', { scale: 0.8, opacity: 0, duration: 1, stagger: 0.1, ease: 'back.out(1.5)' }, 0.6)
        .from('.hero-stats', { y: 20, opacity: 0, duration: 0.8 }, 0.8)
        .from('.hero-visual', { y: 80, opacity: 0, duration: 1.2, filter: 'blur(10px)' }, 0.4);

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
        // Skip sections that have specialized internal stagger animations or are handled elsewhere
        const skip = ['platform', 'roles', 'analytics', 'tech', 'security', 'reviews', 'blog'];
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
       10. SPECIALIZED SECTION ANIMATIONS (Below Analytics)
    ════════════════════════════════════════════════════════════ */

    // Tech Stack Reveal (Staircase Entrance)
    if (q('.tech-cards-col')) {
        gsap.from('.tech-card', {
            y: 40, opacity: 0, duration: 1.2, stagger: 0.3, ease: 'power3.out',
            scrollTrigger: { trigger: '.tech-cards-col', start: 'top 80%' }
        });
        gsap.from('.floating-buy-card', {
            y: 30, scale: 0.9, opacity: 0, duration: 1.4, ease: 'back.out(1.5)',
            scrollTrigger: { trigger: '.tech-left', start: 'top 80%' }
        });
    }

    // Security Phone Reveals (Slow Staircase Steps)
    if (q('.sec-phones')) {
        gsap.from('.sec-phone', {
            y: 250,
            opacity: 0,
            scale: 0.8,
            duration: 1.8,
            stagger: 0.45,
            ease: 'power4.out',
            scrollTrigger: { trigger: '.sec-phones', start: 'top 80%' }
        });

        // Ensure the callout below also has a clean entrance
        gsap.from('.sec-callout', {
            y: 40, opacity: 0, duration: 1.2, delay: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: '.sec-callout', start: 'top 95%' }
        });
    }

    // Customer Reviews Stagger + Continuous Float (Safety first)
    if (q('.reviews-grid')) {
        gsap.from('.review-card', {
            y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.reviews-grid', start: 'top 85%' },
            onComplete: () => {
                qa('.review-card').forEach((card, i) => {
                    gsap.set(card, { clearProps: 'opacity,visibility' }); // Ensure visible
                    gsap.to(card, {
                        y: i % 3 === 0 ? -8 : (i % 3 === 1 ? 8 : 0),
                        duration: 3 + (i * 0.4),
                        yoyo: true,
                        repeat: -1,
                        ease: 'sine.inOut'
                    });
                });
            }
        });
    }

    // Blog Grid Reveal
    if (q('.blog-grid')) {
        gsap.from('.blog-card', {
            y: 60, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '.blog-grid', start: 'top 85%' }
        });
    }

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

    /* ════════════════════════════════════════════════════════════
       7. PLATFORM — Stacked Cards Effect
    ════════════════════════════════════════════════════════════ */
    if (qa('.module-card-stack').length) {
        const stacks = qa('.module-card-stack');
        stacks.forEach((card, i) => {
            if (i === stacks.length - 1) return;
            gsap.to(card, {
                scale: 0.94, // Compacter scale
                opacity: 0.9,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 120px',
                    end: 'bottom 100px',
                    scrub: true,
                }
            });
        });
    }

    
    /* ════════════════════════════════════════════════════════════
       8. ANALYTICS — Sticky Storytelling (Morphing Stack)
    ════════════════════════════════════════════════════════════ */
    if (q('.sticky-story-sec') && !isMobile) {
        const steps = qa('.story-step');
        const vcards = qa('.story-visual-card');

        // Set initial classes for the morphing stack
        const updateStack = (idx) => {
            steps.forEach((step, i) => step.classList.toggle('active', i === idx));
            
            vcards.forEach((vc, i) => {
                vc.classList.remove('stack-active', 'stack-next-1', 'stack-next-2', 'stack-past', 'active');
                
                if (i < idx) {
                    vc.classList.add('stack-past');
                } else if (i === idx) {
                    vc.classList.add('stack-active');
                    vc.classList.add('active'); // compatibility
                } else if (i === idx + 1) {
                    vc.classList.add('stack-next-1');
                } else if (i >= idx + 2) {
                    vc.classList.add('stack-next-2');
                }
            });
        };

        // Initialize state
        updateStack(0);

        // Individual ScrollTriggers for each text step
        steps.forEach((step, i) => {
            ScrollTrigger.create({
                trigger: step,
                start: "top 60%",
                end: "bottom 40%",
                onEnter: () => updateStack(i),
                onEnterBack: () => updateStack(i),
            });
        });
    }


    /* ════════════════════════════════════════════════════════════
       9. HORIZONTAL SCROLL — Roles Gallery
    ════════════════════════════════════════════════════════════ */
    (function initRolesHScroll() {
        const container = q('#rolesScrollContainer');
        const gallery = q('#rolesGallery');
        const fill = q('#rolesProgressFill');
        if (!container || !gallery || isMobile) return;

        const cards = qa('.role-hcard');
        const cardW = cards[0]?.offsetWidth || 460;
        const totalPan = (cards.length - 1) * (cardW + 32);

        gsap.set(cards, { scale: 0.98, opacity: 1, borderColor: 'rgba(255,255,255,0.08)', boxShadow: 'none' });
        gsap.set(cards[0], { scale: 1.0, borderColor: '#D0E84D', boxShadow: '0 0 30px rgba(208, 232, 77, 0.15)' });

        gsap.to(gallery, {
            x: -totalPan, ease: 'none',
            scrollTrigger: {
                trigger: container, start: 'top top', end: 'bottom bottom',
                scrub: 1.2,
                onUpdate: (self) => {
                    if (fill) fill.style.width = (self.progress * 100) + '%';

                    // Determine which card is closest to the viewport center
                    const viewportCenter = window.innerWidth / 2;
                    let activeIdx = 0;
                    let minDistance = Infinity;

                    cards.forEach((card, i) => {
                        const rect = card.getBoundingClientRect();
                        const cardCenter = rect.left + rect.width / 2;
                        const dist = Math.abs(cardCenter - viewportCenter);

                        if (dist < minDistance) {
                            minDistance = dist;
                            activeIdx = i;
                        }
                    });

                    cards.forEach((c, i) => gsap.to(c, {
                        scale: i === activeIdx ? 1.0 : 0.98,
                        borderColor: i === activeIdx ? '#D0E84D' : 'rgba(255,255,255,0.08)',
                        boxShadow: i === activeIdx ? '0 0 40px rgba(208, 232, 77, 0.25)' : 'none',
                        duration: 0.4, overwrite: 'auto', ease: 'power2.out'
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

    /* ── BUSINESS MANAGEMENT — Uiverse cards entrance reveal ── */
    if (q('.features-bento')) {
        gsap.from('.bento-card-wrap', {
            y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: '.features-bento', start: 'top 92%', toggleActions: 'play none none none', once: true }
        });
    }

    /* ════════════════════════════════════════════════════════════
       9. FOOTER — Parallax Background
    ════════════════════════════════════════════════════════════ */
    if (q('.footer-parallax')) {
        gsap.to('.footer-parallax', {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.footer',
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: true
            }
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

    
    
    /* ── SECURITY — phone mockups staggered layout handled in GSAP (Race Condition Fix) ── */
    if (q('.sec-phone')) {
        gsap.fromTo('.sec-phone', 
            { y: 120, opacity: 0, scale: 0.9 }, 
            { 
                y: (i) => (i === 1 ? -30 : (i === 2 ? 30 : 0)),
                opacity: 1, 
                scale: 1,
                stagger: 0.15,
                duration: 1.5,
                ease: 'back.out(1.4)',
                scrollTrigger: { 
                    trigger: '.sec-phones', 
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
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
