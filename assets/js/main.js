const PORTFOLIO_DATA = window.PORTFOLIO_DATA || {};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderHeroMetrics();
  renderProjects('all');
  renderResearchPapers();
  renderExperience();
  renderEducationAndProgrammes();
  renderAwards('all');
  renderLeadershipAndJournalism();
  initCommandPalette();
  initNavigation();
  initModals();
  initContactActions();
});

/* ==========================================================================
   THEME MANAGER (Dark default, matches Aarav Anand)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = storedTheme || 'dark';

  setTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.innerHTML = theme === 'dark' 
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>` 
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }
}

/* ==========================================================================
   RENDER HERO METRICS
   ========================================================================== */
function renderHeroMetrics() {
  const container = document.getElementById('heroMetricsContainer');
  if (!container || !PORTFOLIO_DATA.profile) return;

  container.innerHTML = PORTFOLIO_DATA.profile.metrics.map(m => `
    <div class="metric-cell">
      <div class="metric-val">${m.value}</div>
      <div class="metric-lbl">${m.label}</div>
      <div class="metric-sub">${m.detail}</div>
    </div>
  `).join('');
}

/* ==========================================================================
   PROJECTS SHOWCASE (Aarav Anand Exact Style)
   ========================================================================== */
function renderProjects(category = 'all', searchQuery = '') {
  const grid = document.getElementById('projectsGrid');
  if (!grid || !PORTFOLIO_DATA.ventures) return;

  let filtered = PORTFOLIO_DATA.ventures;
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 2.5rem; color: var(--text-muted); font-size: 0.9rem;">
        No projects match your filter.
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <article class="project-item-card" data-project-id="${p.id}">
      <div class="project-card-top">
        <a href="javascript:void(0)" onclick="window.openProjectModal('${p.id}')" class="project-title-link">
          ${p.title}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        </a>
        <span class="project-badge-tag">${p.badge}</span>
      </div>

      <div class="project-role-timeline">
        ${p.role} • ${p.timeline}
      </div>

      <div class="project-tagline-text">
        ${p.tagline}
      </div>

      <p class="project-desc-text">
        ${p.summary}
      </p>

      <div class="project-metrics-row">
        ${p.metrics.map(m => `
          <div class="pm-chip">
            <span class="pm-chip-lbl">${m.label}:</span>
            <span class="pm-chip-val">${m.value}</span>
          </div>
        `).join('')}
      </div>

      <div class="project-tags-flex">
        ${p.tags.slice(0, 6).map(t => `<span class="pill-tech-tag">${t}</span>`).join('')}
      </div>

      <button class="project-card-action-btn" onclick="window.openProjectModal('${p.id}')">
        View Specs & Case Study
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </article>
  `).join('');
}

// Project filter clicks
document.addEventListener('click', (e) => {
  if (e.target.matches('.filter-tab-btn')) {
    document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    const category = e.target.getAttribute('data-category');
    const searchInput = document.getElementById('projectSearchInput');
    renderProjects(category, searchInput ? searchInput.value : '');
  }
});

const searchInput = document.getElementById('projectSearchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const activeTab = document.querySelector('.filter-tab-btn.active');
    const category = activeTab ? activeTab.getAttribute('data-category') : 'all';
    renderProjects(category, e.target.value);
  });
}

/* ==========================================================================
   RESEARCH & WRITING SECTION
   ========================================================================== */
function renderResearchPapers() {
  const container = document.getElementById('researchPapersList');
  if (!container || !PORTFOLIO_DATA.research) return;

  container.innerHTML = PORTFOLIO_DATA.research.map(paper => `
    <div class="research-entry-card">
      <div class="research-entry-top">
        <span class="research-status-pill">${paper.status}</span>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${paper.date}</span>
      </div>
      <div class="research-entry-title">${paper.title}</div>
      <div class="research-venue-text">${paper.venue}</div>
      <p class="research-abstract-preview">
        <strong>Abstract:</strong> ${paper.abstract}
      </p>
      <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.35rem;">Key Findings:</div>
      <ul class="exp-bullets-list" style="margin-bottom: 0.85rem;">
        ${paper.keyFindings.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <div class="project-tags-flex">
        ${paper.tags.map(t => `<span class="pill-tech-tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   EXPERIENCE SECTION (Aarav Anand style)
   ========================================================================== */
function renderExperience() {
  const container = document.getElementById('experienceContainer');
  if (!container || !PORTFOLIO_DATA.experience) return;

  container.innerHTML = PORTFOLIO_DATA.experience.map(exp => `
    <div class="experience-item">
      <div class="exp-header-row">
        <div class="exp-role-title">${exp.role}</div>
        <div class="exp-date-label">${exp.period}</div>
      </div>
      <div class="exp-org-name">${exp.organization} — ${exp.location}</div>
      <p class="exp-summary-text">${exp.summary}</p>
      <ul class="exp-bullets-list">
        ${exp.points.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/* ==========================================================================
   EDUCATION & ACADEMIC PROGRAMMES
   ========================================================================== */
function renderEducationAndProgrammes() {
  const eduContainer = document.getElementById('educationContainer');
  const progContainer = document.getElementById('programmesContainer');

  if (eduContainer && PORTFOLIO_DATA.education) {
    eduContainer.innerHTML = PORTFOLIO_DATA.education.map(edu => `
      <div class="experience-item" style="padding-bottom: 1rem; border-bottom: 1px solid var(--border-subtle); margin-bottom: 1rem;">
        <div class="exp-header-row">
          <div class="exp-role-title">${edu.institution}</div>
          <div class="exp-date-label">${edu.period}</div>
        </div>
        <div class="exp-org-name">${edu.degree} — ${edu.location}</div>
        <p class="exp-summary-text">${edu.details}</p>
        <div style="font-size: 0.825rem; color: var(--accent-emerald);">
          <strong>Leadership:</strong> ${edu.leadership}
        </div>
      </div>
    `).join('');
  }

  if (progContainer && PORTFOLIO_DATA.academicProgrammes) {
    progContainer.innerHTML = PORTFOLIO_DATA.academicProgrammes.map(prog => `
      <div class="experience-item" style="padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-subtle); margin-bottom: 1.25rem;">
        <div class="exp-header-row">
          <div class="exp-role-title">${prog.title}</div>
          <div class="exp-date-label">${prog.date}</div>
        </div>
        <div class="exp-org-name">${prog.institution} — ${prog.location}</div>
        <p class="exp-summary-text">${prog.summary}</p>
        <ul class="exp-bullets-list">
          ${prog.highlights.slice(0, 3).map(h => `<li>${h}</li>`).join('')}
        </ul>
        <div class="project-tags-flex" style="margin-top: 0.65rem;">
          ${prog.skills.map(s => `<span class="pill-tech-tag">${s}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   AWARDS & SCHOLASTIC ACHIEVEMENTS (Aarav Anand style)
   ========================================================================== */
function renderAwards(category = 'all') {
  const container = document.getElementById('awardsListContainer');
  if (!container || !PORTFOLIO_DATA.awards) return;

  let list = PORTFOLIO_DATA.awards;
  if (category !== 'all') {
    list = list.filter(a => a.category.toLowerCase().includes(category.toLowerCase()));
  }

  container.innerHTML = list.map(a => `
    <div class="award-row-item">
      <div class="award-left-content">
        <div class="award-main-title">
          ${a.highlight ? '★ ' : ''}${a.title}
        </div>
        <div class="award-sub-org">
          ${a.competition} — <span style="color: var(--text-dim);">${a.organization}</span>
        </div>
      </div>
      <span class="award-year-tag">${a.year}</span>
    </div>
  `).join('');
}

document.addEventListener('click', (e) => {
  if (e.target.matches('.award-tab-btn')) {
    document.querySelectorAll('.award-tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    const cat = e.target.getAttribute('data-category');
    renderAwards(cat);
  }
});

/* ==========================================================================
   LEADERSHIP & JOURNALISM (Aarav Anand style cards)
   ========================================================================== */
function renderLeadershipAndJournalism() {
  const leadershipContainer = document.getElementById('leadershipList');
  const journalismContainer = document.getElementById('journalismList');
  const munContainer = document.getElementById('speakingList');
  const communityContainer = document.getElementById('communityList');

  if (leadershipContainer && PORTFOLIO_DATA.leadership) {
    leadershipContainer.innerHTML = PORTFOLIO_DATA.leadership.map(l => `
      <div style="margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div style="font-weight: 600; font-size: 0.925rem; color: var(--text-primary);">${l.role}</div>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${l.period}</span>
        </div>
        <div style="font-size: 0.825rem; color: var(--accent-blue-light); margin-bottom: 0.25rem;">${l.organization}</div>
        <p style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">${l.description}</p>
      </div>
    `).join('');
  }

  if (journalismContainer && PORTFOLIO_DATA.journalism) {
    journalismContainer.innerHTML = PORTFOLIO_DATA.journalism.map(j => `
      <div style="margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div style="font-weight: 600; font-size: 0.925rem; color: var(--text-primary);">${j.role}</div>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${j.period}</span>
        </div>
        <div style="font-size: 0.825rem; color: var(--accent-blue-light); margin-bottom: 0.25rem;">${j.publication}</div>
        <p style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">${j.description}</p>
      </div>
    `).join('');
  }

  if (munContainer && PORTFOLIO_DATA.publicSpeaking) {
    munContainer.innerHTML = PORTFOLIO_DATA.publicSpeaking.map(p => `
      <div style="margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div style="font-weight: 600; font-size: 0.925rem; color: var(--text-primary);">${p.role}</div>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${p.period}</span>
        </div>
        <div style="font-size: 0.825rem; color: var(--accent-blue-light); margin-bottom: 0.25rem;">${p.event}</div>
        <p style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">${p.description}</p>
      </div>
    `).join('');
  }

  if (communityContainer && PORTFOLIO_DATA.communityService) {
    communityContainer.innerHTML = PORTFOLIO_DATA.communityService.map(c => `
      <div style="margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div style="font-weight: 600; font-size: 0.925rem; color: var(--text-primary);">${c.initiative}</div>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${c.period}</span>
        </div>
        <div style="font-size: 0.825rem; color: var(--accent-emerald); margin-bottom: 0.25rem;">${c.role}</div>
        <p style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">${c.impact}</p>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   PROJECT DEEP-DIVE MODAL
   ========================================================================== */
window.openProjectModal = function(projectId) {
  const project = PORTFOLIO_DATA.ventures.find(v => v.id === projectId);
  if (!project) return;

  const modal = document.getElementById('projectModal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="margin-bottom: 1.25rem;">
      <span class="project-badge-tag">${project.badge}</span>
      <h2 style="font-size: 1.75rem; font-weight: 700; margin-top: 0.5rem; color: var(--text-primary);">${project.title}</h2>
      <div style="font-size: 0.85rem; color: var(--accent-blue-light); font-weight: 500; font-family: var(--font-mono); margin-top: 0.2rem;">
        ${project.role} • ${project.timeline}
      </div>
    </div>

    <div style="font-size: 0.95rem; font-weight: 500; color: var(--text-main); margin-bottom: 1rem; line-height: 1.5;">
      ${project.tagline}
    </div>

    <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
      ${project.description}
    </p>

    <div style="margin-bottom: 1.25rem;">
      <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">System Architecture & Implementation:</div>
      <ul class="exp-bullets-list">
        ${project.architecture.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>

    <div class="project-metrics-row" style="margin-bottom: 1.25rem;">
      ${project.metrics.map(m => `
        <div class="pm-chip">
          <span class="pm-chip-lbl">${m.label}:</span>
          <span class="pm-chip-val">${m.value}</span>
        </div>
      `).join('')}
    </div>

    <div>
      <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.4rem;">Tech Stack</div>
      <div class="project-tags-flex">
        ${project.tags.map(t => `<span class="pill-tech-tag">${t}</span>`).join('')}
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

function initModals() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeCmdPalette();
    }
  });
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

/* ==========================================================================
   COMMAND PALETTE (⌘K / Ctrl+K)
   ========================================================================== */
function initCommandPalette() {
  const triggerBtn = document.getElementById('cmdTriggerBtn');
  const backdrop = document.getElementById('cmdPaletteBackdrop');
  const input = document.getElementById('cmdInput');
  const results = document.getElementById('cmdResultsList');

  if (!backdrop || !input || !results) return;

  if (triggerBtn) {
    triggerBtn.addEventListener('click', openCmdPalette);
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openCmdPalette();
    }
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeCmdPalette();
  });

  input.addEventListener('input', (e) => {
    renderCmdResults(e.target.value);
  });

  renderCmdResults('');
}

function openCmdPalette() {
  const backdrop = document.getElementById('cmdPaletteBackdrop');
  const input = document.getElementById('cmdInput');
  if (!backdrop) return;
  backdrop.classList.add('open');
  if (input) {
    input.value = '';
    input.focus();
    renderCmdResults('');
  }
  document.body.style.overflow = 'hidden';
}

function closeCmdPalette() {
  const backdrop = document.getElementById('cmdPaletteBackdrop');
  if (!backdrop) return;
  backdrop.classList.remove('open');
  document.body.style.overflow = 'auto';
}

function renderCmdResults(query) {
  const container = document.getElementById('cmdResultsList');
  if (!container) return;

  const q = query.toLowerCase().trim();

  const items = [
    { title: 'AeriSense — Precision Livestock IoT', type: 'Venture', target: 'modal', id: 'aerisense' },
    { title: 'ClearCall — Edge AI Sports Officiating', type: 'Venture', target: 'modal', id: 'clearcall' },
    { title: 'BeeWise — Precision Apiculture & Collapse Prediction', type: 'Venture', target: 'modal', id: 'beewise' },
    { title: 'SignBridge — Real-time Sign Language Translation', type: 'Venture', target: 'modal', id: 'signbridge' },
    { title: 'AcousticAI — Acoustic Signature Inference (99.3%)', type: 'Venture', target: 'modal', id: 'acousticai' },
    { title: 'Springer Nature LNNS Research Paper', type: 'Research', target: '#research' },
    { title: 'Avogadro Chemistry Contest (World Rank 1)', type: 'Award', target: '#awards' },
    { title: 'UC Berkeley M.E.T. Innovation Academy', type: 'Education', target: '#education' },
    { title: 'Plaksha University Young Technology Scholars', type: 'Education', target: '#education' },
    { title: 'BizForHer CTO Platform ($2.5M+ raised)', type: 'Leadership', target: '#leadership' },
    { title: 'View Full Curriculum Vitae (Printable CV)', type: 'Document', target: 'resume.html' },
    { title: 'Copy Email to Clipboard', type: 'Action', target: 'copy-email' }
  ];

  const filtered = q ? items.filter(it => it.title.toLowerCase().includes(q) || it.type.toLowerCase().includes(q)) : items;

  container.innerHTML = filtered.map(it => `
    <li class="cmd-result-item" onclick="executeCmdItem('${it.target}', '${it.id || ''}')">
      <span class="cmd-result-title">${it.title}</span>
      <span class="cmd-result-type">${it.type}</span>
    </li>
  `).join('');
}

window.executeCmdItem = function(target, id) {
  closeCmdPalette();
  if (target === 'modal' && id) {
    window.openProjectModal(id);
  } else if (target === 'resume.html') {
    window.location.href = 'resume.html';
  } else if (target === 'copy-email') {
    copyEmail();
  } else if (target.startsWith('#')) {
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
};

/* ==========================================================================
   NAVIGATION & ACTIVE STATES
   ========================================================================== */
function initNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const top = sec.offsetTop - 90;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinksGroup = document.getElementById('navLinksGroup');
  if (mobileBtn && navLinksGroup) {
    mobileBtn.addEventListener('click', () => {
      const isVisible = navLinksGroup.style.display === 'flex';
      navLinksGroup.style.display = isVisible ? 'none' : 'flex';
      navLinksGroup.style.position = isVisible ? '' : 'absolute';
      navLinksGroup.style.top = isVisible ? '' : '60px';
      navLinksGroup.style.left = isVisible ? '' : '0';
      navLinksGroup.style.width = isVisible ? '' : '100%';
      navLinksGroup.style.flexDirection = isVisible ? '' : 'column';
      navLinksGroup.style.background = isVisible ? '' : 'var(--bg-card)';
      navLinksGroup.style.padding = isVisible ? '' : '1.25rem';
      navLinksGroup.style.borderBottom = isVisible ? '' : '1px solid var(--border-subtle)';
    });
  }
}

/* ==========================================================================
   CONTACT ACTIONS & TOAST
   ========================================================================== */
function initContactActions() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyEmail);
  }
}

function copyEmail() {
  const email = PORTFOLIO_DATA.profile ? PORTFOLIO_DATA.profile.email : 'shreeansh0479@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    showToast(`Copied ${email} to clipboard!`);
  }).catch(() => {
    showToast(`Email: ${email}`);
  });
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.querySelector('.toast-msg').textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
