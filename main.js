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

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x667eea, 2, 100);
pointLight.position.set(-5, 3, 3);
scene.add(pointLight);

// Create robotic arm components
const armMaterial = new THREE.MeshStandardMaterial({
    color: 0x667eea,
    metalness: 0.7,
    roughness: 0.2
});

const jointMaterial = new THREE.MeshStandardMaterial({
    color: 0x764ba2,
    metalness: 0.8,
    roughness: 0.3
});

// Base
const baseGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.3, 32);
const base = new THREE.Mesh(baseGeometry, jointMaterial);
base.position.set(-2, -1, 0);
scene.add(base);

// Arm segment 1 (lower arm)
const arm1Geometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
const arm1 = new THREE.Mesh(arm1Geometry, armMaterial);
arm1.position.set(-2, 0, 0);
scene.add(arm1);

// Joint 1
const joint1Geometry = new THREE.SphereGeometry(0.25, 32, 32);
const joint1 = new THREE.Mesh(joint1Geometry, jointMaterial);
joint1.position.set(-2, 1, 0);
scene.add(joint1);

// Arm segment 2 (upper arm)
const arm2Geometry = new THREE.CylinderGeometry(0.12, 0.12, 1.5, 16);
const arm2 = new THREE.Mesh(arm2Geometry, armMaterial);
arm2.position.set(-1, 1.5, 0);
scene.add(arm2);

// Joint 2
const joint2Geometry = new THREE.SphereGeometry(0.2, 32, 32);
const joint2 = new THREE.Mesh(joint2Geometry, jointMaterial);
joint2.position.set(-1, 2.25, 0);
scene.add(joint2);

// End effector (spoon holder)
const spoonHolderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16);
const spoonHolder = new THREE.Mesh(spoonHolderGeometry, armMaterial);
spoonHolder.position.set(-0.5, 2.5, 0);
scene.add(spoonHolder);

// Spoon
const spoonHandleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 16);
const spoonHandleMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.9,
    roughness: 0.1
});
const spoonHandle = new THREE.Mesh(spoonHandleGeometry, spoonHandleMaterial);
spoonHandle.position.set(-0.5, 2.9, 0);
scene.add(spoonHandle);

const spoonBowlGeometry = new THREE.SphereGeometry(0.15, 32, 32);
const spoonBowl = new THREE.Mesh(spoonBowlGeometry, spoonHandleMaterial);
spoonBowl.position.set(-0.5, 3.3, 0);
spoonBowl.scale.set(1, 0.5, 1);
scene.add(spoonBowl);

// Create simple person head outline
const headGeometry = new THREE.SphereGeometry(0.6, 32, 32);
const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xffdbac,
    metalness: 0.1,
    roughness: 0.8
});
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(2, 1.5, 0);
scene.add(head);

// Mouth indicator
const mouthGeometry = new THREE.TorusGeometry(0.15, 0.05, 16, 32);
const mouthMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b6b,
    emissive: 0xff6b6b,
    emissiveIntensity: 0.3
});
const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
mouth.position.set(2, 1.3, 0.5);
mouth.rotation.x = Math.PI / 2;
scene.add(mouth);

// Add particles for visual effect
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 200;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x667eea,
    transparent: true,
    opacity: 0.6
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Scroll Animation Variables
let scrollY = window.scrollY;
const sections = document.querySelectorAll('.section');

// Update scroll position
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation function
function animateOnScroll() {
    // Calculate scroll progress (0 to 1)
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollY / scrollHeight, 1);
    
    // Animate camera
    camera.position.y = 1 - scrollProgress * 0.5;
    camera.position.z = 5 - scrollProgress * 1;
    
    // Rotate base slightly as we scroll
    base.rotation.y = scrollProgress * Math.PI * 0.3;
    
    // Animate arm segments based on scroll
    // Start position: arm down
    // End position: arm extended toward mouth
    
    // Arm 1 rotation (lift up)
    const arm1TargetRotation = scrollProgress * Math.PI * 0.4;
    arm1.rotation.z = THREE.MathUtils.lerp(arm1.rotation.z, arm1TargetRotation, 0.1);
    
    // Update arm1 position to pivot from base
    const arm1PivotOffset = Math.sin(arm1.rotation.z) * 1;
    arm1.position.x = -2 + arm1PivotOffset * 0.5;
    arm1.position.y = Math.cos(arm1.rotation.z) * 1;
    
    // Arm 2 rotation and position (extend toward person)
    const arm2TargetRotation = scrollProgress * Math.PI * 0.5;
    arm2.rotation.z = THREE.MathUtils.lerp(arm2.rotation.z, arm2TargetRotation, 0.1);
    
    // Update joint1 and arm2 positions
    joint1.position.x = arm1.position.x + Math.cos(arm1.rotation.z) * 1;
    joint1.position.y = arm1.position.y + Math.sin(arm1.rotation.z) * 1;
    
    arm2.position.x = joint1.position.x + Math.cos(arm1.rotation.z + arm2.rotation.z) * 0.75;
    arm2.position.y = joint1.position.y + Math.sin(arm1.rotation.z + arm2.rotation.z) * 0.75;
    
    // Update joint2, spoon holder, and spoon positions
    joint2.position.x = arm2.position.x + Math.cos(arm1.rotation.z + arm2.rotation.z) * 0.75;
    joint2.position.y = arm2.position.y + Math.sin(arm1.rotation.z + arm2.rotation.z) * 0.75;
    
    spoonHolder.position.x = joint2.position.x + Math.cos(arm1.rotation.z + arm2.rotation.z) * 0.3;
    spoonHolder.position.y = joint2.position.y + Math.sin(arm1.rotation.z + arm2.rotation.z) * 0.3;
    
    spoonHandle.position.x = spoonHolder.position.x;
    spoonHandle.position.y = spoonHolder.position.y + 0.4;
    spoonHandle.rotation.z = arm1.rotation.z + arm2.rotation.z;
    
    spoonBowl.position.x = spoonHandle.position.x + Math.sin(spoonHandle.rotation.z) * 0.4;
    spoonBowl.position.y = spoonHandle.position.y + Math.cos(spoonHandle.rotation.z) * 0.4;
    
    // Make mouth glow more as spoon approaches
    if (scrollProgress > 0.7) {
        const approachProgress = (scrollProgress - 0.7) / 0.3;
        mouthMaterial.emissiveIntensity = 0.3 + approachProgress * 0.5;
        mouth.scale.setScalar(1 + approachProgress * 0.2);
    } else {
        mouthMaterial.emissiveIntensity = 0.3;
        mouth.scale.setScalar(1);
    }
    
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
    
    // Subtle floating animation
    const time = Date.now() * 0.001;
    head.position.y = 1.5 + Math.sin(time * 0.5) * 0.05;
    mouth.position.y = 1.3 + Math.sin(time * 0.5) * 0.05;
    
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

console.log('🤖 Assistive Feeding Device - 3D Visualization Loaded');
console.log('Scroll down to see the robotic arm move toward the person\'s mouth!');
