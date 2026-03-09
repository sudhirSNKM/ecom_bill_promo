import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* ============================================================
   MARSCART — 3D Scene / Role-Based State Manager
   ============================================================ */

class MarsCart3D {
    constructor() {
        this.canvas = document.querySelector('#webgl-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 5);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.activeModel = null;
        this.models = {};

        // Mouse Pos for Parallax
        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

        this.receiptParams = { progress: 0 };

        this.setupLighting();
        this.initMockModels();

        // We start by assuming Customer role for the landing page
        this.loadRoleModel('customer');

        this.setupGSAPScroll();
        this.setupLenis();

        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Start loop
        this.clock = new THREE.Clock();
        this.tick();
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
        dirLight.position.set(2, 5, 3);
        this.scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0xD0E84D, 0.8);
        fillLight.position.set(-2, 0, -3);
        this.scene.add(fillLight);
    }

    /* 
     Since we don't have actual .glb files provided yet, 
     we generate procedural mockups to demonstrate the Role-Based logic 
    */
    initMockModels() {
        // 1. Customer Luxury Model (Smooth, High Polish)
        const luxuryGeo = new THREE.TorusKnotGeometry(0.8, 0.25, 128, 32);
        const luxuryMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.1,
            metalness: 0.8
        });
        this.models['customer'] = new THREE.Mesh(luxuryGeo, luxuryMat);

        // 2. Branch Technical Model (Wireframe / Exploded Feel)
        const techGeo = new THREE.IcosahedronGeometry(1.2, 1);
        const techMat = new THREE.MeshBasicMaterial({
            color: 0xD0E84D,
            wireframe: true
        });
        this.models['branch'] = new THREE.Mesh(techGeo, techMat);

        // 3. Admin Heatmap Model (Low Poly, Colored)
        const adminGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const adminMat = new THREE.MeshNormalMaterial();
        this.models['admin'] = new THREE.Mesh(adminGeo, adminMat);

        // 4. FinTech Receipt Model (Canvas Texture)
        this.createReceiptModel();
    }

    createReceiptModel() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Draw Receipt Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 512, 1024);

        // Draw Text
        ctx.fillStyle = '#111111';
        ctx.font = 'bold 60px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('MarsCart Receipt', 256, 120);

        ctx.font = 'normal 40px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('Item: Luxury Chair', 40, 300);
        ctx.fillText('Tax (18%): ₹4,499', 40, 400);

        ctx.fillStyle = '#D0E84D'; // Lime
        ctx.fillRect(40, 500, 432, 100);
        ctx.fillStyle = '#111111';
        ctx.font = 'bold 50px Inter';
        ctx.fillText('TOTAL:  ₹29,498', 60, 565);

        const texture = new THREE.CanvasTexture(canvas);
        const geo = new THREE.PlaneGeometry(1.5, 3);
        const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

        this.receiptMesh = new THREE.Mesh(geo, mat);
        this.receiptMesh.rotation.set(-0.2, 0.4, 0.1);
        this.receiptMesh.position.set(0, -6, -2); // Start hidden below
        this.scene.add(this.receiptMesh);
    }

    loadRoleModel(role) {
        if (this.activeModel) {
            this.scene.remove(this.activeModel);
        }

        this.activeModel = this.models[role] || this.models['customer'];
        this.activeModel.rotation.set(0, 0, 0);
        this.activeModel.position.set(1.5, 0, 0); // Position it on right side for hero

        this.scene.add(this.activeModel);

        // Re-bind scroll trigger animation for the new model
        this.setupGSAPScroll();
    }

    setupGSAPScroll() {
        if (!this.activeModel || typeof gsap === 'undefined') return;

        // Clear old ScrollTriggers if switching models
        ScrollTrigger.getAll().forEach(t => t.kill());

        // Main scroll timeline for the 3D Object
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#main-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1 // smooth scrubbing
            }
        });

        // Animate rotation & position based on scroll depth
        tl.to(this.activeModel.rotation, {
            y: Math.PI * 4,
            x: Math.PI * 0.5,
            ease: "none"
        }, 0);

        // Move model across screen as we scroll down
        tl.to(this.activeModel.position, {
            y: -2,
            x: -1.5,
            ease: "none"
        }, 0);

        // FinTech Billing Animation:
        // When hitting the 'shopping' section, shrink chair, slide in receipt
        ScrollTrigger.create({
            trigger: '#shopping',
            start: 'top center',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
                // Shrink active model
                const s = 1 - (self.progress * 0.8);
                this.activeModel.scale.set(s, s, s);

                // Fly in receipt
                this.receiptMesh.position.y = -6 + (self.progress * 6);
                this.receiptMesh.rotation.y = 0.4 - (self.progress * 0.4);
            }
        });
    }

    setupLenis() {
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            // Sync GSAP ScrollTrigger with Lenis
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
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    onMouseMove(e) {
        // Map mouse position to -1 to 1 space
        this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    tick() {
        requestAnimationFrame(this.tick.bind(this));

        if (this.activeModel) {
            // Idle float animation
            const elapsedTime = this.clock.getElapsedTime();
            this.activeModel.position.y += Math.sin(elapsedTime * 2) * 0.001;

            // Mouse Parallax (Ease towards target)
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

            this.activeModel.rotation.x += this.mouse.y * 0.01;
            this.activeModel.rotation.y += this.mouse.x * 0.01;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.marsCart3D = new MarsCart3D();
});
