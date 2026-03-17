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

    let lastScrollY = 0;
    lenis.on('scroll', (e) => {
        ScrollTrigger.update();
        const currentScrollY = e.scroll;
        const nav = document.querySelector('#navbar');

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling Down
            nav?.classList.add('nav-hidden');
        } else {
            // Scrolling Up or reached top
            nav?.classList.remove('nav-hidden');
        }

        // Ensure nav is visible at the very top
        if (currentScrollY < 10) {
            nav?.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
    });

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
        .from('.hero-actions .btn-premium', { scale: 0.8, opacity: 0, duration: 1, stagger: 0.1, ease: 'back.out(1.5)' }, 0.6)
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




    /* ── SECURITY — phone mockups Step-by-Step (Staircase) Layout ── */
    if (q('.sec-phone')) {
        const phones = qa('.sec-phone');

        // Immediate position set to prevent flash of unaligned content
        if (!isMobile) {
            phones.forEach((p, i) => {
                gsap.set(p, { y: (i * 45) - 45 }); // Staircase: -45, 0, 45
            });
        }

        gsap.from(phones, {
            y: (i) => ((i * 45) - 45) + 100, // Entrance from 100px lower than final pos
            opacity: 0,
            scale: 0.9,
            stagger: 0.2,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: '.sec-phones',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        if (q('.sec-callout')) {
            gsap.from('.sec-callout', {
                y: 30, opacity: 0, duration: 1, ease: 'power2.out',
                scrollTrigger: { trigger: '.sec-callout', start: 'top 92%' }
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


    /* ════════════════════════════════════════════════════════════
       20. ROTATING TEXT PILL — Vanilla GSAP implementation
    ════════════════════════════════════════════════════════════ */
    (function initRotatingText() {
        const wrapper = document.querySelector('#rotating-text-wrapper');
        if (!wrapper) return;

        const texts = ['Business', 'Growth', 'Retail', 'Empire', 'Future'];
        let currentIdx = 0;

        function animateIn(text) {
            wrapper.innerHTML = '';
            // Split text into characters
            const chars = text.split('').map(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? ' ' : char;
                wrapper.appendChild(span);
                return span;
            });

            // Entrance: Stagger from last (as requested)
            gsap.from(chars, {
                y: '100%',
                opacity: 0,
                duration: 0.6,
                stagger: { each: 0.03, from: 'end' },
                ease: 'back.out(1.5)',
                onComplete: () => {
                    // Wait 2 seconds then exit
                    gsap.delayedCall(2, () => animateOut(chars));
                }
            });
        }

        function animateOut(chars) {
            // Exit: Stagger to top
            gsap.to(chars, {
                y: '-120%',
                opacity: 0,
                duration: 0.5,
                stagger: 0.02,
                ease: 'power2.in',
                onComplete: () => {
                    currentIdx = (currentIdx + 1) % texts.length;
                    animateIn(texts[currentIdx]);
                }
            });
        }

        animateIn(texts[currentIdx]);
    })();



    /* ════════════════════════════════════════════════════════════
       21. THREE.JS HERO — Optimized & Faster Loading
    ════════════════════════════════════════════════════════════ */
    (function initHero3D() {
        const container = document.querySelector('#three-canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        const loader = document.querySelector('#three-loader');

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        camera.position.set(0, 0, 3.5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const pLight = new THREE.PointLight(0xBFFF00, 2, 10);
        pLight.position.set(2, 2, 2);
        scene.add(pLight);

        // High-Speed Loader for a lighter model
        const gltfLoader = new THREE.GLTFLoader();
        const modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/SheenChair/glTF-Binary/SheenChair.glb';

        function hideLoader() {
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 800);
            }
        }

        gltfLoader.load(modelUrl, (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const scale = 1.4 / Math.max(size.x, size.y, size.z);
            model.scale.setScalar(scale);
            model.position.y = -0.3; // Slight adjustment

            scene.add(model);
            hideLoader();

            // Entrance
            gsap.from(model.scale, { x: 0, y: 0, z: 0, duration: 1.2, ease: 'back.out(1.7)' });

            // Interaction logic
            animate(model);
        }, undefined, (err) => {
            console.error("3D Load Error:", err);
            hideLoader();
        });


        function animate(obj) {
            let time = 0;
            function frame() {
                requestAnimationFrame(frame);
                if (obj) {
                    time += 0.012;
                    // Math.sin oscillates between -1 and 1
                    // 180 degrees = Math.PI radians
                    // Sweep from -Math.PI/2 to +Math.PI/2
                    obj.rotation.y = Math.sin(time) * (Math.PI / 2);

                    // Subtle tilting for depth
                    obj.rotation.x = Math.cos(time * 0.5) * 0.15;
                }
                renderer.render(scene, camera);
            }
            frame();
        }


        // Resize
        window.addEventListener('resize', () => {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
    })();



    /* ════════════════════════════════════════════════════════════
       22. LIGHT RAYS ENGINE — Vanilla OGL implementation
    ════════════════════════════════════════════════════════════ */
    (function initLightRays() {
        const container = document.querySelector('#light-rays-container');
        console.log('[LightRays] Container found:', !!container);
        if (!container) { console.warn('[LightRays] No container found.'); return; }
        if (typeof ogl === 'undefined') { console.error('[LightRays] OGL library not found.'); return; }

        const { Renderer, Program, Triangle, Mesh } = ogl;

        const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
        const gl = renderer.gl;
        container.appendChild(gl.canvas);
        gl.canvas.style.position = 'absolute';
        gl.canvas.style.top = '0';
        gl.canvas.style.left = '0';
        gl.canvas.style.width = '100%';
        gl.canvas.style.height = '100%';

        const vert = `
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = position * 0.5 + 0.5;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const frag = `
            precision highp float;
            uniform float iTime;
            uniform vec2 iResolution;
            uniform vec2 rayPos;
            uniform vec2 rayDir;
            uniform vec3 raysColor;
            uniform float raysSpeed;
            uniform float lightSpread;
            uniform float rayLength;
            uniform float fadeDistance;
            uniform vec2 mousePos;
            uniform float mouseInfluence;

            varying vec2 vUv;

            float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
                vec2 sourceToCoord = coord - raySource;
                vec2 dirNorm = normalize(sourceToCoord);
                float cosAngle = dot(dirNorm, rayRefDirection);
                float spreadFactor = pow(max(cosAngle, 0.0), 1.0 / max(lightSpread, 0.001));
                float distance = length(sourceToCoord);
                float maxDistance = iResolution.x * rayLength;
                float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
                float baseStrength = clamp(
                    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
                    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
                    0.0, 1.0
                );
                return baseStrength * lengthFalloff * spreadFactor;
            }

            void main() {
                vec2 fragCoord = gl_FragCoord.xy;
                vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
                
                vec2 finalRayDir = rayDir;
                if (mouseInfluence > 0.0) {
                    vec2 mouseScreenPos = mousePos * iResolution.xy;
                    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
                    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
                }

                float r1 = rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.2 * raysSpeed);
                float r2 = rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 0.9 * raysSpeed);

                vec3 color = raysColor * (r1 * 0.5 + r2 * 0.4);
                
                // Vertical gradient fade
                float brightness = 1.0 - (coord.y / iResolution.y);
                color *= (0.2 + brightness * 0.8);
                
                gl_FragColor = vec4(color, color.r * 0.5); // Using red channel for alpha
            }
        `;

        const hexToRgb = hex => {
            const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
        };

        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: [gl.canvas.width, gl.canvas.height] },
            rayPos: { value: [0, 0] },
            rayDir: { value: [0, 1] },
            raysColor: { value: hexToRgb('#BFFF00') }, // MarsCart Lime
            raysSpeed: { value: 0.8 },
            lightSpread: { value: 0.6 },
            rayLength: { value: 2.5 },
            fadeDistance: { value: 1.0 },
            mousePos: { value: [0.5, 0.5] },
            mouseInfluence: { value: 0.15 }
        };

        const geometry = new Triangle(gl);
        const program = new Program(gl, { vertex: vert, fragment: frag, uniforms, transparent: true });
        const mesh = new Mesh(gl, { geometry, program });

        function resize() {
            console.log('[LightRays] Resizing canvas to:', container.offsetWidth, 'x', container.offsetHeight);
            const w = container.offsetWidth;
            const h = container.offsetHeight;
            renderer.setSize(w, h);
            uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height];
            uniforms.rayPos.value = [gl.canvas.width * 0.5, -gl.canvas.height * 0.1]; // top-center
        }

        window.addEventListener('resize', resize);
        resize();

        let mouse = { x: 0.5, y: 0.5 };
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX / window.innerWidth;
            mouse.y = e.clientY / window.innerHeight;
        });

        function update(t) {
            requestAnimationFrame(update);
            uniforms.iTime.value = t * 0.001;

            // Smooth mouse
            uniforms.mousePos.value[0] += (mouse.x - uniforms.mousePos.value[0]) * 0.05;
            uniforms.mousePos.value[1] += (mouse.y - uniforms.mousePos.value[1]) * 0.05;

            renderer.render({ scene: mesh });
        }
        update(0);
    })();

});