// js/three-bg.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // Scene Setup - Transparent background so CSS background-image shows through!
    const scene = new THREE.Scene();
    
    // Camera Setup
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 30, 80);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); 
    // Ensure transparent background
    renderer.setClearColor(0x000000, 0);

    // Dotted Wave Generation
    const SEPARATION = 2.5;
    const AMOUNTX = 150;
    const AMOUNTY = 60;
    
    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
            positions[i + 1] = 0; // y
            positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z
            scales[j] = 1;
            i += 3;
            j++;
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create a circular glowing sprite for the points
    const canvasPoint = document.createElement('canvas');
    canvasPoint.width = 64;
    canvasPoint.height = 64;
    const ctx = canvasPoint.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(100, 150, 255, 0.8)'); // Premium Blue glow
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvasPoint);

    const material = new THREE.PointsMaterial({
        size: 1.8,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        color: 0x4a8cff, // Bright premium blue
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse Interaction
    let mouse = new THREE.Vector2(0, 0);
    let targetMouse = new THREE.Vector2(0, 0);
    const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

    document.addEventListener('mousemove', (event) => {
        targetMouse.x = (event.clientX - windowHalf.x) / windowHalf.x;
        targetMouse.y = -(event.clientY - windowHalf.y) / windowHalf.y;
    });

    // Animation Loop
    let count = 0;
    const tick = () => {
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;

        // Wave Mathematics
        const positions = particles.geometry.attributes.position.array;
        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                // Intersecting sine waves for organic fluid motion
                positions[i + 1] = (Math.sin((ix + count) * 0.3) * 4) +
                                   (Math.sin((iy + count) * 0.5) * 4);
                i += 3;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Subtle camera parallax
        camera.position.x += (mouse.x * 20 - camera.position.x) * 0.05;
        camera.position.y += (-mouse.y * 10 + 20 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        count += 0.03;
    }
    
    // Performance Optimization
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0 });
    observer.observe(canvas);

    const animationLoop = () => {
        if (isVisible) {
            tick();
        }
        window.requestAnimationFrame(animationLoop);
    };
    animationLoop();

    // Resize Handler
    window.addEventListener('resize', () => {
        windowHalf.set(window.innerWidth / 2, window.innerHeight / 2);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
