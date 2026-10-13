/**
 * SummitSpeak Bureau — Multi-step Interactive Booking Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("ssb-booking-wizard-form");
  if (!bookingForm) return;

  let currentStep = 1;
  const totalSteps = 4;

  // Step Indicators & Panels
  const stepPanels = document.querySelectorAll(".wizard-step-panel");
  const stepIndicators = document.querySelectorAll(".wizard-step-indicator");
  const prevBtn = document.getElementById("wizard-prev-btn");
  const nextBtn = document.getElementById("wizard-next-btn");
  const submitBtn = document.getElementById("wizard-submit-btn");

  // URL Params handling (Pre-select speaker if navigated from card)
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedSpeaker = urlParams.get("speaker");
  const preSelectedId = urlParams.get("id");

  const speakerSelect = document.getElementById("field-speaker-preference");
  const speakerPrefMenu = document.getElementById("speaker-preference-menu");
  const speakerPrefLabel = document.querySelector("#speaker-preference-dropdown .custom-select-label");

  if (SSB_DATA && SSB_DATA.speakers) {
    if (speakerSelect && speakerSelect.tagName === "SELECT") {
      speakerSelect.innerHTML = `<option value="">— Request Open Speaker Recommendations —</option>` +
        SSB_DATA.speakers.map(s => `
          <option value="${s.name}" data-id="${s.id}" ${preSelectedSpeaker === s.name || preSelectedId === s.id ? 'selected' : ''}>
            ${s.name} (${s.primaryTopic})
          </option>
        `).join("");
    }
    if (speakerPrefMenu) {
      let initialLabel = "— Request Open Speaker Recommendations —";
      let initialVal = "";
      let menuHtml = `<li><button type="button" class="dropdown-item ${!preSelectedSpeaker && !preSelectedId ? 'active' : ''}" data-value="">— Request Open Speaker Recommendations —</button></li>`;
      SSB_DATA.speakers.forEach(s => {
        const isSelected = preSelectedSpeaker === s.name || preSelectedId === s.id;
        if (isSelected) {
          initialLabel = `${s.name} (${s.primaryTopic})`;
          initialVal = s.name;
        }
        menuHtml += `<li><button type="button" class="dropdown-item ${isSelected ? 'active' : ''}" data-value="${s.name}" data-id="${s.id}">${s.name} (${s.primaryTopic})</button></li>`;
      });
      speakerPrefMenu.innerHTML = menuHtml;
      if (speakerSelect) speakerSelect.value = initialVal;
      if (speakerPrefLabel) speakerPrefLabel.textContent = initialLabel;
    }
  }

  function showStep(step) {
    stepPanels.forEach((panel, idx) => {
      panel.style.display = (idx + 1 === step) ? "block" : "none";
    });

    stepIndicators.forEach((indicator, idx) => {
      indicator.classList.remove("active", "completed");
      if (idx + 1 === step) {
        indicator.classList.add("active");
      } else if (idx + 1 < step) {
        indicator.classList.add("completed");
      }
    });

    if (prevBtn) prevBtn.style.display = step > 1 ? "inline-flex" : "none";
    if (nextBtn) nextBtn.style.display = step < totalSteps ? "inline-flex" : "none";
    if (submitBtn) submitBtn.style.display = step === totalSteps ? "inline-flex" : "none";

    const progressBar = document.getElementById("wizard-progress-bar");
    if (progressBar) {
      progressBar.style.width = `${((step - 1) / (totalSteps - 1)) * 100}%`;
    }

    window.scrollTo({ top: bookingForm.offsetTop - 100, behavior: "smooth" });
  }

  function validateStep(step) {
    const currentPanel = document.querySelector(`.wizard-step-panel[data-step="${step}"]`);
    if (!currentPanel) return true;

    const inputs = currentPanel.querySelectorAll("input[required], select[required], textarea[required]");
    let valid = true;

    inputs.forEach(input => {
      const customWrap = input.closest(".custom-select-dropdown");
      const toggleBtn = customWrap ? customWrap.querySelector(".custom-select-toggle") : null;

      if (!input.value.trim() || (input.type === "checkbox" && !input.checked)) {
        input.classList.add("is-invalid");
        if (toggleBtn) toggleBtn.classList.add("is-invalid");
        valid = false;
      } else {
        input.classList.remove("is-invalid");
        if (toggleBtn) toggleBtn.classList.remove("is-invalid");
      }
    });

    if (!valid && window.SSB_SHOW_TOAST) {
      window.SSB_SHOW_TOAST("Please fill in all required fields before proceeding.", "warning");
    }
    return valid;
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  }

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    // Collect form data
    const formData = {
      eventName: document.getElementById("field-event-name")?.value || "Executive Summit",
      eventType: document.getElementById("field-event-type")?.value || "Annual Conference",
      eventDate: document.getElementById("field-event-date")?.value || "",
      format: document.getElementById("field-event-format")?.value || "In-Person",
      location: document.getElementById("field-event-location")?.value || "TBD",
      speakerName: document.getElementById("field-speaker-preference")?.value || "Open Recommendations",
      speakerId: document.getElementById("field-speaker-preference")?.selectedOptions?.[0]?.dataset?.id ||
                 document.querySelector("#speaker-preference-menu .dropdown-item.active")?.getAttribute("data-id") || null,
      budget: document.getElementById("field-budget-range")?.value || "$25,000 – $40,000",
      notes: document.getElementById("field-desired-takeaways")?.value || "",
      contactName: document.getElementById("field-contact-name")?.value || "",
      contactEmail: document.getElementById("field-contact-email")?.value || "",
      contactPhone: document.getElementById("field-contact-phone")?.value || ""
    };

    // Save using persistent storage engine
    const newBooking = SSB_STORAGE.createBookingEnquiry(formData);

    // Render success screen
    const wizardContainer = document.getElementById("wizard-container");
    if (wizardContainer) {
      wizardContainer.innerHTML = `
        <div class="ssb-card text-center py-5 px-4 animate__animated animate__fadeIn">
          <div class="mx-auto mb-4" style="width:72px; height:72px; border-radius:50%; background:var(--ssb-success-bg); border:2px solid var(--ssb-success); display:flex; align-items:center; justify-content:center; color:var(--ssb-success);">
            <svg width="36" height="36" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
          </div>
          <h2 class="mb-2">Booking Enquiry Received</h2>
          <p class="lead text-muted mb-4">Your enquiry reference is <strong class="text-gold font-monospace">${newBooking.id}</strong></p>
          
          <div class="p-4 mx-auto mb-4 bg-soft rounded-3 text-start border-theme" style="max-width: 580px; border: 1px solid var(--ssb-border);">
            <div class="row g-2 font-monospace" style="font-size:0.9rem;">
              <div class="col-sm-5 text-muted">Event:</div>
              <div class="col-sm-7 fw-bold">${newBooking.eventName}</div>
              <div class="col-sm-5 text-muted">Speaker Preference:</div>
              <div class="col-sm-7 fw-bold">${newBooking.speakerName}</div>
              <div class="col-sm-5 text-muted">Target Date:</div>
              <div class="col-sm-7">${newBooking.eventDate || 'Flexible'}</div>
              <div class="col-sm-5 text-muted">Format & Location:</div>
              <div class="col-sm-7">${newBooking.format} — ${newBooking.location}</div>
              <div class="col-sm-5 text-muted">Indicative Budget:</div>
              <div class="col-sm-7 text-gold fw-bold">${newBooking.budget}</div>
            </div>
          </div>

          <p class="text-muted small mb-4" style="max-width:540px; margin: 0 auto;">
            Our senior booking agents will verify calendar availability, evaluate logistics, and provide a tailored proposal within 24 business hours. A booking enquiry does not constitute a confirmed contract.
          </p>

          <div class="d-flex flex-wrap justify-content-center gap-3">
            <a href="../dashboard/index.html?view=requests" class="btn btn-gold">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.828.707 3.121A1 1 0 0 0 1 3.828V13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.828a1 1 0 0 0-.293-.707L14 2.828V2a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v.828zM3 2h10v.828L12.172 3.5 8 7.672 3.828 3.5 3 2.828V2z"/></svg>
              View in Client Portal
            </a>
            <a href="speaker-roster.html" class="btn btn-outline-corporate">Explore More Speakers</a>
          </div>
        </div>
      `;
    }
  });

  // Init Step 1
  showStep(1);
});
