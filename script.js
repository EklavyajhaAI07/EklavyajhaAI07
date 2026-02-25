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

console.log('Virtualization & Visualization Engine Loaded');
