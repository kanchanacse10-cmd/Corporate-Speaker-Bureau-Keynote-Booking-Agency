/**
 * SummitSpeak Bureau — Main UI & Public Interactivity
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Toast Notification System
  function showToast(message, type = "info") {
    let container = document.getElementById("ssb-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "ssb-toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `ssb-toast`;
    toast.innerHTML = `
      <div>${message}</div>
      <button type="button" class="btn-close btn-close-white ms-2" style="font-size:0.7rem;" aria-label="Close"></button>
    `;
    const closeBtn = toast.querySelector(".btn-close");
    closeBtn.addEventListener("click", () => toast.remove());
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
  window.SSB_SHOW_TOAST = showToast;

  // 2. Shortlist Badge Count Sync
  function updateShortlistCounters() {
    const list = SSB_STORAGE.getShortlist();
    document.querySelectorAll(".shortlist-count-badge").forEach(badge => {
      badge.textContent = list.length;
      badge.style.display = "flex";
    });
  }
  updateShortlistCounters();

  // Home Hero Carousel Init & Indicator Controls
  const heroCarouselEl = document.getElementById("homeHeroCarousel");
  if (heroCarouselEl && window.bootstrap && window.bootstrap.Carousel) {
    const heroCarousel = bootstrap.Carousel.getOrCreateInstance(heroCarouselEl, {
      interval: 6500,
      pause: "hover",
      wrap: true
    });

    const indicatorButtons = heroCarouselEl.querySelectorAll(".carousel-indicators button");
    
    // Explicit click handler to guarantee instant slide jump on click
    indicatorButtons.forEach((btn, idx) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        heroCarousel.to(idx);
      });
    });

    // Synchronize active indicator on slide transitions
    heroCarouselEl.addEventListener("slide.bs.carousel", (e) => {
      indicatorButtons.forEach((btn, idx) => {
        if (idx === e.to) {
          btn.classList.add("active");
          btn.setAttribute("aria-current", "true");
        } else {
          btn.classList.remove("active");
          btn.removeAttribute("aria-current");
        }
      });
    });
  }

  window.addEventListener("ssb:shortlist-updated", (e) => {
    updateShortlistCounters();
    const speaker = SSB_DATA.speakers.find(s => s.id === e.detail.speakerId);
    const speakerName = speaker ? speaker.name : "Speaker";
    if (e.detail.added) {
      showToast(`Added <strong>${speakerName}</strong> to your saved shortlist.`, "success");
    } else {
      showToast(`Removed <strong>${speakerName}</strong> from shortlist.`, "info");
    }
    // Update active state on any matching buttons on page
    document.querySelectorAll(`.speaker-shortlist-btn[data-speaker-id="${e.detail.speakerId}"]`).forEach(btn => {
      btn.classList.toggle("active", e.detail.added);
    });
  });

  // Global delegation for shortlist buttons
  document.addEventListener("click", (e) => {
    const shortlistBtn = e.target.closest(".speaker-shortlist-btn");
    if (shortlistBtn) {
      e.preventDefault();
      const speakerId = shortlistBtn.dataset.speakerId;
      if (speakerId) {
        SSB_STORAGE.toggleShortlist(speakerId);
      }
    }
  });

  // 3. Render Speaker Card Template Helper (Executive 4-Grid Layout)
  window.SSB_RENDER_SPEAKER_CARD = function (speaker, basePath = "") {
    const isSaved = SSB_STORAGE.isInShortlist(speaker.id);
    const profileUrl = `${basePath}pages/speaker-profile.html?id=${speaker.id}`;
    const bookUrl = `${basePath}pages/book-a-speaker.html?speaker=${encodeURIComponent(speaker.name)}&id=${speaker.id}`;
    const topicShort = speaker.primaryTopic ? speaker.primaryTopic.split('&')[0].trim() : 'Keynote';
    const locationShort = speaker.location ? speaker.location.split('/')[0].trim() : '';

    return `
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 fade-up visible">
        <div class="speaker-card">
          <div class="speaker-img-box">
            <img src="${basePath}${speaker.image}" alt="${speaker.name}" class="speaker-img" loading="lazy">
            <div class="speaker-img-overlay"></div>
            <div class="speaker-card-top-badges">
              <span class="speaker-topic-pill" title="${speaker.primaryTopic}">${topicShort}</span>
              <button type="button" class="speaker-shortlist-btn ${isSaved ? 'active' : ''}" data-speaker-id="${speaker.id}" title="${isSaved ? 'Remove from Shortlist' : 'Add to Shortlist'}" aria-label="Shortlist ${speaker.name}">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/></svg>
              </button>
            </div>
            ${locationShort ? `
              <div class="speaker-card-img-footer">
                <span class="speaker-location-badge">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
                  ${locationShort}
                </span>
              </div>
            ` : ''}
          </div>
          <div class="speaker-card-body">
            <h4 class="speaker-name">
              <a href="${profileUrl}">${speaker.name}</a>
            </h4>
            <div class="speaker-title" title="${speaker.title}">${speaker.title}</div>
            <p class="speaker-bio-teaser speaker-card-desc">${speaker.teaser || speaker.bio}</p>
            <div class="speaker-meta-strip">
              <div class="speaker-fee-wrap">
                <span class="fee-lbl">Honorarium Tier</span>
                <span class="fee-val">${speaker.feeTier}</span>
              </div>
              <span class="speaker-industry-pill" title="${speaker.industry}">${speaker.industry}</span>
            </div>
            <div class="speaker-card-actions">
              <a href="${profileUrl}" class="btn btn-outline-corporate btn-sm flex-grow-1">View Profile</a>
              <a href="${bookUrl}" class="btn btn-gold btn-sm px-3">Book &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // 4. Initialize Featured Speakers on Home
  const featuredContainer = document.getElementById("featured-speakers-grid");
  if (featuredContainer) {
    const featuredList = SSB_DATA.speakers.filter(s => s.featured);
    featuredContainer.innerHTML = featuredList.map(s => window.SSB_RENDER_SPEAKER_CARD(s, "")).join("");
    initScrollAnimations(featuredContainer);
  }

  // 5. Active Nav Highlighting
  const currentPath = window.location.pathname;
  document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href && (currentPath.endsWith(href) || (href === "index.html" && (currentPath.endsWith("/") || currentPath.endsWith("/index.html"))))) {
      link.classList.add("active");
    }
  });

  // 6. Universal "Go to Top" (Scroll to Top) Floating Action
  function initScrollToTop() {
    let topBtn = document.getElementById("ssb-back-to-top");
    if (!topBtn) {
      topBtn = document.createElement("button");
      topBtn.id = "ssb-back-to-top";
      topBtn.type = "button";
      topBtn.className = "ssb-back-to-top";
      topBtn.setAttribute("title", "Scroll to top");
      topBtn.setAttribute("aria-label", "Scroll to top");
      topBtn.innerHTML = `
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16" style="pointer-events:none;">
          <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg>
      `;
      document.body.appendChild(topBtn);
    }

    const checkScroll = () => {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const dashMain = document.querySelector(".dash-main");
      const dashScrollPos = dashMain ? dashMain.scrollTop : 0;
      if (scrollPos > 240 || dashScrollPos > 240) {
        topBtn.classList.add("visible");
      } else {
        topBtn.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    document.addEventListener("scroll", checkScroll, { passive: true });

    const dashMain = document.querySelector(".dash-main");
    if (dashMain) {
      dashMain.addEventListener("scroll", checkScroll, { passive: true });
    }

    topBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      document.body.scrollTo({ top: 0, behavior: "smooth" });
      const currentDashMain = document.querySelector(".dash-main");
      if (currentDashMain) {
        currentDashMain.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    checkScroll();
  }

  // 6. Interactive Executive Perspectives Showcase
  function initPerspectivesShowcase() {
    const stageCard = document.getElementById("perspectivesStageCard");
    if (!stageCard) return;

    const caseData = [
      {
        eventPill: "Global AI & Technology Summit \u2022 Chicago, IL",
        csat: "99.4% Attendee CSAT",
        pullQuote: "\u201CSet the tone for our entire global summit and generated our highest attendee ratings.\u201D",
        fullQuote: "\u201CSummitSpeak understood our executive audience instantly. Dr. Marcus Vance\u2019s opening keynote on artificial intelligence set the tone for our entire global summit and generated our highest attendee ratings.\u201D",
        speakerName: "Dr. Marcus Vance",
        speakerTopic: "Artificial Intelligence & Frontier Ethics",
        speakerAvatar: "assets/images/speakers/marcus-vance.jpg",
        speakerLink: "pages/speaker-roster.html?speaker=marcus-vance",
        impactFormat: "3,500 Delegates \u2022 Opening Keynote",
        impactResonance: "99.4% Outstanding Rating",
        impactLogistics: "100% Rider SLA \u2022 VIP Briefing",
        authorName: "Sarah Jenkins",
        authorRole: "Senior Director of Global Events, Enterprise Software",
        authorImg: "assets/images/clients/sarah-jenkins.jpg",
        stampId: "#SSB-8842-CONF"
      },
      {
        eventPill: "Zurich International Financial Forum \u2022 Zurich, CH",
        csat: "100% Rider SLA Met",
        pullQuote: "\u201CHaving every technical rider confirmed weeks in advance gave our board complete confidence.\u201D",
        fullQuote: "\u201CThe contract and logistics support was flawless. When planning an international forum in Zurich, having every technical rider detail confirmed weeks in advance gave our board complete confidence.\u201D",
        speakerName: "Elena Rostova",
        speakerTopic: "Global Macroeconomics & Geopolitics",
        speakerAvatar: "assets/images/speakers/elena-rostova.jpg",
        speakerLink: "pages/speaker-roster.html?speaker=elena-rostova",
        impactFormat: "1,800 Delegates \u2022 Executive Plenary",
        impactResonance: "100% Board Confidence Rating",
        impactLogistics: "Zurich Travel & Security Cleared",
        authorName: "Markus Hoffmann",
        authorRole: "Chief Communications Officer, European Banking Group",
        authorImg: "assets/images/clients/markus-hoffmann.jpg",
        stampId: "#SSB-9104-CONF"
      },
      {
        eventPill: "Annual Global Commercial Kickoff \u2022 Dallas, TX",
        csat: "Standing Ovation",
        pullQuote: "\u201CDelivered an electrifying presentation that our teams are still referencing months later.\u201D",
        fullQuote: "\u201COur annual sales kickoff required a speaker who could speak authoritatively about resilience without relying on tired cliches. David O'Connor delivered an electrifying presentation that our teams are still referencing.\u201D",
        speakerName: "David O'Connor",
        speakerTopic: "High-Performance Resilience & Team Culture",
        speakerAvatar: "assets/images/speakers/david-oconnor.jpg",
        speakerLink: "pages/speaker-roster.html?speaker=david-oconnor",
        impactFormat: "1,200 Leaders \u2022 Annual Sales Kickoff",
        impactResonance: "Standing Ovation \u2022 98.9% NPS",
        impactLogistics: "Pre-Event Leadership Briefing",
        authorName: "Claire Lawson",
        authorRole: "VP of Commercial Operations, Industrial Tech",
        authorImg: "assets/images/clients/claire-lawson.jpg",
        stampId: "#SSB-7729-CONF"
      }
    ];

    const tabBtns = document.querySelectorAll(".perspectives-tab-btn");
    const companionCards = document.querySelectorAll(".companion-card");
    const eventText = document.getElementById("stageEventText");
    const csatText = document.getElementById("stageCsatText");
    const pullQuote = document.getElementById("stagePullQuote");
    const fullQuote = document.getElementById("stageFullQuote");
    const speakerAvatar = document.getElementById("stageSpeakerAvatar");
    const speakerName = document.getElementById("stageSpeakerName");
    const speakerTopic = document.getElementById("stageSpeakerTopic");
    const speakerLink = document.getElementById("stageSpeakerLink");
    const impactFormat = document.getElementById("stageImpactFormat");
    const impactResonance = document.getElementById("stageImpactResonance");
    const impactLogistics = document.getElementById("stageImpactLogistics");
    const authorImg = document.getElementById("stageAuthorImg");
    const authorName = document.getElementById("stageAuthorName");
    const authorRole = document.getElementById("stageAuthorRole");
    const stampId = document.getElementById("stageStampId");

    function renderStage(index) {
      if (!caseData[index]) return;
      const data = caseData[index];

      // Add fade animation class
      stageCard.classList.remove("fade-in-stage");
      void stageCard.offsetWidth; // Trigger reflow
      stageCard.classList.add("fade-in-stage");

      if (eventText) eventText.textContent = data.eventPill;
      if (csatText) csatText.textContent = data.csat;
      if (pullQuote) pullQuote.textContent = data.pullQuote;
      if (fullQuote) fullQuote.textContent = data.fullQuote;
      if (speakerAvatar) {
        speakerAvatar.src = data.speakerAvatar;
        speakerAvatar.alt = data.speakerName;
      }
      if (speakerName) speakerName.textContent = data.speakerName;
      if (speakerTopic) speakerTopic.textContent = data.speakerTopic;
      if (speakerLink) speakerLink.href = data.speakerLink;
      if (impactFormat) impactFormat.textContent = data.impactFormat;
      if (impactResonance) impactResonance.textContent = data.impactResonance;
      if (impactLogistics) impactLogistics.textContent = data.impactLogistics;
      if (authorImg) {
        authorImg.src = data.authorImg;
        authorImg.alt = data.authorName;
      }
      if (authorName) authorName.textContent = data.authorName;
      if (authorRole) authorRole.textContent = data.authorRole;
      if (stampId) stampId.textContent = data.stampId;

      // Update active state on tab buttons
      tabBtns.forEach((btn, idx) => {
        const isActive = idx === index;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      // Update active state on companion cards
      companionCards.forEach(card => {
        const cIdx = parseInt(card.dataset.companionIndex, 10);
        card.classList.toggle("active", cIdx === index);
      });
    }

    tabBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => renderStage(idx));
    });

    companionCards.forEach(card => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.dataset.companionIndex, 10);
        renderStage(idx);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const idx = parseInt(card.dataset.companionIndex, 10);
          renderStage(idx);
        }
      });
    });
  }

  // 7. Executive Advisory & FAQ Concierge Engine
  function initFaqConcierge() {
    const container = document.getElementById("faqAccordionContainer");
    if (!container) return;

    const cards = container.querySelectorAll(".faq-executive-card");
    const categoryBtns = document.querySelectorAll(".faq-category-btn");
    const searchInput = document.getElementById("faqSearchInput");
    const noResults = document.getElementById("faqNoResults");
    const mobileCatName = document.getElementById("faqMobileCatName");
    const mobileCatCount = document.getElementById("faqMobileCatCount");
    const mobileNextBtn = document.getElementById("faqMobileNextBtn");
    const mobilePrevBtn = document.getElementById("faqMobilePrevBtn");

    const syncMobileCatBar = (btn) => {
      if (!btn) return;
      if (mobileCatName) {
        const textSpan = btn.querySelector("span:first-child");
        if (textSpan) mobileCatName.textContent = textSpan.textContent.trim();
      }
      if (mobileCatCount) {
        const countSpan = btn.querySelector(".faq-cat-count");
        if (countSpan) mobileCatCount.textContent = countSpan.textContent.trim();
      }
    };

    // Accordion Toggle
    cards.forEach(card => {
      const header = card.querySelector(".faq-executive-header");
      if (!header) return;

      const toggleCard = () => {
        const isOpen = card.classList.contains("open");
        // Close other cards for clean focused view
        cards.forEach(c => {
          if (c !== card) {
            c.classList.remove("open");
            const h = c.querySelector(".faq-executive-header");
            if (h) h.setAttribute("aria-expanded", "false");
          }
        });
        card.classList.toggle("open", !isOpen);
        header.setAttribute("aria-expanded", !isOpen ? "true" : "false");
      };

      header.addEventListener("click", toggleCard);
      header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleCard();
        }
      });
    });

    // Category Filtering
    categoryBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.faqFilter;
        categoryBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        syncMobileCatBar(btn);

        if (searchInput) searchInput.value = "";

        let visibleCount = 0;
        let firstMatch = null;
        let hasOpenVisible = false;

        cards.forEach(card => {
          const cat = card.dataset.faqCat;
          const match = filter === "all" || cat === filter;
          card.style.display = match ? "block" : "none";
          if (match) {
            visibleCount++;
            if (!firstMatch) firstMatch = card;
            if (card.classList.contains("open")) hasOpenVisible = true;
          }
        });

        // Ensure at least the first filtered question is open for instant readability
        if (!hasOpenVisible && firstMatch) {
          firstMatch.classList.add("open");
          const h = firstMatch.querySelector(".faq-executive-header");
          if (h) h.setAttribute("aria-expanded", "true");
        }

        if (noResults) {
          noResults.style.display = visibleCount === 0 ? "block" : "none";
        }

        // On mobile, gently scroll so filtered questions are clearly in view
        if (window.innerWidth < 992) {
          const faqSearch = document.querySelector(".faq-search-box");
          if (faqSearch) {
            const rect = faqSearch.getBoundingClientRect();
            if (rect.top < 0 || rect.top > window.innerHeight * 0.45) {
              faqSearch.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }
        }
      });
    });

    // Mobile Prev Category Button Action (cycles backward through categories)
    if (mobilePrevBtn && categoryBtns.length > 0) {
      mobilePrevBtn.addEventListener("click", () => {
        let currentIdx = Array.from(categoryBtns).findIndex(b => b.classList.contains("active"));
        if (currentIdx === -1) currentIdx = 0;
        const prevIdx = (currentIdx - 1 + categoryBtns.length) % categoryBtns.length;
        categoryBtns[prevIdx].click();
      });
    }

    // Mobile Next Category Button Action (cycles through categories)
    if (mobileNextBtn && categoryBtns.length > 0) {
      mobileNextBtn.addEventListener("click", () => {
        let currentIdx = Array.from(categoryBtns).findIndex(b => b.classList.contains("active"));
        if (currentIdx === -1) currentIdx = 0;
        const nextIdx = (currentIdx + 1) % categoryBtns.length;
        categoryBtns[nextIdx].click();
      });
    }

    // Set initial state for mobile bar
    const initialActiveBtn = document.querySelector(".faq-category-btn.active") || categoryBtns[0];
    if (initialActiveBtn) {
      syncMobileCatBar(initialActiveBtn);
    }

    // Live Instant Search
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(card => {
          const text = card.textContent.toLowerCase();
          const match = query === "" || text.includes(query);
          card.style.display = match ? "block" : "none";
          if (match) visibleCount++;
        });

        if (query.length > 0) {
          categoryBtns.forEach(b => b.classList.toggle("active", b.dataset.faqFilter === "all"));
          const allBtn = document.querySelector(".faq-category-btn[data-faq-filter='all']");
          if (allBtn) syncMobileCatBar(allBtn);
        }

        if (noResults) {
          noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
      });
    }
  }

  // 12. Custom Select Dropdown Handler (Prevents OS menu overflow)
  function initCustomSelectDropdowns() {
    document.addEventListener("click", (e) => {
      const item = e.target.closest(".custom-select-dropdown .dropdown-item");
      if (!item) return;

      e.preventDefault();
      const dropdownWrap = item.closest(".custom-select-dropdown");
      if (!dropdownWrap) return;

      const hiddenInput = dropdownWrap.querySelector("input[type='hidden']");
      const labelSpan = dropdownWrap.querySelector(".custom-select-label");
      const toggleBtn = dropdownWrap.querySelector(".custom-select-toggle");
      const val = item.getAttribute("data-value") !== null ? item.getAttribute("data-value") : item.textContent.trim();
      const text = item.textContent.trim();

      if (hiddenInput) {
        hiddenInput.value = val;
        hiddenInput.classList.remove("is-invalid");
        hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (toggleBtn) {
        toggleBtn.classList.remove("is-invalid");
      }
      if (labelSpan) {
        labelSpan.textContent = text;
      }

      dropdownWrap.querySelectorAll(".dropdown-item").forEach(el => el.classList.remove("active"));
      item.classList.add("active");

      if (toggleBtn && window.bootstrap && window.bootstrap.Dropdown) {
        const bsDropdown = bootstrap.Dropdown.getInstance(toggleBtn) || new bootstrap.Dropdown(toggleBtn);
        if (bsDropdown) bsDropdown.hide();
      }
    });
  }

  // 13. Scroll Progress Indicator Bar (Top of Viewport)
  function initScrollProgressBar() {
    let bar = document.getElementById("ssbScrollProgress");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "ssbScrollProgress";
      document.body.prepend(bar);
    }
    const updateProgress = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, progress)) + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  // 14. Luméra-Style Scroll-Driven Reveal Animations (IntersectionObserver)
  function initScrollAnimations(root = document) {
    const animatedElements = root.querySelectorAll(
      ".fade-up, .fade-down, .fade-left, .fade-right, .scale-in"
    );
    if (!animatedElements.length) return;

    if (!("IntersectionObserver" in window)) {
      animatedElements.forEach(el => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            
            // Check for explicit or parent-sibling delay
            let delay = 0;
            if (target.dataset.delay) {
              delay = parseInt(target.dataset.delay, 10);
            } else if (!target.style.transitionDelay && target.parentElement) {
              const siblings = Array.from(target.parentElement.children).filter(child =>
                child.matches(".fade-up, .fade-down, .fade-left, .fade-right, .scale-in")
              );
              if (siblings.length > 1) {
                const idx = siblings.indexOf(target);
                if (idx >= 0) {
                  delay = Math.min(idx * 75, 500);
                }
              }
            }

            if (delay > 0) {
              setTimeout(() => {
                target.classList.add("visible");
              }, delay);
            } else {
              target.classList.add("visible");
            }

            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    animatedElements.forEach((el) => {
      if (!el.classList.contains("visible")) {
        observer.observe(el);
      }
    });
  }
  window.SSB_INIT_SCROLL_ANIMATIONS = initScrollAnimations;

  // 15. Animated Number Counters for Statistics
  function initStatCounters() {
    const statElements = document.querySelectorAll(
      ".trust-stat-num, .trust-metric-val, .counter-num"
    );
    if (!statElements.length) return;

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            observer.unobserve(el);
            animateStatValue(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    statElements.forEach(el => observer.observe(el));

    function animateStatValue(el) {
      const originalText = el.textContent.trim();
      const match = originalText.match(/^([^\d]*)([\d,.]+)(.*)$/);
      if (!match) return;

      const prefix = match[1] || "";
      const rawNum = parseFloat(match[2].replace(/,/g, ""));
      const suffix = match[3] || "";
      const isDecimal = match[2].includes(".");
      const decimalPlaces = isDecimal ? match[2].split(".")[1].length : 0;

      if (isNaN(rawNum)) return;

      el.classList.add("counter-num");
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = rawNum * ease;

        const formattedVal = isDecimal
          ? currentVal.toFixed(decimalPlaces)
          : Math.floor(currentVal).toLocaleString();

        el.textContent = `${prefix}${formattedVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = originalText;
          el.classList.add("counted");
        }
      }
      requestAnimationFrame(update);
    }
  }

  initPerspectivesShowcase();
  initFaqConcierge();
  initScrollToTop();
  initCustomSelectDropdowns();
  initScrollProgressBar();
  initScrollAnimations();
  initStatCounters();
});



