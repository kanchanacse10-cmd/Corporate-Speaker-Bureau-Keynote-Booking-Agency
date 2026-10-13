/**
 * SummitSpeak Bureau — Client State & Storage Management
 */

const SSB_STORAGE = {
  STORAGE_KEY: "ssb_client_state_v2",

  // Initialize or fetch state
  getState() {
    try {
      if (localStorage.getItem("ssb_client_state_v1")) {
        localStorage.removeItem("ssb_client_state_v1");
      }
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Storage load error:", e);
    }
    // Fallback to default demonstration state
    const initial = JSON.parse(JSON.stringify(SSB_DATA.dashboardInit));
    this.saveState(initial);
    return initial;
  },

  saveState(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  },

  // --- Shortlist Operations ---
  getShortlist() {
    const state = this.getState();
    return state.shortlist || [];
  },

  isInShortlist(speakerId) {
    const list = this.getShortlist();
    return list.some(item => item.speakerId === speakerId);
  },

  toggleShortlist(speakerId, customNote = "") {
    const state = this.getState();
    const index = state.shortlist.findIndex(item => item.speakerId === speakerId);
    let added = false;

    if (index >= 0) {
      state.shortlist.splice(index, 1);
      added = false;
    } else {
      state.shortlist.push({
        speakerId: speakerId,
        notes: customNote || "Added from speaker directory",
        dateAdded: new Date().toISOString().split("T")[0]
      });
      added = true;
    }

    this.saveState(state);
    window.dispatchEvent(new CustomEvent("ssb:shortlist-updated", { detail: { speakerId, added, count: state.shortlist.length } }));
    return added;
  },

  updateShortlistNote(speakerId, note) {
    const state = this.getState();
    const item = state.shortlist.find(i => i.speakerId === speakerId);
    if (item) {
      item.notes = note;
      this.saveState(state);
    }
  },

  // --- Booking Operations ---
  createBookingEnquiry(enquiryData) {
    const state = this.getState();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `SSB-2026-${randomNum}`;
    const today = new Date().toISOString().split("T")[0];

    const newBooking = {
      id: newId,
      eventName: enquiryData.eventName || "Corporate Event",
      speakerName: enquiryData.speakerName || "Speaker Recommendations Requested",
      speakerId: enquiryData.speakerId || null,
      eventDate: enquiryData.eventDate || today,
      requestDate: today,
      format: enquiryData.format || "In-Person",
      location: enquiryData.location || "To Be Confirmed",
      budget: enquiryData.budget || "$25,000 – $40,000",
      status: "Submitted",
      lastUpdated: today,
      proposedFee: "Pending Bureau Review",
      notes: enquiryData.notes || "Booking enquiry submitted via online form."
    };

    state.bookingRequests.unshift(newBooking);

    // Add corresponding notification
    state.notifications.unshift({
      id: Date.now(),
      title: "Booking Enquiry Submitted",
      body: `Booking request ${newId} for "${newBooking.eventName}" has been logged and is under review by our agents.`,
      time: "Just now",
      unread: true,
      link: "requests"
    });

    this.saveState(state);
    return newBooking;
  },

  // --- Contract Operations ---
  signContract(contractId, signatureName) {
    const state = this.getState();
    const contract = state.contracts.find(c => c.id === contractId);
    if (contract) {
      contract.status = "Signed & Confirmed";
      contract.signedBy = signatureName;
      contract.signedDate = new Date().toISOString().split("T")[0];

      // Update related booking status if applicable
      const relatedBooking = state.bookingRequests.find(b => b.id === contract.bookingRef);
      if (relatedBooking) {
        relatedBooking.status = "Payment Pending";
      }

      state.notifications.unshift({
        id: Date.now(),
        title: "Contract Executed",
        body: `Agreement ${contractId} has been successfully signed by ${signatureName}.`,
        time: "Just now",
        unread: true,
        link: "contracts"
      });

      this.saveState(state);
      return true;
    }
    return false;
  },

  // --- Invoice & Payment Operations ---
  payInvoice(invoiceId, paymentMethod) {
    const state = this.getState();
    const invoice = state.invoices.find(i => i.id === invoiceId);
    if (invoice) {
      invoice.amountPaid = invoice.total;
      invoice.balance = 0;
      invoice.status = "Paid";
      invoice.paymentMethod = paymentMethod;
      invoice.paymentDate = new Date().toISOString().split("T")[0];

      // If all invoices for a booking are paid, update booking to Confirmed
      const relatedBooking = state.bookingRequests.find(b => b.id === invoice.bookingRef);
      if (relatedBooking) {
        relatedBooking.status = "Confirmed";
      }

      state.notifications.unshift({
        id: Date.now(),
        title: "Payment Processed",
        body: `Payment for invoice ${invoiceId} ($${invoice.total.toLocaleString()}) confirmed via ${paymentMethod}.`,
        time: "Just now",
        unread: true,
        link: "billing"
      });

      this.saveState(state);
      return true;
    }
    return false;
  },

  // --- Notification Operations ---
  markAllNotificationsRead() {
    const state = this.getState();
    state.notifications.forEach(n => n.unread = false);
    this.saveState(state);
  },

  // --- Company Profile ---
  updateProfile(profileData) {
    const state = this.getState();
    state.client = { ...state.client, ...profileData };
    this.saveState(state);
    return state.client;
  }
};
