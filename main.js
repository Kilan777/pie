// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Hide canvas initially (hero section only shows video)
canvas.style.opacity = '0';

// Camera positioning
camera.position.z = 5;
camera.position.y = 1;

// Add particles for visual effect (STARS!)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.025,
    color: 0x667eea,
    transparent: true,
    opacity: 0.8
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Scroll Animation Variables
let scrollY = window.scrollY;
const heroSection = document.querySelector('.hero');

// Update scroll position and canvas visibility
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

    // Show/hide 3D canvas based on scroll position
    // Only show after scrolling past hero section
    if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const scrollPastHero = scrollY / heroHeight;

        if (scrollPastHero > 0.7) {
            // Fade in canvas as we approach end of hero section
            const fadeProgress = Math.min((scrollPastHero - 0.7) / 0.3, 1);
            canvas.style.opacity = fadeProgress.toString();
        } else {
            // Keep canvas hidden in hero section
            canvas.style.opacity = '0';
        }
    }
});

// Animation function
function animateOnScroll() {
    // Calculate scroll progress (0 to 1)
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollY / scrollHeight, 1);

    // Animate camera
    camera.position.y = 1 - scrollProgress * 0.5;
    camera.position.z = 5 - scrollProgress * 1;

    // Rotate particles
    particlesMesh.rotation.y = scrollProgress * Math.PI * 2;
    particlesMesh.rotation.x = scrollProgress * Math.PI;

    // Add subtle rotation to entire scene
    scene.rotation.y = Math.sin(scrollProgress * Math.PI) * 0.1;
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    animateOnScroll();
    renderer.render(scene, camera);
}

animate();

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('✨ Starfield background loaded');
