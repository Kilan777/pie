// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera positioning
camera.position.z = 5;
camera.position.y = 1;

// Add ONLY particles/stars for visual effect
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500; // More stars
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x667eea,
    transparent: true,
    opacity: 0.8
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Scroll Animation Variables
let scrollY = window.scrollY;

// Update scroll position
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation function
function animateOnScroll() {
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollY / scrollHeight, 1);
    
    // Animate camera
    camera.position.y = 1 - scrollProgress * 0.5;
    camera.position.z = 5 - scrollProgress * 1;
    
    // Rotate particles
    particlesMesh.rotation.y = scrollProgress * Math.PI * 2;
    particlesMesh.rotation.x = scrollProgress * Math.PI;
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

console.log('✨ Stars background loaded');