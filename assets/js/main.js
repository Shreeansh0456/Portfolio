/**
 * Shreeansh Bansal Portfolio — Main UI Controller
 * Handles Theme State, Project Filtering, Deep-Dive Modals, Command Palette (⌘K),
 * Scroll-Spy Navigation, and Clipboard Actions.
 */

(function () {
  "use strict";

  const DATA = window.PORTFOLIO_DATA || {};

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileDrawer();
    initProjectFilters();
    initScrollSpy();
    initCopyEmail();
    initCommandPalette();
    initGlobalKeyboardShortcuts();
  });

  /* ==========================================================================
     1. THEME MANAGEMENT (Dark / Light Mode with Persistent Storage)
     ========================================================================== */
  function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    applyTheme(savedTheme);

    const toggleBtn = document.getElementById("themeToggleBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const isDark = document.documentElement.classList.contains("dark");
        applyTheme(isDark ? "light" : "dark");
      });
    }
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", theme);
  }

  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  function initMobileDrawer() {
    const toggleBtn = document.getElementById("mobileToggle");
    const drawer = document.getElementById("mobileDrawer");
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener("click", () => {
      const isHidden = drawer.classList.toggle("hidden");
      toggleBtn.setAttribute("aria-expanded", String(!isHidden));
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        drawer.classList.add("hidden");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ==========================================================================
     3. PROJECT CATEGORY FILTERING
     ========================================================================== */
  function initProjectFilters() {
    const filterButtons = document.querySelectorAll(".project-filter-btn");
    const projectCards = document.querySelectorAll("#projectsGridContainer > article");

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedCategory = btn.getAttribute("data-filter") || "all";

        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        projectCards.forEach((card) => {
          const cardCategory = card.getAttribute("data-category");
          if (selectedCategory === "all" || cardCategory === selectedCategory) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  /* ==========================================================================
     4. ACTIVE SCROLL-SPY NAVBAR HIGHLIGHTING
     ========================================================================== */
  function initScrollSpy() {
    const sections = document.querySelectorAll("main[id], section[id]");
    const navLinks = document.querySelectorAll(".nav-pill-btn[data-nav]");
    if (!sections.length || !navLinks.length) return;

    const onScroll = () => {
      const scrollPos = window.scrollY + 140;
      let currentId = "home";

      sections.forEach((section) => {
        if (scrollPos >= section.offsetTop) {
          currentId = section.getAttribute("id") || "home";
        }
      });

      navLinks.forEach((link) => {
        const target = link.getAttribute("data-nav");
        if (target === currentId) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ==========================================================================
     5. ONE-CLICK EMAIL COPY FEEDBACK
     ========================================================================== */
  function initCopyEmail() {
    const copyBtn = document.getElementById("copyEmailHeroBtn");
    const copyText = document.getElementById("copyEmailHeroText");
    if (!copyBtn || !copyText) return;

    const email = (DATA.profile && DATA.profile.email) || "shreeansh0479@gmail.com";

    copyBtn.addEventListener("click", () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          copyText.textContent = "Copied Email!";
          setTimeout(() => {
            copyText.textContent = "Get in Touch";
          }, 2200);
        });
      } else {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  /* ==========================================================================
     6. PROJECT DEEP-DIVE MODAL
     ========================================================================== */
  function openModal(projectId) {
    const ventures = DATA.ventures || [];
    const project = ventures.find((v) => v.id === projectId);
    if (!project) return;

    const modal = document.getElementById("projectModal");
    const body = document.getElementById("modalBody");
    if (!modal || !body) return;

    const metricsHtml = (project.metrics || [])
      .map(
        (m) => `
        <div class="modal-metric-box">
          <div class="text-lg font-bold font-mono" style="color: var(--text-primary);">${escapeHtml(m.value)}</div>
          <div class="text-xs font-semibold mt-0.5" style="color: var(--text-secondary);">${escapeHtml(m.label)}</div>
          ${m.detail ? `<div class="text-[11px] mt-0.5" style="color: var(--text-muted);">${escapeHtml(m.detail)}</div>` : ""}
        </div>
      `
      )
      .join("");

    const architectureHtml = (project.architecture || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    const tagsHtml = (project.tags || [])
      .map((tag) => `<span class="tag-pill text-xs">${escapeHtml(tag)}</span>`)
      .join("");

    body.innerHTML = `
      <div class="mb-3">
        <span class="status-badge-pill badge-blue">${escapeHtml(project.badge)}</span>
      </div>
      <h2 id="modalTitle" class="text-2xl md:text-3xl font-bold tracking-tight mb-1" style="color: var(--text-primary);">
        ${escapeHtml(project.title)}
      </h2>
      <div class="text-xs font-mono mb-4" style="color: var(--accent-blue-text);">
        ${escapeHtml(project.role)} &bull; ${escapeHtml(project.timeline)}
      </div>
      <p class="text-sm md:text-base leading-relaxed mb-6" style="color: var(--text-secondary);">
        ${escapeHtml(project.description || project.summary)}
      </p>

      <h4 class="text-xs font-mono uppercase tracking-widest mb-3" style="color: var(--text-muted);">
        Key Telemetry &amp; Benchmarks
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        ${metricsHtml}
      </div>

      ${
        architectureHtml
          ? `
        <h4 class="text-xs font-mono uppercase tracking-widest mb-3" style="color: var(--text-muted);">
          System Architecture &amp; Implementation
        </h4>
        <ul class="modal-arch-list">
          ${architectureHtml}
        </ul>
      `
          : ""
      }

      <h4 class="text-xs font-mono uppercase tracking-widest mb-2.5" style="color: var(--text-muted);">
        Technical Stack
      </h4>
      <div class="flex flex-wrap gap-2 mb-6">
        ${tagsHtml}
      </div>

      <div class="pt-4 flex flex-wrap justify-end gap-3" style="border-top: 1px solid var(--border-divider);">
        <button type="button" onclick="closeModal()" class="btn-solid-primary">
          Close Specs
        </button>
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    const modal = document.getElementById("projectModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  function handleModalBackdrop(event) {
    if (event.target && event.target.id === "projectModal") {
      closeModal();
    }
  }

  /* ==========================================================================
     7. COMMAND PALETTE (⌘K / Ctrl+K)
     ========================================================================== */
  const COMMAND_ITEMS = [
    { title: "AeriSense — Precision Livestock IoT", badge: "Project Specs", action: () => openModal("aerisense") },
    { title: "ClearCall — Edge-AI Sports Officiating", badge: "Project Specs", action: () => openModal("clearcall") },
    { title: "BeeWise — Colony Collapse Monte Carlo Engine", badge: "Project Specs", action: () => openModal("beewise") },
    { title: "SignBridge — Apple WWDC Top 350 Sign Translator", badge: "Project Specs", action: () => openModal("signbridge") },
    { title: "AcousticAI — 99.3% Acoustic Resonance ML", badge: "Project Specs", action: () => openModal("acousticai") },
    { title: "BizForHer Platform — CTO ($2.5M+ Mobilized)", badge: "Project Specs", action: () => openModal("bizforher") },
    { title: "Jump to Research & Publications", badge: "Section", action: () => scrollToSection("#research") },
    { title: "Jump to Work & Leadership Experience", badge: "Section", action: () => scrollToSection("#experience") },
    { title: "Jump to Technical Skills & Tools", badge: "Section", action: () => scrollToSection("#skills") },
    { title: "Jump to Honors & Distinctions", badge: "Section", action: () => scrollToSection("#honors") },
    {
      title: "Switch Dark / Light Theme",
      badge: "Appearance",
      action: () => {
        const isDark = document.documentElement.classList.contains("dark");
        applyTheme(isDark ? "light" : "dark");
      }
    },
    {
      title: "Open Curriculum Vitae (CV)",
      badge: "Document",
      action: () => {
        window.location.href = "resume.html";
      }
    }
  ];

  function initCommandPalette() {
    const triggerDesktop = document.getElementById("cmdTriggerBtn");
    const triggerMobile = document.getElementById("cmdTriggerMobile");
    const searchInput = document.getElementById("cmdSearchInput");

    if (triggerDesktop) triggerDesktop.addEventListener("click", openCmdPalette);
    if (triggerMobile) triggerMobile.addEventListener("click", openCmdPalette);

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        renderCommandResults(e.target.value);
      });
    }

    renderCommandResults("");
  }

  function openCmdPalette() {
    const modal = document.getElementById("cmdPaletteModal");
    const input = document.getElementById("cmdSearchInput");
    if (!modal) return;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    if (input) {
      input.value = "";
      renderCommandResults("");
      setTimeout(() => input.focus(), 50);
    }
  }

  function closeCmdPalette() {
    const modal = document.getElementById("cmdPaletteModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  function handleCmdBackdrop(event) {
    if (event.target && event.target.id === "cmdPaletteModal") {
      closeCmdPalette();
    }
  }

  function renderCommandResults(query) {
    const list = document.getElementById("cmdResultsList");
    if (!list) return;

    const q = (query || "").toLowerCase().trim();
    const filtered = q
      ? COMMAND_ITEMS.filter(
          (item) => item.title.toLowerCase().includes(q) || item.badge.toLowerCase().includes(q)
        )
      : COMMAND_ITEMS;

    if (!filtered.length) {
      list.innerHTML = `<li class="p-4 text-center text-xs text-muted-token">No matching commands found.</li>`;
      return;
    }

    list.innerHTML = "";
    filtered.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cmd-result-row";
      li.innerHTML = `
        <span class="cmd-result-title">${escapeHtml(item.title)}</span>
        <span class="cmd-result-badge">${escapeHtml(item.badge)}</span>
      `;
      li.addEventListener("click", () => {
        closeCmdPalette();
        item.action();
      });
      list.appendChild(li);
    });
  }

  function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function initGlobalKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const cmdModal = document.getElementById("cmdPaletteModal");
        if (cmdModal && cmdModal.classList.contains("active")) {
          closeCmdPalette();
        } else {
          openCmdPalette();
        }
      } else if (e.key === "Escape") {
        closeModal();
        closeCmdPalette();
      }
    });
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Expose handlers required by inline onclick attributes
  window.openModal = openModal;
  window.openProjectModal = openModal;
  window.closeModal = closeModal;
  window.handleModalBackdrop = handleModalBackdrop;
  window.openCmdPalette = openCmdPalette;
  window.closeCmdPalette = closeCmdPalette;
  window.handleCmdBackdrop = handleCmdBackdrop;
})();