import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

/* ============================================================
   MARSCART — Tent Scrollytelling
   ============================================================ */

class MarsCartTent {
    constructor() {
        this.canvas = document.querySelector('#webgl-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();

        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        // Initial position looking at the front of the tent
        this.camera.position.set(0, 0, 10);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.tent = null;

        this.setupPostProcessing();
        this.setupLighting();
        this.loadTentModel();

        this.setupLenis();

        window.addEventListener('resize', this.onResize.bind(this));

        this.clock = new THREE.Clock();
        this.tick();
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        // Clear background to be transparent so HTML shows through
        renderPass.clearColor = new THREE.Color(0, 0, 0);
        renderPass.clearAlpha = 0;
        this.composer.addPass(renderPass);

        // Setup Depth of Field (BokehPass)
        this.bokehPass = new BokehPass(this.scene, this.camera, {
            focus: 1.0,  // Initial focus distance
            aperture: 0, // 0 means no blur initially
            maxblur: 0.01,
            width: window.innerWidth,
            height: window.innerHeight
        });
        this.composer.addPass(this.bokehPass);
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
        dirLight.position.set(5, 5, 5);
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

            // Enhance materials
            this.tent.traverse((child) => {
                if (child.isMesh) {
                    // Check if this looks like the canopy fabric
                    if (child.name.toLowerCase().includes('canvas') || child.name.toLowerCase().includes('fabric') || child.name.toLowerCase().includes('tent')) {
                        const oldMat = child.material;
                        child.material = new THREE.MeshPhysicalMaterial({
                            color: 0x1e3a8a, // Deep blue sheen
                            metalness: 0.1,
                            roughness: 0.4,
                            clearcoat: 0.2, // Gives it that synthetic canopy reflectivity
                            clearcoatRoughness: 0.3,
                        });
                        if (oldMat.map) child.material.map = oldMat.map;
                    }
                }
            });

            // Center and scale the tent somewhat appropriately
            this.tent.position.set(0, -1.5, 0);
            // Adjust scale depending on how big the raw GLB is (using 1 for now)
            this.tent.scale.set(1, 1, 1);

            this.scene.add(this.tent);

            // Once model is loaded, we can setup the GSAP timeline
            this.setupGSAPScroll();
        });
    }

    setupGSAPScroll() {
        if (!this.tent || typeof gsap === 'undefined') return;

        // Main scroll timeline for the Scrollytelling format
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#main-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1, // Smoothly follows scrollbar
            }
        });

        /* 
          The Sections:
          1 (0 - 25%): Front View (Book a Demo) -> Rotate 90 deg right
          2 (25 - 50%): Right Wall (Features) -> Rotate 90 deg back
          3 (50 - 75%): Back Wall (Pricing) -> Rotate 90 deg left
          4 (75 - 100%): Left Wall (Branches) -> Rotate front and ZOOM
        */

        // Stage 1 -> 2: Rotate to right wall
        tl.to(this.tent.rotation, {
            y: Math.PI / 2, // 90 deg
            ease: "power1.inOut"
        }, 0);

        // Stage 2 -> 3: Rotate to back wall
        tl.to(this.tent.rotation, {
            y: Math.PI, // 180 deg
            ease: "power1.inOut"
        }, "<1"); // chain right after previous

        // Stage 3 -> 4: Rotate to left wall
        tl.to(this.tent.rotation, {
            y: Math.PI * 1.5, // 270 deg
            ease: "power1.inOut"
        }, "<1");

        // Stage 4 -> 5 (Final): Rotate back to front, ZOOM camera down to table level, Trigger Bokeh
        // Note: We move the *camera* here, not the tent, to simulate a fly-in
        tl.to(this.tent.rotation, {
            y: Math.PI * 2, // 360 deg back to front
            ease: "power2.inOut"
        }, "<1");

        tl.to(this.camera.position, {
            z: 2.5, // Move deep in
            y: 0.5, // Lower to table height
            ease: "power2.inOut"
        }, "<"); // running simultaneous with the final rotation

        // Turn on internal glow light during the zoom
        tl.to(this.tableLight, {
            intensity: 3.5,
            ease: "power2.in"
        }, "<");

        // Turn on the Depth of Field blur (aperture) for cinematic effect on the background
        tl.to(this.bokehPass.uniforms.aperture, {
            value: 0.005, // Introduce blur
            ease: "power2.inOut"
        }, "<");

        // Focus distance stays sharp near the table (e.g., 2 units away)
        tl.to(this.bokehPass.uniforms.focus, {
            value: 2.0,
            ease: "power2.inOut"
        }, "<");
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
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    tick() {
        requestAnimationFrame(this.tick.bind(this));

        // Floating Idle Animation
        if (this.tent) {
            const elapsedTime = this.clock.getElapsedTime();
            this.tent.position.y = -1.5 + Math.sin(elapsedTime * 1.5) * 0.03;
        }

        // Use Composer instead of standard render for Bokeh depth of field
        this.composer.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.marsCartTent = new MarsCartTent();
});
