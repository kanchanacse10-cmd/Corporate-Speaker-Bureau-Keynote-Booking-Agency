/**
 * SummitSpeak Bureau — Theme (Light/Dark) & Layout Direction (LTR/RTL) Controller
 */

(function () {
  const THEME_KEY = "ssb_theme";
  const DIR_KEY = "ssb_dir";

  // 1. Initial State Resolution
  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (e) {}
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }

  function getPreferredDir() {
    try {
      const saved = localStorage.getItem(DIR_KEY);
      if (saved === "rtl" || saved === "ltr") return saved;
    } catch (e) {}
    return "ltr";
  }

  // 2. Set Theme on Document
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    document.documentElement.classList.remove("theme-light", "theme-dark");
    document.documentElement.classList.add(theme === "dark" ? "theme-dark" : "theme-light");

    if (document.body) {
      document.body.setAttribute("data-bs-theme", theme);
      document.body.classList.remove("theme-light", "theme-dark");
      document.body.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
    }

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}

    updateThemeButtons(theme);
    window.dispatchEvent(new CustomEvent("ssb:theme-changed", { detail: { theme } }));
  }

  // 3. Set Direction on Document
  function applyDir(dir) {
    document.documentElement.setAttribute("dir", dir);
    if (document.body) {
      document.body.setAttribute("dir", dir);
    }

    try {
      localStorage.setItem(DIR_KEY, dir);
    } catch (e) {}

    updateDirButtons(dir);
    window.dispatchEvent(new CustomEvent("ssb:dir-changed", { detail: { dir } }));
  }

  // 4. Update UI Button States & Icons
  function updateThemeButtons(theme) {
    const isDark = theme === "dark";
    const titleText = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    const sunIcon = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style="pointer-events:none;"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>`;
    const moonIcon = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style="pointer-events:none;"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>`;

    document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
      btn.setAttribute("title", titleText);
      btn.setAttribute("aria-label", titleText);
      btn.innerHTML = isDark ? sunIcon : moonIcon;
    });
  }

  function updateDirButtons(dir) {
    const isRtl = dir === "rtl";
    const titleText = isRtl ? "Switch to LTR Layout" : "Switch to RTL Layout";
    const label = isRtl ? "LTR" : "RTL";

    document.querySelectorAll(".rtl-toggle-btn").forEach(btn => {
      btn.setAttribute("title", titleText);
      btn.setAttribute("aria-label", titleText);
      btn.textContent = label;
    });
  }

  // 5. Expose globally with debouncing to prevent double-firing
  let isTogglingTheme = false;
  let isTogglingDir = false;

  window.SSB_THEME = {
    toggleTheme() {
      if (isTogglingTheme) return document.documentElement.getAttribute("data-bs-theme") || "light";
      isTogglingTheme = true;
      setTimeout(() => { isTogglingTheme = false; }, 120);

      const current = document.documentElement.getAttribute("data-bs-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    },
    toggleDir() {
      if (isTogglingDir) return document.documentElement.getAttribute("dir") || "ltr";
      isTogglingDir = true;
      setTimeout(() => { isTogglingDir = false; }, 120);

      const current = document.documentElement.getAttribute("dir") || "ltr";
      const next = current === "rtl" ? "ltr" : "rtl";
      applyDir(next);
      return next;
    },
    applyTheme,
    applyDir
  };

  // Immediate execution before DOM ready to prevent theme flash
  const initialTheme = getPreferredTheme();
  const initialDir = getPreferredDir();
  applyTheme(initialTheme);
  applyDir(initialDir);

  // Setup listeners when DOM elements are ready
  function setupListeners() {
    const curTheme = document.documentElement.getAttribute("data-bs-theme") || "light";
    const curDir = document.documentElement.getAttribute("dir") || "ltr";
    updateThemeButtons(curTheme);
    updateDirButtons(curDir);

    // Direct event listener binding to every matching button
    document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
      btn.onclick = function (e) {
        e.preventDefault();
        window.SSB_THEME.toggleTheme();
      };
    });

    document.querySelectorAll(".rtl-toggle-btn").forEach(btn => {
      btn.onclick = function (e) {
        e.preventDefault();
        window.SSB_THEME.toggleDir();
      };
    });

    // Delegated click backup (for dynamically injected headers or modals)
    document.addEventListener("click", function (e) {
      const themeBtn = (e.target && typeof e.target.closest === "function") ? e.target.closest(".theme-toggle-btn") : null;
      if (themeBtn) {
        e.preventDefault();
        window.SSB_THEME.toggleTheme();
        return;
      }

      const rtlBtn = (e.target && typeof e.target.closest === "function") ? e.target.closest(".rtl-toggle-btn") : null;
      if (rtlBtn) {
        e.preventDefault();
        window.SSB_THEME.toggleDir();
        return;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupListeners);
  } else {
    setupListeners();
  }
  window.addEventListener("load", setupListeners);
})();
