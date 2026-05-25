// js/footer-3d.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.footer-premium');
    if (!container) return;
    const canvas = document.getElementById('footer-webgl-canvas');
    if (!canvas) return;

    // Detect mobile so we can scale down GPU cost.
    // The IntersectionObserver below already prevents rendering when off-screen,
    // so the only expensive window is when the user is actually looking at the footer.
    const isMobile = window.innerWidth <= 768 ||
        /iPad|iPhone|iPod|Android/i.test(navigator.userAgent);

    // Set up an IntersectionObserver to lazy load Three.js when the footer is close to entering viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                observer.disconnect(); // Trigger loading only once
                loadThreeAndInit();
            }
        });
    }, { rootMargin: '1000px 0px 1000px 0px' }); // Trigger 1000px before coming into view

    observer.observe(container);

    function loadThreeAndInit() {
        if (window.THREE) {
            init3D();
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = init3D;
            script.onerror = () => console.error('Failed to load Three.js from CDN.');
            document.head.appendChild(script);
        }
    }

    function init3D() {
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x02050a, 40, 75);

        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 50);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: !isMobile,   // high-DPI mobile screens don't need AA
            alpha: true
        });
        renderer.setSize(window.innerWidth, container.clientHeight);
        // Cap at 1× on mobile — a 3× DPR screen at 1× still looks sharp
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));

        // Shadow maps require a full second render pass at 1024×1024 — skip on mobile
        renderer.shadowMap.enabled = !isMobile;
        if (!isMobile) renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lighting
        // Slightly brighter ambient on mobile to compensate for no shadow depth cues
        const ambientLight = new THREE.AmbientLight(0xffffff, isMobile ? 0.8 : 0.5);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(20, 40, 20);
        if (!isMobile) {
            dirLight.castShadow = true;
            dirLight.shadow.mapSize.width = 1024;
            dirLight.shadow.mapSize.height = 1024;
            dirLight.shadow.camera.near = 10;
            dirLight.shadow.camera.far = 100;
            dirLight.shadow.camera.left = -60;
            dirLight.shadow.camera.right = 60;
            dirLight.shadow.camera.top = 60;
            dirLight.shadow.camera.bottom = -60;
        }
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0x1a63ff, 1.2);
        fillLight.position.set(-20, -10, 10);
        scene.add(fillLight);

        // Ball geometry — halve segment count on mobile (16 vs 32 = 4× fewer vertices)
        const radius = 0.85;
        const seg = isMobile ? 16 : 32;
        const geometry = new THREE.SphereGeometry(radius, seg, seg);

        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.1,
            // clearcoat requires an extra GPU render pass — skip on mobile
            clearcoat: isMobile ? 0 : 0.8,
            clearcoatRoughness: 0.1,
        });

        // Dynamic edge-to-edge grid
        const spacingX = radius * 2.0;
        const spacingY = radius * 1.732;

        const fovRad = (camera.fov * Math.PI) / 180;
        const heightAtZ = 2 * Math.tan(fovRad / 2) * Math.abs(camera.position.z);
        const widthAtZ = heightAtZ * camera.aspect;

        // Slightly smaller padding on mobile — fewer total balls
        const pad = isMobile ? 8 : 12;
        const gridX = Math.ceil(widthAtZ / spacingX) + pad;
        const gridY = Math.ceil(heightAtZ / spacingY) + pad;
        const count = gridX * gridY;

        const mesh = new THREE.InstancedMesh(geometry, material, count);
        if (!isMobile) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        }

        const dummy = new THREE.Object3D();
        const targetPositions = new Float32Array(count * 3);
        const startPositions = new Float32Array(count * 3);

        const brandBlue = new THREE.Color('#1a63ff');
        const brandWhite = new THREE.Color('#d1d9e6');

        const logoImg = new Image();
        logoImg.src = 'Assets/Logo.svg';

        logoImg.onload = () => {
            const maskSize = 256;
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = maskSize;
            maskCanvas.height = maskSize;
            const ctx = maskCanvas.getContext('2d', { willReadFrequently: true });

            ctx.drawImage(logoImg, 0, 0, 64, 64, 0, 0, maskSize, maskSize);
            const imgData = ctx.getImageData(0, 0, maskSize, maskSize).data;

            let i = 0;
            const offsetX = (gridX * spacingX) / 2;
            const offsetY = (gridY * spacingY) / 2;
            const logoScale = Math.min(heightAtZ * 0.90, 45);

            for (let y = 0; y < gridY; y++) {
                for (let x = 0; x < gridX; x++) {
                    const xPos = (x * spacingX) - offsetX + (y % 2 === 0 ? 0 : spacingX / 2);
                    const yPos = (y * spacingY) - offsetY;

                    targetPositions[i * 3]     = xPos;
                    targetPositions[i * 3 + 1] = yPos;
                    targetPositions[i * 3 + 2] = 0;

                    startPositions[i * 3]     = xPos + (Math.random() - 0.5) * 80;
                    startPositions[i * 3 + 1] = yPos + (Math.random() - 0.5) * 80;
                    startPositions[i * 3 + 2] = (Math.random() - 0.5) * 60 + 20;

                    const logoOffsetX = -widthAtZ * 0.28;
                    const u = ((xPos - logoOffsetX) / logoScale) + 0.5;
                    const v = (-yPos / logoScale) + 0.5;

                    let isLogoPart = false;
                    if (u >= 0 && u < 1 && v >= 0 && v < 1) {
                        const px = Math.floor(u * maskSize);
                        const py = Math.floor(v * maskSize);
                        const idx = (py * maskSize + px) * 4;
                        if (imgData[idx + 3] > 128) isLogoPart = true;
                    }

                    mesh.setColorAt(i, isLogoPart ? brandWhite : brandBlue);
                    i++;
                }
            }

            mesh.instanceColor.needsUpdate = true;
            scene.add(mesh);
            startAnimation();
        };

        logoImg.onerror = () => { console.error('Logo load failed'); };

        function startAnimation() {
            const animState = { progress: 0 };

            if (typeof gsap !== 'undefined') {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.footer-premium',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });

                tl.to(animState, {
                    progress: 1,
                    duration: 3.0,
                    ease: 'expo.out'
                });

                // blur() causes full-layer repaints every frame — skip on mobile
                if (isMobile) {
                    tl.fromTo('.footer-massive-text',
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' },
                        '-=1.5'
                    );
                } else {
                    tl.fromTo('.footer-massive-text',
                        { opacity: 0, y: 30, filter: 'blur(15px)' },
                        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' },
                        '-=1.5'
                    );
                }
            }

            // Only render while the footer is actually visible
            let isVisible = false;
            const innerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => { isVisible = entry.isIntersecting; });
            }, { threshold: 0 });
            innerObserver.observe(container);

            const clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);
                if (!isVisible) return;

                const time = clock.getElapsedTime();
                const p = animState.progress;

                for (let j = 0; j < count; j++) {
                    const sx = startPositions[j * 3];
                    const sy = startPositions[j * 3 + 1];
                    const sz = startPositions[j * 3 + 2];
                    const tx = targetPositions[j * 3];
                    const ty = targetPositions[j * 3 + 1];
                    const tz = targetPositions[j * 3 + 2];

                    const waveZ = Math.sin(tx * 0.15 + time * 1.2) *
                                  Math.cos(ty * 0.15 + time * 1.2) * 1.2;

                    const cx = sx + (tx - sx) * p;
                    const cy = sy + (ty - sy) * p;
                    const cz = sz + (tz + (waveZ * p) - sz) * p;

                    dummy.position.set(cx, cy, cz);
                    dummy.rotation.x = cy * 0.5 + time * 0.5;
                    dummy.rotation.y = cx * 0.5 + time * 0.5;
                    dummy.updateMatrix();
                    mesh.setMatrixAt(j, dummy.matrix);
                }

                mesh.instanceMatrix.needsUpdate = true;
                renderer.render(scene, camera);
            }

            animate();
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, container.clientHeight);
        });
    }
});
