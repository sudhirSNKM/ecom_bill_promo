import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* ============================================================
   MARSCART — Tent Scrollytelling
   ============================================================ */

class MarsCartTent {
    constructor() {
        this.canvas = document.querySelector('#webgl-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();

        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // Initial position looking at the front of the tent
        this.camera.position.set(0, 0, 15);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.tent = null;

        this.setupLighting();
        this.loadTentModel();

        this.setupLenis();

        window.addEventListener('resize', this.onResize.bind(this));

        this.clock = new THREE.Clock();
        this.tick();
    }

    setupLighting() {
        // Soft white ambient light for the whole base
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
        this.scene.add(ambientLight);

        // Main directional sun to give the ridges shadow & depth
        const dirLight = new THREE.DirectionalLight(0xfffdfa, 3.5);
        dirLight.position.set(10, 15, 10);
        this.scene.add(dirLight);

        // Soft PointLight inside the tent (for the final zoom to table)
        this.tableLight = new THREE.PointLight(0xfffae6, 0); // intensity 0 initially
        this.tableLight.position.set(0, 0.5, 0); // Position roughly above the table
        this.scene.add(this.tableLight);
    }

    loadTentModel() {
        const loader = new GLTFLoader();

        loader.load('assets/uploads_files_5882300_Promotional_Tent.glb', (gltf) => {
            this.tent = gltf.scene;

            // No material overrides to keep the glTF original materials and colors

            // Center and scale the tent somewhat appropriately
            const box = new THREE.Box3().setFromObject(this.tent);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetSize = 10; // We want it to be roughly 10 units wide
            const scale = targetSize / maxDim;

            this.tent.scale.set(scale, scale, scale);

            // Recompute box after scaling to center it
            const newBox = new THREE.Box3().setFromObject(this.tent);
            const center = newBox.getCenter(new THREE.Vector3());

            // Adjust to bottom alignment (y = min)
            this.tent.userData.baseY = -(newBox.min.y) - 2.5;
            this.tent.position.set(-center.x, this.tent.userData.baseY, -center.z);

            this.scene.add(this.tent);

            // Once model is loaded, we can setup the GSAP timeline
            this.setupGSAPScroll();
        });
    }

    setupGSAPScroll() {
        if (!this.tent || typeof gsap === 'undefined') return;

        // 1. Continuous Rotation linked to the entire page scroll
        gsap.to(this.tent.rotation, {
            scrollTrigger: {
                trigger: 'body', // The whole body
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5, // Super smooth scrubbing
            },
            y: Math.PI * 2, // 360 degree spin as you scroll down
            ease: "none"
        });

        // 2. Final Zoom when reaching the very last specific section
        const ctaElement = document.querySelector('#cta');
        if (ctaElement) {
            gsap.to(this.camera.position, {
                scrollTrigger: {
                    trigger: '#cta',
                    start: 'top 90%', // When top of CTA enters viewport
                    end: 'bottom bottom', // When bottom of CTA hits bottom of viewport
                    scrub: 1.5
                },
                z: 2.5, // Move deep in near the table
                y: this.tent.userData.baseY + 3.0, // Lower to specific table height
                ease: "power2.inOut"
            });

            // Turn on internal glow light during the zoom
            gsap.to(this.tableLight, {
                scrollTrigger: {
                    trigger: '#cta',
                    start: 'top 90%',
                    end: 'bottom bottom',
                    scrub: 1.5
                },
                intensity: 4.5,
                ease: "power2.in"
            });
        }
    }

    setupLenis() {
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    tick() {
        requestAnimationFrame(this.tick.bind(this));

        // Floating Idle Animation
        if (this.tent && this.tent.userData.baseY !== undefined) {
            const elapsedTime = this.clock.getElapsedTime();
            this.tent.position.y = this.tent.userData.baseY + Math.sin(elapsedTime * 1.5) * 0.05;
        }

        // Standard render
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.marsCartTent = new MarsCartTent();
});
