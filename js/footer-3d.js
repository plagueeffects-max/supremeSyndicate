// js/footer-3d.js
document.addEventListener('DOMContentLoaded', () => {
    // Skip WebGL on iOS — InstancedMesh + shadow maps are too GPU-intensive on
    // mobile hardware and cause scroll jank throughout the page.
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) return;

    const canvas = document.getElementById('footer-webgl-canvas');
    if (!canvas) return;

    const container = document.querySelector('.footer-premium');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x02050a, 40, 75); // Fade perfectly into the CSS gradient background

    // Camera
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 50); // Pulled back slightly for better framing

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Awwwards-tier Dramatic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5); // Reduced from 2.0 to prevent blowout
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 100;
    // Widen shadow camera to cover the whole grid
    dirLight.shadow.camera.left = -60;
    dirLight.shadow.camera.right = 60;
    dirLight.shadow.camera.top = 60;
    dirLight.shadow.camera.bottom = -60;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x1a63ff, 1.2); // Saturated blue fill
    fillLight.position.set(-20, -10, 10);
    scene.add(fillLight);

    // Ball Geometry
    const radius = 0.85; // Increased from 0.6 for larger balls
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    
    // Solid, premium satin-finish physical material
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.2, // Satin/matte finish
        metalness: 0.1, 
        clearcoat: 0.8, // Elegant clearcoat
        clearcoatRoughness: 0.1,
    });

    // Dynamic Edge-to-Edge Grid Calculation
    const spacingX = radius * 2.0; 
    const spacingY = radius * 1.732; 

    // Calculate exact width/height needed to fill the screen at Z=0
    const fovRad = (camera.fov * Math.PI) / 180;
    const heightAtZ = 2 * Math.tan(fovRad / 2) * Math.abs(camera.position.z);
    const widthAtZ = heightAtZ * camera.aspect;

    // Over-calculate by 10% to ensure no edge gaps
    const gridX = Math.ceil(widthAtZ / spacingX) + 12;
    const gridY = Math.ceil(heightAtZ / spacingY) + 12;
    const count = gridX * gridY;

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    const dummy = new THREE.Object3D();
    
    const targetPositions = new Float32Array(count * 3);
    const startPositions = new Float32Array(count * 3);
    
    const brandBlue = new THREE.Color('#1a63ff');
    const brandWhite = new THREE.Color('#d1d9e6'); // Softer silver-white so 3D shading is visible

    // -------------------------------------------------------------
    // EXACT 1:1 LOGO MAPPING
    // -------------------------------------------------------------
    const logoImg = new Image();
    logoImg.src = 'Assets/Logo.svg';
    
    logoImg.onload = () => {
        const maskSize = 256; 
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = maskSize;
        maskCanvas.height = maskSize;
        const ctx = maskCanvas.getContext('2d', { willReadFrequently: true });
        
        // Logo.svg is 203x64. The icon is exactly the left 64x64 square.
        // We crop just the icon and scale it up to fill the mask canvas.
        ctx.drawImage(logoImg, 0, 0, 64, 64, 0, 0, maskSize, maskSize);
        const imgData = ctx.getImageData(0, 0, maskSize, maskSize).data;

        let i = 0;
        const offsetX = (gridX * spacingX) / 2;
        const offsetY = (gridY * spacingY) / 2;
        
        // Dynamically scale logo so it always looks elegant, never cramped
        const logoScale = Math.min(heightAtZ * 0.90, 45); // Increased from 0.7 to 0.90 for a much bigger logo

        for (let y = 0; y < gridY; y++) {
            for (let x = 0; x < gridX; x++) {
                const xPos = (x * spacingX) - offsetX + (y % 2 === 0 ? 0 : spacingX / 2);
                const yPos = (y * spacingY) - offsetY;
                
                targetPositions[i * 3] = xPos;
                targetPositions[i * 3 + 1] = yPos;
                targetPositions[i * 3 + 2] = 0;

                // Physics start positions: massive depth scattering
                startPositions[i * 3] = xPos + (Math.random() - 0.5) * 80;
                startPositions[i * 3 + 1] = yPos + (Math.random() - 0.5) * 80;
                startPositions[i * 3 + 2] = (Math.random() - 0.5) * 60 + 20; 

                // Shift logo slightly more to the left, but not so far that it clips off-screen
                const logoOffsetX = -widthAtZ * 0.28; // 28% left of center
                let u = ((xPos - logoOffsetX) / logoScale) + 0.5;
                let v = (-yPos / logoScale) + 0.5; 
                
                let isLogoPart = false;

                if (u >= 0 && u < 1 && v >= 0 && v < 1) {
                    const px = Math.floor(u * maskSize);
                    const py = Math.floor(v * maskSize);
                    const index = (py * maskSize + px) * 4;
                    const alpha = imgData[index + 3];
                    if (alpha > 128) isLogoPart = true;
                }
                
                mesh.setColorAt(i, isLogoPart ? brandWhite : brandBlue);
                i++;
            }
        }
        
        mesh.instanceColor.needsUpdate = true;
        scene.add(mesh);
        startAnimation();
    };

    logoImg.onerror = () => { console.error("Logo load failed"); };

    function startAnimation() {
        const animState = { progress: 0 };
        
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".footer-premium",
                    start: "top 80%",
                    toggleActions: "play none none reverse" 
                }
            });

            // 1. Assemble the 3D Logo
            tl.to(animState, {
                progress: 1,
                duration: 3.0,
                ease: "expo.out"
            });

            // 2. Cinematic Reveal for the Massive Text Watermark (overlapping the end of the logo assembly)
            tl.fromTo(".footer-massive-text",
                { opacity: 0, y: 30, filter: "blur(15px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power3.out" },
                "-=1.5"
            );
        }

        // Performance Optimization: Only run heavy WebGL loop when footer is visible
        let isVisible = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
            });
        }, { threshold: 0 });
        observer.observe(container);

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            if (!isVisible) return; // Save CPU/GPU when off-screen

            const time = clock.getElapsedTime();
            const p = animState.progress;

            for (let j = 0; j < count; j++) {
                const sx = startPositions[j * 3];
                const sy = startPositions[j * 3 + 1];
                const sz = startPositions[j * 3 + 2];

                const tx = targetPositions[j * 3];
                const ty = targetPositions[j * 3 + 1];
                const tz = targetPositions[j * 3 + 2];

                // Premium organic liquid wave flowing across the grid
                const waveZ = Math.sin(tx * 0.15 + time * 1.2) * Math.cos(ty * 0.15 + time * 1.2) * 1.2;

                // Smooth assembly with the organic wave added at the end
                const cx = sx + (tx - sx) * p;
                const cy = sy + (ty - sy) * p;
                const cz = sz + (tz + (waveZ * p) - sz) * p;

                dummy.position.set(cx, cy, cz);
                
                // Rotation adds to the premium feel
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
});
