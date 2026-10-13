/**
 * SummitSpeak Bureau — Client Portal SaaS Dashboard Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  const dashContainer = document.querySelector(".dashboard-app");
  if (!dashContainer) return;

  let activeView = "overview";

  // Check URL query parameters for view (e.g. ?view=requests or ?view=contracts)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("view")) {
    activeView = urlParams.get("view");
  }

  // Sidebar elements
  const navLinks = document.querySelectorAll(".dash-nav-link");
  const viewPanels = document.querySelectorAll(".dash-view-panel");
  const breadcrumbTargets = document.querySelectorAll(".dash-breadcrumb-target, #dash-breadcrumb-current, #dash-breadcrumb-current-mobile");
  const sidebarToggle = document.getElementById("dash-sidebar-toggle");
  const sidebar = document.querySelector(".dash-sidebar");

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show");
    });
  }

  // Function to switch view
  function switchView(viewName) {
    activeView = viewName;

    navLinks.forEach(link => {
      const target = link.dataset.view;
      link.classList.toggle("active", target === viewName);
    });

    viewPanels.forEach(panel => {
      panel.style.display = (panel.id === `view-${viewName}`) ? "block" : "none";
    });

    breadcrumbTargets.forEach(el => {
      el.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1).replace("-", " ");
    });

    document.querySelectorAll(".mobile-bottom-nav-item[data-dash-jump]").forEach(item => {
      item.classList.toggle("active", item.dataset.dashJump === viewName);
    });

    // Refresh view data
    refreshActiveView(viewName);

    // Close mobile sidebar if open
    if (sidebar && sidebar.classList.contains("show")) {
      sidebar.classList.remove("show");
    }

    // Update URL hash/query without reload (safeguarded for file:// protocol)
    try {
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("view", viewName);
      window.history.replaceState({}, "", newUrl);
    } catch (e) {
      // Graceful fallback for file:// protocol or restricted environments
    }
  }

  // Expose switchView globally so any inline or external handler can access it
  window.switchView = switchView;

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = link.dataset.view;
      if (targetView) switchView(targetView);
    });
  });

  // Global Dispatcher for in-dashboard links
  document.addEventListener("click", (e) => {
    const jumpLink = e.target.closest("[data-dash-jump]");
    if (jumpLink) {
      e.preventDefault();
      switchView(jumpLink.dataset.dashJump);
    }
  });

  // --- View Specific Refresh Logic ---
  function refreshActiveView(viewName) {
    try {
      const state = SSB_STORAGE.getState();

      switch (viewName) {
        case "overview":
          renderOverview(state);
          break;
        case "find-speaker":
          renderFindSpeaker(state);
          break;
        case "shortlist":
          renderShortlist(state);
          break;
        case "requests":
          renderRequestsTable(state);
          break;
        case "confirmed":
          renderConfirmedBookings(state);
          break;
        case "calendar":
          renderCalendar(state);
          break;
        case "contracts":
          renderContracts(state);
          break;
        case "billing":
          renderBilling(state);
          break;
        case "history":
          renderHistory(state);
          break;
        case "notifications":
          renderNotifications(state);
          break;
        case "profile":
          renderProfile(state);
          break;
      }

      // Sync notification and shortlist badge counters
      syncSidebarBadges(state);
    } catch (err) {
      console.warn("Error refreshing active view:", viewName, err);
    }
  }

  function syncSidebarBadges(state) {
    const unreadCount = state.notifications.filter(n => n.unread).length;
    const notifBadge = document.getElementById("dash-notif-badge");
    const topNotifBadge = document.getElementById("dash-top-notif-badge");
    if (notifBadge) {
      notifBadge.textContent = unreadCount;
      notifBadge.style.display = unreadCount > 0 ? "inline-block" : "none";
    }
    if (topNotifBadge) {
      topNotifBadge.textContent = unreadCount;
      topNotifBadge.style.display = unreadCount > 0 ? "inline-block" : "none";
    }

    const shortlistBadge = document.getElementById("dash-shortlist-badge");
    if (shortlistBadge) {
      shortlistBadge.textContent = state.shortlist.length;
      shortlistBadge.style.display = state.shortlist.length > 0 ? "inline-block" : "none";
    }
  }

  // --- 1. Overview Renderer ---
  function renderOverview(state) {
    const activeRequestsCount = state.bookingRequests.filter(r => r.status !== "Cancelled" && r.status !== "Completed").length;
    const confirmedCount = state.bookingRequests.filter(r => r.status === "Confirmed").length;
    const contractsPendingCount = state.contracts.filter(c => c.status !== "Signed & Confirmed").length;
    const invoicesPending = state.invoices.filter(i => i.status !== "Paid");
    const balanceDue = invoicesPending.reduce((acc, cur) => acc + cur.balance, 0);

    const kpiActive = document.getElementById("kpi-active-requests");
    const kpiConfirmed = document.getElementById("kpi-confirmed-events");
    const kpiContracts = document.getElementById("kpi-contracts-pending");
    const kpiBalance = document.getElementById("kpi-balance-due");

    if (kpiActive) kpiActive.textContent = activeRequestsCount;
    if (kpiConfirmed) kpiConfirmed.textContent = confirmedCount;
    if (kpiContracts) kpiContracts.textContent = contractsPendingCount;
    if (kpiBalance) kpiBalance.textContent = `$${balanceDue.toLocaleString()}`;

    // Upcoming events preview list
    const upcomingContainer = document.getElementById("dash-overview-upcoming-list");
    if (upcomingContainer) {
      const upcoming = state.bookingRequests.slice(0, 3);
      upcomingContainer.innerHTML = upcoming.map(item => `
        <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
          <div>
            <div class="fw-bold">${item.eventName}</div>
            <div class="small text-muted">${item.speakerName} &bull; ${item.eventDate} &bull; ${item.format}</div>
          </div>
          <div>
            <span class="status-badge status-${getStatusClass(item.status)}">${item.status}</span>
          </div>
        </div>
      `).join("");
    }

    // Recent activity list
    const activityContainer = document.getElementById("dash-overview-activity-list");
    if (activityContainer) {
      activityContainer.innerHTML = state.notifications.slice(0, 4).map(n => `
        <div class="d-flex gap-3 align-items-start py-2 border-bottom">
          <div class="mt-1" style="width:8px; height:8px; border-radius:50%; background:var(--ssb-secondary); flex-shrink:0;"></div>
          <div>
            <div class="fw-semibold small">${n.title}</div>
            <div class="text-muted" style="font-size:0.8rem;">${n.body}</div>
            <div class="text-muted" style="font-size:0.72rem;">${n.time}</div>
          </div>
        </div>
      `).join("");
    }
  }

  // --- 2. Find Speaker & Compare Drawer ---
  function renderFindSpeaker(state) {
    const container = document.getElementById("dash-find-speakers-grid");
    if (!container) return;

    const searchInput = document.getElementById("dash-speaker-search");
    const topicSelect = document.getElementById("dash-speaker-topic-filter");
    const formatSelect = document.getElementById("dash-speaker-format-filter");

    function filterAndRender() {
      const q = (searchInput?.value || "").toLowerCase();
      const topic = topicSelect?.value || "";
      const format = formatSelect?.value || "";

      const filtered = SSB_DATA.speakers.filter(s => {
        const matchesQuery = s.name.toLowerCase().includes(q) || s.bio.toLowerCase().includes(q) || s.primaryTopic.toLowerCase().includes(q);
        const matchesTopic = !topic || s.primaryTopic === topic;
        const matchesFormat = !format || s.formats.includes(format);
        return matchesQuery && matchesTopic && matchesFormat;
      });

      if (filtered.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-5 text-muted">No speakers matching your search criteria.</div>`;
        return;
      }

      container.innerHTML = filtered.map(s => {
        const isSaved = SSB_STORAGE.isInShortlist(s.id);
        return `
          <div class="col-xl-4 col-lg-6 col-12 mb-4">
            <div class="ssb-card h-100 d-flex flex-column">
              <div class="d-flex gap-3 align-items-center mb-3">
                <img src="../${s.image}" alt="${s.name}" class="rounded-circle flex-shrink-0" style="width:64px; height:64px; object-fit:cover;">
                <div class="min-w-0">
                  <h5 class="mb-1 text-truncate">${s.name}</h5>
                  <div class="small text-gold">${s.primaryTopic}</div>
                </div>
              </div>
              <p class="small text-muted flex-grow-1">${s.bio.substring(0, 110)}...</p>
              <div class="d-flex gap-1 flex-wrap mb-3">
                ${s.formats.map(f => `<span class="badge bg-secondary-subtle text-dark-emphasis" style="font-size:0.7rem;">${f}</span>`).join("")}
              </div>
              <div class="d-flex gap-2 mt-auto dash-speaker-card-actions">
                <button class="btn btn-outline-corporate btn-sm flex-grow-1 text-nowrap" onclick="SSB_STORAGE.toggleShortlist('${s.id}')">
                  ${isSaved ? 'Remove Saved' : 'Add to Shortlist'}
                </button>
                <a href="../pages/book-a-speaker.html?speaker=${encodeURIComponent(s.name)}&id=${s.id}" class="btn btn-gold btn-sm text-nowrap">Request</a>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    searchInput?.addEventListener("input", filterAndRender);
    topicSelect?.addEventListener("change", filterAndRender);
    formatSelect?.addEventListener("change", filterAndRender);

    filterAndRender();
  }

  // --- 3. My Shortlist Renderer ---
  function renderShortlist(state) {
    const container = document.getElementById("dash-shortlist-container");
    if (!container) return;

    if (state.shortlist.length === 0) {
      container.innerHTML = `
        <div class="ssb-card text-center py-5">
          <div class="mb-3 text-gold" style="font-size:2rem;"><svg width="36" height="36" fill="currentColor" viewBox="0 0 16 16"><path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/></svg></div>
          <h4>No Saved Speakers in Your Shortlist</h4>
          <p class="text-muted">Browse our speaker roster and click "Add to Shortlist" to save candidates for comparison.</p>
          <button class="btn btn-gold" data-dash-jump="find-speaker">Browse Directory</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="row g-4">
        ${state.shortlist.map(item => {
          const s = SSB_DATA.speakers.find(sp => sp.id === item.speakerId);
          if (!s) return "";
          return `
            <div class="col-lg-6">
              <div class="ssb-card h-100">
                <div class="d-flex gap-3 align-items-start mb-3">
                  <img src="../${s.image}" alt="${s.name}" class="rounded-3" style="width:78px; height:78px; object-fit:cover;">
                  <div class="flex-grow-1">
                    <h5 class="mb-1">${s.name}</h5>
                    <div class="small text-gold fw-semibold">${s.title}</div>
                    <div class="small text-muted">${s.primaryTopic} &bull; ${s.location}</div>
                  </div>
                  <button class="btn btn-outline-danger btn-sm p-1" title="Remove" onclick="SSB_STORAGE.toggleShortlist('${s.id}')">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                  </button>
                </div>
                <div class="mb-3">
                  <label class="form-label small text-muted">Internal Planning Note:</label>
                  <input type="text" class="form-control form-control-sm" value="${item.notes}" onchange="SSB_STORAGE.updateShortlistNote('${s.id}', this.value)">
                </div>
                <div class="shortlist-card-footer d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center align-items-start gap-2 mt-auto pt-2 border-top">
                  <span class="shortlist-added-date small text-muted">Added: ${item.dateAdded}</span>
                  <a href="../pages/book-a-speaker.html?speaker=${encodeURIComponent(s.name)}&id=${s.id}" class="btn btn-gold btn-sm shortlist-submit-btn w-100 w-sm-auto text-center">Submit Booking Request</a>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // --- 4. Booking Requests Table ---
  function renderRequestsTable(state) {
    const tableBody = document.getElementById("dash-booking-requests-tbody");
    if (!tableBody) return;

    tableBody.innerHTML = state.bookingRequests.map(item => `
      <tr>
        <td class="font-monospace fw-bold">${item.id}</td>
        <td>
          <div class="fw-semibold">${item.eventName}</div>
          <div class="small text-muted">${item.location}</div>
        </td>
        <td>
          <div class="fw-semibold">${item.speakerName}</div>
          <div class="small text-gold">${item.format}</div>
        </td>
        <td>${item.eventDate}</td>
        <td><span class="status-badge status-${getStatusClass(item.status)}">${item.status}</span></td>
        <td>${item.proposedFee}</td>
        <td>
          <button class="btn btn-outline-corporate btn-sm py-1 px-2" onclick="window.viewBookingModal('${item.id}')">View Details</button>
        </td>
      </tr>
    `).join("");
  }

  // Booking Details Modal Helper
  window.viewBookingModal = function (bookingId) {
    const state = SSB_STORAGE.getState();
    const item = state.bookingRequests.find(b => b.id === bookingId);
    if (!item) return;

    const modalBody = document.getElementById("booking-modal-content");
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="font-monospace text-gold fw-bold fs-5">${item.id}</span>
          <span class="status-badge status-${getStatusClass(item.status)}">${item.status}</span>
        </div>
        <h4>${item.eventName}</h4>
        <p class="text-muted small">${item.notes}</p>
        <hr class="border-theme">
        <div class="row g-2 small">
          <div class="col-sm-4 text-muted">Speaker:</div>
          <div class="col-sm-8 fw-semibold">${item.speakerName}</div>
          <div class="col-sm-4 text-muted">Event Date:</div>
          <div class="col-sm-8">${item.eventDate}</div>
          <div class="col-sm-4 text-muted">Location / Format:</div>
          <div class="col-sm-8">${item.location} (${item.format})</div>
          <div class="col-sm-4 text-muted">Indicative Budget:</div>
          <div class="col-sm-8">${item.budget}</div>
          <div class="col-sm-4 text-muted">Proposed Fee:</div>
          <div class="col-sm-8 fw-bold text-gold">${item.proposedFee}</div>
        </div>
        <div class="mt-4 p-3 bg-secondary-theme rounded-2">
          <div class="fw-bold mb-1">Booking Pipeline Stage</div>
          <div class="small text-muted">Current status: <strong>${item.status}</strong>. All contractual amendments and fee authorizations are archived in your account audit log.</div>
        </div>
      `;
    }
    const bsModal = new bootstrap.Modal(document.getElementById("bookingDetailModal"));
    bsModal.show();
  };

  // --- 5. Confirmed Bookings & Checklist ---
  function renderConfirmedBookings(state) {
    const confirmedList = state.bookingRequests.filter(b => b.status === "Confirmed");
    const container = document.getElementById("dash-confirmed-container");
    if (!container) return;

    if (confirmedList.length === 0) {
      container.innerHTML = `<div class="ssb-card text-center py-5 text-muted">No confirmed bookings currently logged. Once contracts are signed and deposits received, confirmed engagements appear here.</div>`;
      return;
    }

    container.innerHTML = confirmedList.map(item => `
      <div class="ssb-card mb-4">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
          <div>
            <span class="badge bg-success-subtle text-success fw-bold text-uppercase" style="font-size:0.75rem;">Confirmed Engagement</span>
            <h4 class="mt-1 mb-1">${item.eventName}</h4>
            <div class="text-muted small">${item.speakerName} &bull; ${item.eventDate} &bull; ${item.location}</div>
          </div>
          <span class="font-monospace text-gold fw-bold">${item.id}</span>
        </div>

        <div class="checklist-box mt-3">
          <h6 class="mb-3 text-uppercase text-gold" style="letter-spacing:0.04em;">Event Preparation Checklist</h6>
          <div class="checklist-item">
            <input type="checkbox" class="checklist-checkbox" checked id="chk-1-${item.id}">
            <div>
              <div class="checklist-label">Confirm Event Schedule & Timezone Alignment</div>
              <div class="checklist-desc">Keynote time slot verified with bureau booking agent.</div>
            </div>
          </div>
          <div class="checklist-item">
            <input type="checkbox" class="checklist-checkbox" checked id="chk-2-${item.id}">
            <div>
              <div class="checklist-label">Review Speaker Introduction & Pronunciation</div>
              <div class="checklist-desc">Approved editorial bio provided for the master of ceremonies.</div>
            </div>
          </div>
          <div class="checklist-item">
            <input type="checkbox" class="checklist-checkbox" id="chk-3-${item.id}">
            <div>
              <div class="checklist-label">Technical & Audiovisual Rider Review</div>
              <div class="checklist-desc">Wireless lavalier microphone, confidence monitor, and HDMI slide feed confirmed with AV production team.</div>
            </div>
          </div>
          <div class="checklist-item">
            <input type="checkbox" class="checklist-checkbox" id="chk-4-${item.id}">
            <div>
              <div class="checklist-label">Travel & Executive Accommodation Confirmation</div>
              <div class="checklist-desc">Flight details and hotel booking reference shared with speaker management.</div>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  }

  // --- 6. Event Calendar ---
  function renderCalendar(state) {
    const calendarGrid = document.getElementById("dash-calendar-grid");
    if (!calendarGrid) return;

    // Generate standard month grid for current demonstration month (November 2026)
    let gridHtml = `
      <div class="calendar-header-day">Sun</div>
      <div class="calendar-header-day">Mon</div>
      <div class="calendar-header-day">Tue</div>
      <div class="calendar-header-day">Wed</div>
      <div class="calendar-header-day">Thu</div>
      <div class="calendar-header-day">Fri</div>
      <div class="calendar-header-day">Sat</div>
    `;

    // 35 cells for demonstration
    for (let day = 1; day <= 35; day++) {
      let cellDay = day;
      let isCurrentMonth = true;
      if (day > 30) {
        cellDay = day - 30;
        isCurrentMonth = false;
      }

      let eventsHtml = "";
      if (cellDay === 18 && isCurrentMonth) {
        eventsHtml = `
          <div class="calendar-event-pill tentative d-none d-md-block" title="Marcus Vance Keynote">Nov 18: Dr. Vance Keynote (McCormick Place)</div>
          <div class="calendar-event-dot tentative d-md-none" title="Nov 18: Dr. Vance Keynote (Hold)"></div>
        `;
      }
      if (cellDay === 5 && !isCurrentMonth) {
        eventsHtml = `
          <div class="calendar-event-pill confirmed d-none d-md-block" title="Elena Rostova Keynote">Dec 05: Elena Rostova (Zurich)</div>
          <div class="calendar-event-dot confirmed d-md-none" title="Dec 05: Elena Rostova (Confirmed)"></div>
        `;
      }

      gridHtml += `
        <div class="calendar-cell ${!isCurrentMonth ? 'other-month' : ''} ${eventsHtml ? 'has-event' : ''}">
          <div class="calendar-date-number">${cellDay}</div>
          ${eventsHtml}
        </div>
      `;
    }

    calendarGrid.innerHTML = gridHtml;
  }

  // --- 7. Contracts & Documents ---
  function renderContracts(state) {
    const tableBody = document.getElementById("dash-contracts-tbody");
    if (!tableBody) return;

    tableBody.innerHTML = state.contracts.map(c => `
      <tr>
        <td class="font-monospace fw-bold">${c.id}</td>
        <td>
          <div class="fw-semibold">${c.docName}</div>
          <div class="small text-muted">Related: ${c.bookingRef} &bull; ${c.version}</div>
        </td>
        <td>${c.issueDate}</td>
        <td>
          <span class="status-badge ${c.status === 'Signed & Confirmed' ? 'status-confirmed' : 'status-contract'}">
            ${c.status}
          </span>
        </td>
        <td>
          ${c.status !== 'Signed & Confirmed' ? `
            <button class="btn btn-gold btn-sm py-1 px-2" onclick="window.openSignContractModal('${c.id}')">Review & Sign</button>
          ` : `
            <button class="btn btn-outline-corporate btn-sm py-1 px-2" onclick="window.viewContractDoc('${c.id}')">View Executed PDF</button>
          `}
        </td>
      </tr>
    `).join("");
  }

  window.openSignContractModal = function (contractId) {
    const state = SSB_STORAGE.getState();
    const contract = state.contracts.find(c => c.id === contractId);
    if (!contract) return;

    const modalBody = document.getElementById("contract-modal-content");
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="doc-paper-view mb-3">
          <h4 class="text-center mb-1">SUMMITSPEAK BUREAU ENGAGEMENT AGREEMENT</h4>
          <p class="text-center text-muted small mb-4">Reference: ${contract.id} &bull; Booking: ${contract.bookingRef}</p>
          <p><strong>BETWEEN:</strong> SummitSpeak Bureau Inc. & Apex Global Enterprises</p>
          <p><strong>ENGAGEMENT FEE:</strong> ${contract.amount} USD</p>
          <p><strong>TERMS:</strong> 1. Professional presentation services shall be provided as described in Exhibit A. 2. A fifty percent (50%) advance deposit is payable upon signature. 3. Recording and virtual streaming rights are granted strictly for internal corporate archival purposes unless specified otherwise.</p>
        </div>
        <div class="mb-3">
          <label class="form-label">Authorized Signatory Full Name:</label>
          <input type="text" id="signer-input-name" class="form-control" value="Sarah Jenkins" required>
        </div>
        <div class="form-check mb-3">
          <input class="form-check-input" type="checkbox" id="sign-agree-check" checked>
          <label class="form-check-label small" for="sign-agree-check">
            I confirm that I am an authorized corporate officer empowered to execute this keynote speaker agreement.
          </label>
        </div>
        <button class="btn btn-gold w-100" onclick="window.executeContractSignature('${contract.id}')">Execute Electronic Signature</button>
      `;
    }

    const bsModal = new bootstrap.Modal(document.getElementById("contractModal"));
    bsModal.show();
  };

  window.executeContractSignature = function (contractId) {
    const signer = document.getElementById("signer-input-name")?.value || "Authorized Signer";
    const agreed = document.getElementById("sign-agree-check")?.checked;
    if (!agreed) {
      alert("Please confirm corporate authorization.");
      return;
    }
    SSB_STORAGE.signContract(contractId, signer);
    bootstrap.Modal.getInstance(document.getElementById("contractModal")).hide();
    refreshActiveView("contracts");
    if (window.SSB_SHOW_TOAST) window.SSB_SHOW_TOAST(`Contract ${contractId} has been successfully executed!`, "success");
  };

  window.viewContractDoc = function (contractId) {
    alert(`Viewing verified electronic archive for agreement ${contractId}. Downloadable certificate verified.`);
  };

  // --- 8. Billing & Payments ---
  function renderBilling(state) {
    const totalInvoiced = state.invoices.reduce((a, b) => a + b.total, 0);
    const amountPaid = state.invoices.reduce((a, b) => a + b.amountPaid, 0);
    const balanceDue = state.invoices.reduce((a, b) => a + b.balance, 0);

    const elTotal = document.getElementById("bill-total-invoiced");
    const elPaid = document.getElementById("bill-amount-paid");
    const elBalance = document.getElementById("bill-balance-due");

    if (elTotal) elTotal.textContent = `$${totalInvoiced.toLocaleString()}`;
    if (elPaid) elPaid.textContent = `$${amountPaid.toLocaleString()}`;
    if (elBalance) elBalance.textContent = `$${balanceDue.toLocaleString()}`;

    const tableBody = document.getElementById("dash-invoices-tbody");
    if (!tableBody) return;

    tableBody.innerHTML = state.invoices.map(inv => `
      <tr>
        <td class="font-monospace fw-bold">${inv.id}</td>
        <td>${inv.description}</td>
        <td>${inv.issueDate}</td>
        <td>${inv.dueDate}</td>
        <td class="fw-bold">$${inv.total.toLocaleString()}</td>
        <td><span class="status-badge ${inv.status === 'Paid' ? 'status-confirmed' : 'status-payment'}">${inv.status}</span></td>
        <td>
          ${inv.status !== 'Paid' ? `
            <button class="btn btn-gold btn-sm py-1 px-2" onclick="window.openPaymentModal('${inv.id}')">Pay Now</button>
          ` : `
            <span class="text-success small fw-bold">Receipt Available</span>
          `}
        </td>
      </tr>
    `).join("");
  }

  window.openPaymentModal = function (invoiceId) {
    const state = SSB_STORAGE.getState();
    const invoice = state.invoices.find(i => i.id === invoiceId);
    if (!invoice) return;

    const modalBody = document.getElementById("payment-modal-content");
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="p-3 bg-secondary-theme rounded-2 mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span class="fw-bold">Invoice Reference:</span>
            <span class="font-monospace">${invoice.id}</span>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span>Description:</span>
            <span>${invoice.description}</span>
          </div>
          <div class="d-flex justify-content-between fs-5 fw-bold text-gold border-top pt-2 mt-2">
            <span>Amount Due:</span>
            <span>$${invoice.balance.toLocaleString()} USD</span>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Select Payment Method:</label>
          <select id="pay-method-select" class="form-select">
            <option value="Corporate Wire Transfer">Corporate Wire Transfer / ACH</option>
            <option value="Corporate Credit Card (Visa/Amex)">Corporate Credit Card (Visa/Amex)</option>
            <option value="Enterprise Purchase Order">Enterprise Purchase Order (Net 30)</option>
          </select>
        </div>
        <button class="btn btn-gold w-100" onclick="window.confirmMockPayment('${invoice.id}')">Authorize & Process Payment</button>
      `;
    }

    const bsModal = new bootstrap.Modal(document.getElementById("paymentModal"));
    bsModal.show();
  };

  window.confirmMockPayment = function (invoiceId) {
    const method = document.getElementById("pay-method-select")?.value || "Wire Transfer";
    SSB_STORAGE.payInvoice(invoiceId, method);
    bootstrap.Modal.getInstance(document.getElementById("paymentModal")).hide();
    refreshActiveView("billing");
    if (window.SSB_SHOW_TOAST) window.SSB_SHOW_TOAST(`Payment for invoice ${invoiceId} confirmed via ${method}!`, "success");
  };

  // --- 9. Booking History ---
  function renderHistory(state) {
    const container = document.getElementById("dash-history-list");
    if (!container) return;

    container.innerHTML = state.bookingRequests.map(item => `
      <div class="audit-timeline-item">
        <div class="audit-marker-col">
          <div class="audit-marker-dot"></div>
          <div class="audit-marker-line"></div>
        </div>
        <div class="audit-content-col">
          <div class="audit-top-meta">
            <span class="audit-id-badge">${item.id}</span>
            <span class="audit-date-badge">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>
              ${item.lastUpdated}
            </span>
          </div>
          <h6 class="audit-event-title">${item.eventName}</h6>
          <div class="audit-event-details">
            <span>${item.speakerName}</span>
            <span>&bull;</span>
            <span>${item.format}</span>
            <span>&bull;</span>
            <span class="audit-budget-pill">Budget: ${item.budget}</span>
          </div>
          <div class="audit-status-row">
            <span class="status-badge status-${getStatusClass(item.status)}">${item.status}</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  // Helper for notification icons
  function getNotifIcon(link) {
    switch (link) {
      case "contracts":
        return `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
      case "billing":
        return `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`;
      case "confirmed":
        return `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      case "requests":
      default:
        return `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;
    }
  }

  // --- 10. Notifications ---
  function renderNotifications(state) {
    const container = document.getElementById("dash-notifications-list");
    if (!container) return;

    if (!state.notifications || state.notifications.length === 0) {
      container.innerHTML = `<div class="p-4 text-center text-muted">No notifications at this time.</div>`;
      return;
    }

    container.innerHTML = state.notifications.map(n => `
      <div class="notification-feed-item ${n.unread ? 'is-unread' : ''}">
        <div class="notif-accent-strip"></div>
        <div class="notif-main-wrapper">
          <div class="notif-header-line">
            <div class="notif-icon-bubble ${n.unread ? 'unread-bubble' : ''}">
              ${getNotifIcon(n.link)}
            </div>
            <div class="notif-title-group">
              <div class="notif-title-and-badge">
                <h6 class="notif-title">${n.title}</h6>
                ${n.unread ? '<span class="notif-badge-new">NEW</span>' : ''}
              </div>
              <span class="notif-timestamp">
                <svg width="11" height="11" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>
                ${n.time}
              </span>
            </div>
          </div>
          <div class="notif-body-content">
            <p class="notif-text mb-0">${n.body}</p>
          </div>
          <div class="notif-footer-action">
            <button class="btn btn-outline-corporate btn-sm notif-action-btn" onclick="switchView('${n.link}')">
              <span>View Details</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    `).join("");

    const markAllBtn = document.getElementById("btn-mark-all-notifications-read");
    if (markAllBtn) {
      markAllBtn.onclick = () => {
        SSB_STORAGE.markAllNotificationsRead();
        refreshActiveView("notifications");
      };
    }
  }

  // --- 11. Company Profile ---
  function renderProfile(state) {
    const c = (state && state.client) ? state.client : {};
    const form = document.getElementById("company-profile-form");
    if (form) {
      const nameInput = document.getElementById("prof-company-name");
      if (nameInput) nameInput.value = c.companyName || "";
      const contactInput = document.getElementById("prof-contact-person");
      if (contactInput) contactInput.value = c.contactPerson || "";
      const emailInput = document.getElementById("prof-email");
      if (emailInput) emailInput.value = c.email || "";
      const profCurrency = document.getElementById("prof-currency");
      if (profCurrency) {
        profCurrency.value = c.currency || "USD ($)";
        const label = profCurrency.closest(".custom-select-dropdown")?.querySelector(".custom-select-label");
        if (label) label.textContent = profCurrency.value;
      }
    }

    const teamTable = document.getElementById("dash-team-tbody");
    if (teamTable && c.team) {
      teamTable.innerHTML = c.team.map(m => `
        <tr>
          <td class="fw-semibold">${m.name}</td>
          <td class="text-muted">${m.email}</td>
          <td><span class="badge bg-secondary-subtle text-dark-emphasis">${m.role}</span></td>
          <td><span class="badge bg-success-subtle text-success">${m.status}</span></td>
        </tr>
      `).join("");
    }

    const teamMobileList = document.getElementById("dash-team-mobile-list");
    if (teamMobileList && c.team) {
      teamMobileList.innerHTML = c.team.map(m => {
        const initials = m.name ? m.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";
        return `
          <div class="team-member-mobile-card">
            <div class="team-member-main">
              <div class="team-avatar-badge">${initials}</div>
              <div class="team-member-details">
                <div class="team-member-name-row">
                  <span class="team-name">${m.name}</span>
                  <span class="team-status-badge status-${(m.status || 'Active').toLowerCase()}">${m.status || 'Active'}</span>
                </div>
                <div class="team-email-row">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span class="team-email">${m.email}</span>
                </div>
              </div>
            </div>
            <div class="team-member-footer">
              <span class="team-role-label">Role:</span>
              <span class="team-role-tag">${m.role}</span>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // Helper for status badge CSS
  function getStatusClass(status) {
    switch (status) {
      case "Submitted": return "submitted";
      case "Under Review": return "review";
      case "Contract Pending": return "contract";
      case "Payment Pending": return "payment";
      case "Confirmed": return "confirmed";
      case "Declined": return "declined";
      case "Cancelled": return "cancelled";
      default: return "review";
    }
  }

  // Initial render
  switchView(activeView);
});
