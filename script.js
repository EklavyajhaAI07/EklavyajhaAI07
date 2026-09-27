const API_URL = document.documentElement.dataset.apiUrl || '';

const fallbackEntries = {
    project: [
        { title: 'mdgen-ai', description: 'AI-powered README generator for text, code, PDFs, images, PPTs, or a GitHub URL. 50+ users onboarded.', tags: 'PRODUCT, AI / README', link: 'https://github.com/EklavyajhaAI07/mdgen-ai' },
        { title: 'Viral AI', description: 'A 7-agent CrewAI content intelligence platform for trend discovery, hooks, captions, hashtags, thumbnails, and virality scoring.', tags: 'CRAFTATHON 2K26, CREWAI' },
        { title: 'CourtFlow AI', description: 'AI-powered court scheduling that predicts hearing durations and auto-allocates judges, courtrooms, and slots.', tags: 'PU CODE 3.0, LEGAL TECH AI', link: 'https://github.com/EklavyajhaAI07/CourtFlow-x-PUCODE3.0' },
        { title: 'FinPB Agent', description: 'A customizable conversational AI engine for financial learning and Q&A with bring-your-own provider support.', tags: 'FINPLAY BHARAT, ANALYSIS ENGINE', link: 'https://github.com/EklavyajhaAI07/Analysis-Agent-FinPB' }
    ],
    skill: [
        { title: 'AI / ML / LLM', description: 'PyTorch, TensorFlow, OpenCV, NumPy, Pandas, Hugging Face, and Ollama.' },
        { title: 'Agentic Systems', description: 'CrewAI, RAG and vector databases, n8n automation, and multi-agent workflows.' },
        { title: 'Product Engineering', description: 'React, Flutter, Django, Flask, Express, FastAPI, Firebase, and Supabase.' },
        { title: 'Core Tools', description: 'Python, TypeScript, C, C++, Git, GitHub, Linux, VS Code, Docker, and cloud deployment.' }
    ],
    stack: ['Python', 'TypeScript', 'PyTorch', 'React', 'FastAPI', 'Next.js', 'MongoDB', 'CrewAI', 'RAG / VectorDB', 'Docker', 'GCP']
};

function escapeHTML(value) {
    return String(value || '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

async function loadEntries(type) {
    if (!API_URL) return fallbackEntries[type];
    try {
        const response = await fetch(`${API_URL.replace(/\/$/, '')}/api/entries?type=${encodeURIComponent(type)}`);
        if (!response.ok) throw new Error(`Entry request failed: ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data : fallbackEntries[type];
    } catch (error) {
        console.warn(`Using fallback ${type} entries.`, error);
        return fallbackEntries[type];
    }
}

function renderProjects(entries) {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = entries.map((entry, index) => `
        <article class="project-item ${index % 2 ? 'alt' : ''}">
            <a class="project-link" href="${escapeHTML(entry.link || '#projects')}" ${entry.link ? 'target="_blank" rel="noopener"' : ''}>
                <div class="project-media"><div class="media-box project-media-fallback"><span class="project-label">Project ${String(index + 1).padStart(2, '0')}</span></div></div>
                <div class="project-info"><div class="info-top"><span class="year">${escapeHTML((entry.tags || '').split(',')[0])}</span><span class="cat">${escapeHTML((entry.tags || '').split(',')[1] || 'AI SYSTEM')}</span></div><h3 class="project-title">${escapeHTML(entry.title)}</h3><h4 class="project-desc">${escapeHTML(entry.description)}</h4></div>
            </a>
        </article>`).join('');
}

function renderSkills(entries) {
    const container = document.getElementById('skills-container');
    if (!container) return;
    const icons = ['brain-circuit', 'network', 'code-2', 'terminal'];
    container.innerHTML = entries.map((entry, index) => `<div class="skill-card"><div class="skill-icon"><i data-lucide="${icons[index % icons.length]}"></i></div><h3>${escapeHTML(entry.title)}</h3><h4>${escapeHTML(entry.description)}</h4></div>`).join('');
    window.lucide?.createIcons();
}

function renderStack(entries) {
    const container = document.getElementById('stack-container');
    if (container) container.innerHTML = entries.map(entry => `<span class="stack-tag">${escapeHTML(entry.title || entry)}</span>`).join('');
}

function initMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
    const preloader = document.getElementById('preloader');
    if (preloader) window.gsap.to(preloader, { opacity: 0, duration: 0.6, delay: 0.4, onComplete: () => { preloader.hidden = true; } });
    window.gsap.from('.hero-tagline, .hero-title, .hero-bio', { opacity: 0, y: 24, duration: 0.8, stagger: 0.12, ease: 'power2.out' });
    if (window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        window.gsap.utils.toArray('.project-item, .skill-card').forEach(item => window.gsap.from(item, { opacity: 0, y: 24, duration: 0.7, scrollTrigger: { trigger: item, start: 'top 88%' } }));
    }
}

function initMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const header = document.querySelector('.header');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !header || !mobileNav) return;
    toggle.addEventListener('click', () => {
        const open = header.classList.toggle('menu-open');
        mobileNav.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.mobile-nav-link').forEach(link => link.addEventListener('click', () => {
        header.classList.remove('menu-open');
        mobileNav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    }));
}

document.addEventListener('DOMContentLoaded', async () => {
    const [projects, skills, stack] = await Promise.all([loadEntries('project'), loadEntries('skill'), loadEntries('stack')]);
    renderProjects(projects);
    renderSkills(skills);
    renderStack(stack);
    window.lucide?.createIcons();
    initMenu();
    initMotion();
});
