// Preloader Logic
const preloader = document.getElementById('preloader');
const counter = document.querySelector('.preloader-counter');
const bar = document.querySelector('.preloader-bar');
const status = document.querySelector('.preloader-status');

let progress = 0;
const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 1;
    if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        revealWebsite();
    }
    counter.innerText = progress.toString().padStart(2, '0');
    bar.style.width = progress + '%';

    if (progress > 80) status.innerText = "BYPASSING FIREWALLS...";
    else if (progress > 50) status.innerText = "DECRYPTING ASSETS...";
    else if (progress > 20) status.innerText = "SYNCING INTERFACE...";
}, 50);

function revealWebsite() {
    const loaderTl = gsap.timeline();

    loaderTl.to('.preloader-content', {
        opacity: 0,
        y: -50,
        duration: 0.5
    })
        .to(preloader, {
            scale: 2,
            opacity: 0,
            display: 'none',
            duration: 1,
            ease: "power4.inOut"
        }, "+=0.2")
        .call(() => {
            // Start Hero Animations
            startHeroAnimation();
        });
}

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Pause scroll during preloader
lenis.stop();

// GSAP ScrollTrigger Integration with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Custom Cursor Physics
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let posX = 0, posY = 0;
let fX = 0, fY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

gsap.to({}, 0.016, {
    repeat: -1,
    onRepeat: () => {
        posX += (mouseX - posX) / 5;
        posY += (mouseY - posY) / 5;
        fX += (mouseX - fX) / 10;
        fY += (mouseY - fY) / 10;

        gsap.set(cursor, { css: { left: posX, top: posY } });
        gsap.set(follower, { css: { left: fX - 15, top: fY - 15 } });
    }
});

// Hero Section Animations Wrapped in Function
function startHeroAnimation() {
    lenis.start();

    const tl = gsap.timeline();

    tl.from('.header', {
        opacity: 0,
        y: -20,
        duration: 1
    })
        .from('.title-row .row, .title-row .title', {
            y: 150,
            skewY: 10,
            duration: 1.5,
            stagger: 0.2,
            ease: "power4.out"
        }, "-=0.5")
        .from('.hero-tagline', {
            opacity: 0,
            y: 20,
            duration: 1
        }, "-=1")
        .from('.hero-bio', {
            opacity: 0,
            x: -30,
            duration: 1
        }, "-=0.8");
}

// Scroll Animations - Project Parallax
document.querySelectorAll('.project-item').forEach(item => {
    const speed = item.getAttribute('data-speed');
    gsap.to(item, {
        y: -100 * speed,
        scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// Marquee Control
gsap.to('.marquee-content', {
    xPercent: -50,
    ease: "none",
    scrollTrigger: {
        trigger: ".immersive-text",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    }
});

// Cursor Interactions
document.querySelectorAll('a, .project-cursor-area').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(follower, { scale: 2, backgroundColor: 'rgba(255,255,255,0.1)', duration: 0.3 });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(follower, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
    });
});

// Mobile Menu Logic
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');
const header = document.querySelector('.header');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        header.classList.toggle('menu-open');
        mobileNav.classList.toggle('active');
        
        // Locking Scroll when menu is open
        if (mobileNav.classList.contains('active')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });
}

// Close menu when a link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        header.classList.remove('menu-open');
        mobileNav.classList.remove('active');
        lenis.start();
    });
});

// Three.js Background Implementation
function initThreeJS() {
    const hero = document.querySelector('.hero-bg');
    if (!hero) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    hero.appendChild(renderer.domElement);

    // Create Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 3;

    // Mouse Movement Interaction
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
        requestAnimationFrame(animate);

        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;

        // Smoothly move particles towards mouse
        particles.position.x += (mouseX * 0.5 - particles.position.x) * 0.05;
        particles.position.y += (mouseY * 0.5 - particles.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

initThreeJS();

// Data Model
let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || {
    projects: [
        {
            id: 1,
            title: "CourtFlow AI",
            desc: "AI-powered legal platform for hearing duration prediction and automated scheduling.",
            year: "2026",
            cat: "Legal Tech AI",
            link: "https://github.com/EklavyajhaAI07/CourtFlow-x-PUCODE3.0",
            img: "https://i.postimg.cc/jqQqHDVW/Screenshot-2026-01-24-004731.png",
            gradient: "linear-gradient(rgba(67, 67, 247, 0.7), rgba(134, 228, 240, 0.7))"
        },
        {
            id: 2,
            title: "FinPB Agent",
            desc: "Intelligent Analysis Engine for financial data processing and insights.",
            year: "2026",
            cat: "Analysis Engine",
            link: "https://github.com/EklavyajhaAI07/Analysis-Agent-FinPB",
            img: "https://i.postimg.cc/cHjsHnP6/Screenshot_2026_02_25_113330.png",
            gradient: "linear-gradient(rgba(245, 87, 224, 0.7), rgba(145, 240, 134, 0.7))"
        },
        {
            id: 3,
            title: "FinPlay Bharat",
            desc: "Educational platform for financial literacy and interactive learning.",
            year: "2026",
            cat: "FinTech",
            link: "https://github.com/EklavyajhaAI07/FinPlay-Bharat",
            img: "https://i.postimg.cc/9fg4dzs6/Screenshot-2026-02-15-212202.png",
            gradient: "linear-gradient(rgba(245, 87, 90, 0.7), rgba(236, 247, 118, 0.7))"
        },
        {
            id: 4,
            title: "Eklavya Group Tution",
            desc: "Official website for mathematical excellence coaching in Ahmedabad.",
            year: "2026",
            cat: "Education",
            link: "https://github.com/EklavyajhaAI07/eklavya-group-tution-website",
            img: "https://i.postimg.cc/RF8MFH26/Screenshot_2026_02_25_113508.png",
            gradient: "linear-gradient(rgba(248, 53, 19, 0.7), rgba(117, 240, 187, 0.7))"
        }
    ],
    skills: [
        {
            id: 1,
            icon: "code-2",
            title: "Web Development",
            desc: "Building scalable, responsive, and high-performance applications with modern stacks."
        },
        {
            id: 2,
            icon: "zap",
            title: "Vibe Coding",
            desc: "Leveraging agentic workflows and rapid prototyping to turn ideas into code at light speed."
        },
        {
            id: 3,
            icon: "brain-circuit",
            title: "AI Explorer",
            desc: "Researching Neural Networks, LLM fine-tuning, and integrating AI into functional systems."
        },
        {
            id: 4,
            icon: "terminal",
            title: "Applied Systems",
            desc: "Bridging the gap between complex algorithms and real-world business solutions."
        }
    ],
    stack: ["JS", "Python", "Java", "React", "Node", "Django", "Git", "DBs", "Vercel", "Prompting", "Next.js", "Supabase", "AI", "Assistants", "PyTorch", "TF", "Transformers", "APIs", "GPU tools", "Microservices", "AWS", "CI/CD"]
};

let isAdmin = false;

// Rendering Logic
function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    // Kill old ScrollTriggers for projects
    ScrollTrigger.getAll().forEach(st => {
        if (st.trigger && st.trigger.classList && st.trigger.classList.contains('project-item')) {
            st.kill();
        }
    });

    container.innerHTML = '';

    portfolioData.projects.forEach((proj, index) => {
        const isAlt = index % 2 !== 0;
        const projectHTML = `
            <article class="project-item ${isAlt ? 'alt' : ''}" data-speed="${isAlt ? '0.1' : '0.05'}">
                <div class="project-link">
                    <a href="${proj.link}" target="_blank">
                        <div class="project-cursor-area">
                            <div class="project-media">
                                <div class="media-box"
                                    style="background-image: ${proj.gradient}, url('${proj.img}');">
                                    <span class="project-label">Project ${String(index + 1).padStart(2, '0')}</span>
                                </div>
                            </div>
                            <div class="project-info">
                                <div class="info-top">
                                    <span class="year">${proj.year}</span>
                                    <span class="cat">${proj.cat}</span>
                                </div>
                                <h3 class="project-title">${proj.title}</h3>
                                <h4 class="project-desc">${proj.desc}</h4>
                            </div>
                        </div>
                    </a>
                    ${isAdmin ? `<div class="admin-controls">
                        <button class="admin-btn delete" onclick="deleteProject(${proj.id})">Delete Project</button>
                    </div>` : ''}
                </div>
            </article>
        `;
        container.innerHTML += projectHTML;
    });

    // Re-initialize parallax for new elements
    document.querySelectorAll('.project-item').forEach(item => {
        const speed = item.getAttribute('data-speed');
        gsap.to(item, {
            y: -100 * speed,
            scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    ScrollTrigger.refresh();
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;
    container.innerHTML = '';

    portfolioData.skills.forEach(skill => {
        const skillHTML = `
            <div class="skill-card">
                <div class="skill-icon"><i data-lucide="${skill.icon}"></i></div>
                <h3>${skill.title}</h3>
                <h4>${skill.desc}</h4>
                ${isAdmin ? `<div class="admin-controls">
                    <button class="admin-btn delete" onclick="deleteSkill(${skill.id})">Delete Skill</button>
                </div>` : ''}
            </div>
        `;
        container.innerHTML += skillHTML;
    });
    if (window.lucide) lucide.createIcons();
}

function renderStack() {
    const container = document.getElementById('stack-container');
    if (!container) return;
    container.innerHTML = '';

    portfolioData.stack.forEach((tech, index) => {
        const tagHTML = `
            <div style="display: inline-block; position: relative;">
                <span class="stack-tag">${tech}</span>
                ${isAdmin ? `<button onclick="deleteStack(${index})" style="position: absolute; top: -5px; right: -5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; z-index: 5;">X</button>` : ''}
            </div>
        `;
        container.innerHTML += tagHTML;
    });
}

function renderAdminButtons() {
    const projBtnContainer = document.getElementById('add-project-btn-container');
    const skillBtnContainer = document.getElementById('add-skill-btn-container');
    const stackBtnContainer = document.getElementById('add-stack-btn-container');

    if (isAdmin) {
        if (projBtnContainer) projBtnContainer.innerHTML = `<button class="admin-btn" onclick="addProject()" style="margin-top: 2rem;">Add New Project</button>`;
        if (skillBtnContainer) skillBtnContainer.innerHTML = `<button class="admin-btn" onclick="addSkill()" style="margin-top: 2rem;">Add New Skill</button>`;
        if (stackBtnContainer) stackBtnContainer.innerHTML = `
            <input type="text" id="new-stack-item" placeholder="New Tech" style="padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border); background: var(--glass); color: var(--fg); margin-right: 1rem;">
            <button class="admin-btn" onclick="addStack()">Add Tech</button>
        `;
    } else {
        if (projBtnContainer) projBtnContainer.innerHTML = '';
        if (skillBtnContainer) skillBtnContainer.innerHTML = '';
        if (stackBtnContainer) stackBtnContainer.innerHTML = '';
    }
}

function renderAll() {
    renderProjects();
    renderSkills();
    renderStack();
    renderAdminButtons();
}

// Auth Logic
const loginTrigger = document.getElementById('login-trigger');
const loginModal = document.getElementById('login-modal');
const loginSubmit = document.getElementById('login-submit');
const loginClose = document.getElementById('login-close');
const adminEmailInput = document.getElementById('admin-email');
const loginError = document.getElementById('login-error');

const ALLOWED_ADMIN = "eklavyaprivate22@gmail.com";

if (loginTrigger) {
    loginTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });
}

if (loginClose) {
    loginClose.addEventListener('click', () => {
        loginModal.style.display = 'none';
        loginError.style.display = 'none';
    });
}

if (loginSubmit) {
    loginSubmit.addEventListener('click', () => {
        const email = adminEmailInput.value;
        if (email === ALLOWED_ADMIN) {
            isAdmin = true;
            loginModal.style.display = 'none';
            adminEmailInput.value = '';
            renderAll();
            alert('Welcome Admin!');
        } else {
            loginError.style.display = 'block';
        }
    });
}

// Initial Render
document.addEventListener('DOMContentLoaded', renderAll);

// CRUD Actions
window.deleteProject = (id) => {
    portfolioData.projects = portfolioData.projects.filter(p => p.id !== id);
    saveAndRender();
};

window.addProject = () => {
    const title = prompt("Project Title:");
    if (!title) return;
    const desc = prompt("Project Description:");
    const year = prompt("Year:", "2026");
    const cat = prompt("Category:");
    const link = prompt("GitHub Link:");
    const img = prompt("Image URL:");
    const gradient = prompt("Gradient (optional):", "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))");

    const newProj = {
        id: Date.now(),
        title, desc, year, cat, link, img, gradient
    };

    portfolioData.projects.push(newProj);
    saveAndRender();
};

window.deleteSkill = (id) => {
    portfolioData.skills = portfolioData.skills.filter(s => s.id !== id);
    saveAndRender();
};

window.addSkill = () => {
    const title = prompt("Skill Title:");
    if (!title) return;
    const icon = prompt("Lucide Icon Name (e.g., zap, code-2, brain-circuit):", "zap");
    const desc = prompt("Skill Description:");

    const newSkill = {
        id: Date.now(),
        icon, title, desc
    };

    portfolioData.skills.push(newSkill);
    saveAndRender();
};

window.addStack = () => {
    const input = document.getElementById('new-stack-item');
    if (input && input.value) {
        portfolioData.stack.push(input.value);
        input.value = '';
        saveAndRender();
    }
};

window.deleteStack = (index) => {
    portfolioData.stack.splice(index, 1);
    saveAndRender();
};

function saveAndRender() {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    renderAll();
}

console.log('Virtualization & Visualization Engine Loaded');
