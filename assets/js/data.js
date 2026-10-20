/**
 * SummitSpeak Bureau — Core Demonstration Data & Taxonomy
 */

const SSB_DATA = {
  // --- 1. Speaker Roster Database ---
  speakers: [
    {
      id: "marcus-vance",
      name: "Dr. Marcus Vance",
      title: "AI Strategist & Tech Research Director",
      image: "assets/images/speakers/marcus-vance.jpg",
      primaryTopic: "Artificial Intelligence & Technology",
      industry: "Technology",
      location: "San Francisco, USA",
      formats: ["In-Person", "Virtual", "Hybrid"],
      languages: ["English"],
      feeTier: "$25,000 – $40,000",
      featured: true,
      teaser: "Dr. Marcus Vance advises Fortune 500 boards on enterprise generative AI adoption and executive strategy.",
      bio: "Dr. Marcus Vance advises Fortune 500 boards on enterprise generative AI adoption, autonomous workflows, and human-machine synergy. With two decades in frontier research, his keynotes cut through the hype to deliver pragmatic frameworks for organizational transformation.",
      signatureTalks: [
        "The Autonomous Enterprise: Pragmatic AI Roadmaps for 2026 & Beyond",
        "Augmented Leadership: Guiding Human Teams in an Algorithmic Age",
        "Ethical Frontiers: Balancing Velocity, Risk, and Tech Governance"
      ],
      achievements: [
        "Author of the Wall Street Journal bestseller 'Architects of Intelligence'",
        "Former VP of Research at Vanguard AI Labs",
        "Keynote speaker at Global Tech Summit 2024 & 2025"
      ],
      books: ["Architects of Intelligence (2024)", "The Decision Matrix (2021)"],
      audienceSuitability: "Executive leadership, Chief Information Officers, engineering directors, and digital transformation teams."
    },
    {
      id: "elena-rostova",
      name: "Elena Rostova",
      title: "Global Geopolitical & Economic Advisor",
      image: "assets/images/speakers/elena-rostova.jpg",
      primaryTopic: "Economics & Global Affairs",
      industry: "Finance & Banking",
      location: "London, UK / Zurich, Switzerland",
      formats: ["In-Person", "Virtual", "Hybrid"],
      languages: ["English", "French", "German"],
      feeTier: "$30,000 – $50,000",
      featured: true,
      teaser: "Elena Rostova decodes macroeconomic shifts, global supply chain risks, and trade policy for sovereign funds.",
      bio: "Elena Rostova decodes macroeconomic shifts, supply chain recalibration, and multilateral trade risks for sovereign wealth funds and multinational leadership summits. Her data-driven analyses equip decision-makers to navigate turbulent geopolitical landscapes with clarity.",
      signatureTalks: [
        "Navigating Fragmented Markets: Macroeconomic Forecasts for Global Enterprise",
        "Supply Chain Sovereignity & The Next Era of Trade",
        "Capital Flow Shifts: Where the Next Decade's Value Lies"
      ],
      achievements: [
        "Senior Economic Fellow at the European Institute of Strategy",
        "Advisor to multilateral trade organizations across G7 summits",
        "Frequent contributor to Bloomberg & Financial Times"
      ],
      books: ["The Fractured Horizon (2023)"],
      audienceSuitability: "C-suite executives, institutional investors, risk managers, and board members."
    },
    {
      id: "david-oconnor",
      name: "David O'Connor",
      title: "High-Performance Leadership Strategist",
      image: "assets/images/speakers/david-oconnor.jpg",
      primaryTopic: "Leadership & Management",
      industry: "Professional Services",
      location: "Washington D.C., USA",
      formats: ["In-Person", "Hybrid"],
      languages: ["English"],
      feeTier: "$20,000 – $35,000",
      featured: true,
      teaser: "David O'Connor translates high-stakes naval command principles into battle-tested tools for executive leaders.",
      bio: "David O'Connor translates high-stakes naval command principles into battle-tested executive decision-making tools. Having led elite operational task forces across three continents, his high-energy sessions teach organizations how to forge resilient, autonomous teams that thrive under intense pressure.",
      signatureTalks: [
        "Command Under Pressure: Decentralized Decision-Making in Ambiguity",
        "The Culture of Relentless Accountability and Mutual Trust",
        "From Crisis to Momentum: Navigating Radical Industry Disruption"
      ],
      achievements: [
        "24 years distinguished service with Command Leadership Citations",
        "Executive Coach to 40+ Fortune 100 leadership teams",
        "Featured on Harvard Business Review's Leadership Voices series"
      ],
      books: ["Decide and Deliver: Commander's Playbook (2022)"],
      audienceSuitability: "Senior management, sales kickoff summits, operations executives, and high-growth leadership."
    },
    {
      id: "maya-chen",
      name: "Maya Chen",
      title: "Design Futurist & Serial Tech Founder",
      image: "assets/images/speakers/maya-chen.jpg",
      primaryTopic: "Innovation & Future Trends",
      industry: "Retail & Consumer Brands",
      location: "Singapore / Silicon Valley",
      formats: ["In-Person", "Virtual", "Hybrid"],
      languages: ["English", "Mandarin"],
      feeTier: "$25,000 – $38,000",
      featured: true,
      teaser: "Maya Chen is an acclaimed technology entrepreneur and design innovator dissecting modern customer psychology.",
      bio: "Maya Chen is an acclaimed technology entrepreneur and design innovator who built two venture-backed consumer platforms acquired by tech conglomerates. Her keynotes dissect consumer psychology, frictionless user experiences, and breakthrough product innovation.",
      signatureTalks: [
        "Frictionless Horizons: Engineering Customer Obsession in 2026",
        "Speed as a Moat: Radical Experimentation in Legacy Enterprises",
        "The Metaverse & Spatial Computing: What Matters for Brand ROI"
      ],
      achievements: [
        "Recipient of the Global Innovation Pioneer Award 2024",
        "Guest Lecturer on Product Strategy at Stanford University",
        "Forbes 40 Under 40 Honoree"
      ],
      books: ["Zero to Delight: Human-Centered Product Velocity (2025)"],
      audienceSuitability: "Product leaders, marketing executives, innovation teams, and brand strategists."
    },
    {
      id: "julian-thorne",
      name: "Julian Thorne",
      title: "Organizational Psychologist",
      image: "assets/images/speakers/julian-thorne.jpg",
      primaryTopic: "Workplace Culture & Wellbeing",
      industry: "Healthcare",
      location: "Boston, USA",
      formats: ["In-Person", "Virtual", "Hybrid"],
      languages: ["English"],
      feeTier: "$18,000 – $30,000",
      featured: true,
      teaser: "Julian Thorne investigates why teams struggle together and how elite leaders cultivate psychological safety.",
      bio: "Julian Thorne investigates why smart people work poorly together and how elite organizations cultivate psychological safety, focus, and enduring motivation. His engaging, evidence-based presentations consistently receive the highest audience ratings.",
      signatureTalks: [
        "The Architecture of High-Trust Teams: Beyond the Buzzwords",
        "Sustainable Focus in the Age of Digital Overload",
        "Retaining Top Performers: The Hidden Drivers of Executive Engagement"
      ],
      achievements: [
        "Bestselling Author of 'The Connected Workplace'",
        "Adjunct Professor of Behavioral Sciences",
        "Advises corporate HR leadership across healthcare, technology, and finance"
      ],
      books: ["The Connected Workplace (2023)", "Culture of Clarity (2019)"],
      audienceSuitability: "People Officers, enterprise HR directors, executive retreats, and employee summits."
    },
    {
      id: "amara-okafor",
      name: "Amara Okafor",
      title: "Sustainable Finance & ESG Leader",
      image: "assets/images/speakers/amara-okafor.jpg",
      primaryTopic: "Sustainability & Social Impact",
      industry: "Energy & Sustainability",
      location: "Nairobi, Kenya / New York, USA",
      formats: ["In-Person", "Virtual", "Hybrid"],
      languages: ["English", "Swahili"],
      feeTier: "$22,000 – $36,000",
      featured: true,
      teaser: "Amara Okafor bridges corporate capital allocation with environmental resilience and sustainable transformation.",
      bio: "Amara Okafor bridges corporate capital allocation with tangible environmental and social transformation. An advisor to green infrastructure funds and sovereign investors, her keynote presentations demonstrate that sustainability is an engine of long-term economic resilience and alpha.",
      signatureTalks: [
        "Capital with Purpose: Profiting from the Net-Zero Transition",
        "ESG Beyond Compliance: Unlocking Multi-Decade Enterprise Value",
        "Emerging Market Leaps: Renewable Infrastructure & Innovation"
      ],
      achievements: [
        "Lead Strategic Advisor for the Global Climate Finance Consortium",
        "Named World Economic Forum Young Global Leader",
        "Recognized by Financial Times as Top 50 Women in Capital Markets"
      ],
      books: ["Green Alpha: Investing in the Next Industrial Revolution (2024)"],
      audienceSuitability: "Institutional investors, corporate sustainability committees, energy executives, and annual shareholder meetings."
    },
    {
      id: "kenji-tanaka",
      name: "Kenji Tanaka",
      title: "Supply Chain & Industry 4.0 Strategist",
      image: "assets/images/speakers/kenji-tanaka.jpg",
      primaryTopic: "Manufacturing & Global Operations",
      industry: "Technology",
      location: "Tokyo, Japan / Frankfurt, Germany",
      formats: ["In-Person", "Hybrid", "Virtual"],
      languages: ["English", "Japanese"],
      feeTier: "$28,000 – $45,000",
      featured: true,
      teaser: "Kenji Tanaka advises global enterprises on robotics integration, autonomous logistics, and industrial resilience.",
      bio: "Kenji Tanaka advises multinational conglomerates on robotics integration, autonomous supply lines, and industrial resilience. His high-impact keynotes deliver actionable frameworks for navigating volatile global logistics networks with speed and precision.",
      signatureTalks: [
        "Autonomous Supply Networks: From Fragile Just-In-Time to Anti-Fragility",
        "Industry 4.0 in Action: Deploying Robotics & Edge AI in Modern Operations",
        "Geopolitical Trade Shockwaves: Re-Engineering Cross-Border Supply Chains"
      ],
      achievements: [
        "Former Chief Operations Architect at Global Industrial Tech Alliance",
        "Author of the manufacturing leadership bestseller 'Resilience by Design'",
        "Keynote speaker at World Advanced Manufacturing Forum 2024 & 2025"
      ],
      books: ["Resilience by Design (2024)", "Autonomous Logistics (2021)"],
      audienceSuitability: "Chief Operating Officers, procurement executives, supply chain directors, and manufacturing leaders."
    },
    {
      id: "sarah-jenkins",
      name: "Sarah Jenkins",
      title: "Enterprise Transformation",
      image: "assets/images/speakers/sarah-jenkins.jpg",
      primaryTopic: "Leadership & Management",
      industry: "Professional Services",
      location: "Chicago, USA / London, UK",
      formats: ["In-Person", "Virtual", "Hybrid"],
      languages: ["English"],
      feeTier: "$24,000 – $38,000",
      featured: true,
      teaser: "Sarah Jenkins is an executive coach and strategist who guides global enterprise boards through complex growth.",
      bio: "Sarah Jenkins is an executive coach and organizational strategist who guides global executive boards through massive scale, restructuring, and change management. Her commanding keynote talks empower executive teams to break silos and align around high-velocity goals.",
      signatureTalks: [
        "Velocity with Purpose: Scaling Enterprise Execution in Rapid Disruption",
        "The High-Performance Executive Board: Navigating Strategic Pivot Points",
        "Breaking Silos: Unifying Global Cross-Functional Leaders for Outsized Results"
      ],
      achievements: [
        "Advisor to 35+ Fortune 500 executive leadership teams",
        "Regular keynote contributor at Global Leadership Summits across 12 countries",
        "Distinguished fellow at Institute for Executive Strategy"
      ],
      books: ["High-Velocity Leadership (2025)", "The Boardroom Shift (2022)"],
      audienceSuitability: "Board members, Chief Executive Officers, managing directors, and global enterprise leadership retreats."
    }
  ],

  // --- 2. Topics Taxonomy ---
  topics: [
    {
      id: "leadership",
      title: "Leadership & Management",
      icon: "bi-shield-check",
      description: "Executive leadership, organizational change, team development, decision-making, and strategic thinking.",
      speakersCount: "14 Speakers"
    },
    {
      id: "ai-technology",
      title: "Artificial Intelligence & Technology",
      icon: "bi-cpu",
      description: "AI adoption, digital transformation, cybersecurity awareness, emerging tech, and responsible governance.",
      speakersCount: "18 Speakers"
    },
    {
      id: "innovation",
      title: "Innovation & Future Trends",
      icon: "bi-lightbulb",
      description: "Disruptive business models, design thinking, future forecasting, and breakthrough product development.",
      speakersCount: "12 Speakers"
    },
    {
      id: "motivation",
      title: "Motivation & Performance",
      icon: "bi-trophy",
      description: "Personal resilience, high performance habits, team alignment, adaptability, and mindset under adversity.",
      speakersCount: "16 Speakers"
    },
    {
      id: "entrepreneurship",
      title: "Entrepreneurship & Business Growth",
      icon: "bi-graph-up-arrow",
      description: "Venture building, scaling operations, founder resilience, capital strategy, and market expansion.",
      speakersCount: "11 Speakers"
    },
    {
      id: "dei",
      title: "Diversity, Equity & Inclusion",
      icon: "bi-people",
      description: "Inclusive leadership, global talent strategy, multi-generational workforce collaboration, and belonging.",
      speakersCount: "9 Speakers"
    },
    {
      id: "sales-marketing",
      title: "Sales & Marketing",
      icon: "bi-megaphone",
      description: "Brand positioning, revenue acceleration, customer psychology, digital storytelling, and negotiation.",
      speakersCount: "13 Speakers"
    },
    {
      id: "economics",
      title: "Economics & Global Affairs",
      icon: "bi-globe",
      description: "Macroeconomic forecasting, geopolitics, global trade policies, market risk, and capital flows.",
      speakersCount: "10 Speakers"
    },
    {
      id: "workplace-culture",
      title: "Workplace Culture & Wellbeing",
      icon: "bi-heart-pulse",
      description: "Employee engagement, psychological safety, hybrid work dynamics, burnout prevention, and clarity.",
      speakersCount: "15 Speakers"
    },
    {
      id: "sustainability",
      title: "Sustainability & Social Impact",
      icon: "bi-tree",
      description: "Net-zero transformation, ESG capital allocation, environmental stewardship, and ethical governance.",
      speakersCount: "8 Speakers"
    }
  ],

  // --- 3. Industries Taxonomy ---
  industries: [
    { name: "Technology", icon: "bi-laptop", desc: "Software, Cloud, AI, Semiconductor, and Cyber Platforms" },
    { name: "Finance & Banking", icon: "bi-bank", desc: "Investment Banking, Wealth Management, Fintech, and Insurance" },
    { name: "Healthcare", icon: "bi-hospital", desc: "Pharmaceuticals, Biotech, Hospital Systems, and Health Tech" },
    { name: "Manufacturing", icon: "bi-gear-wide-connected", desc: "Advanced Automation, Industrial Engineering, and Supply Chains" },
    { name: "Education", icon: "bi-mortarboard", desc: "Higher Education Institutions, Academic Summits, and EdTech" },
    { name: "Retail & Consumer Brands", icon: "bi-shop", desc: "E-Commerce, Luxury Goods, Omnichannel Retail, and FMCG" },
    { name: "Professional Services", icon: "bi-briefcase", desc: "Management Consulting, Legal Advisory, and Accounting Firms" },
    { name: "Energy & Sustainability", icon: "bi-lightning-charge", desc: "Renewable Utilities, Grid Infrastructure, and Clean Tech" }
  ],

  // --- 4. Editorial Insights Articles ---
  insights: [
    {
      id: "keynote-roi-2026",
      title: "Measuring Keynote ROI: How Top Event Planners Quantify Speaker Impact",
      category: "Speaker Selection Guides",
      date: "October 2026",
      readTime: "6 min read",
      image: "assets/images/insights/backstage.jpg",
      snippet: "Discover how Fortune 500 conference organizers align speaker briefs with measurable post-event sentiment and strategic organizational change."
    },
    {
      id: "ai-keynote-trends",
      title: "Navigating the AI Keynote Wave: Separating Substance from Hype",
      category: "Innovation and Technology",
      date: "September 2026",
      readTime: "8 min read",
      image: "assets/images/about/panel.jpg",
      snippet: "Every conference wants an AI keynote, but what actually moves executive audiences? A breakdown of pragmatic tech leadership topics."
    },
    {
      id: "contract-and-rider-playbook",
      title: "The Enterprise Speaker Contract & Rider Guide: Avoiding Last-Minute Friction",
      category: "Corporate Event Planning",
      date: "August 2026",
      readTime: "5 min read",
      image: "assets/images/events/summit.jpg",
      snippet: "An operational overview of audiovisual requirements, recording rights agreements, travel coordination, and contingency clauses."
    }
  ],

  // --- 5. Initial Client Dashboard State (Demonstration Data) ---
  dashboardInit: {
    client: {
      companyName: "Apex Global Enterprises",
      contactPerson: "Sarah Jenkins",
      title: "Senior Director of Global Events",
      email: "sarah.jenkins@apexglobal.com",
      phone: "+1 (555) 392-8104",
      currency: "USD ($)",
      timeZone: "Eastern Time (US & Canada) UTC-05:00",
      role: "Company Administrator",
      team: [
        { name: "Sarah Jenkins", email: "sarah.jenkins@apexglobal.com", role: "Company Administrator", status: "Active" },
        { name: "Liam Vance", email: "liam.vance@apexglobal.com", role: "Event Manager", status: "Active" },
        { name: "Rachel Adams", email: "rachel.adams@apexglobal.com", role: "Finance User", status: "Active" }
      ]
    },
    shortlist: [],
    bookingRequests: [
      {
        id: "SSB-2026-0912",
        eventName: "Global Leadership & Innovation Summit 2026",
        speakerName: "Dr. Marcus Vance",
        speakerId: "marcus-vance",
        eventDate: "2026-11-18",
        requestDate: "2026-10-01",
        format: "In-Person",
        location: "Chicago, IL — McCormick Place",
        budget: "$35,000 USD",
        status: "Contract Pending",
        lastUpdated: "2026-10-08",
        proposedFee: "$35,000",
        notes: "Opening keynote presentation, 45 minutes + 15 min executive Q&A."
      },
      {
        id: "SSB-2026-0884",
        eventName: "European Macroeconomic Executive Forum",
        speakerName: "Elena Rostova",
        speakerId: "elena-rostova",
        eventDate: "2026-12-05",
        requestDate: "2026-09-20",
        format: "In-Person",
        location: "Zurich, Switzerland — Baur au Lac",
        budget: "$40,000 USD",
        status: "Confirmed",
        lastUpdated: "2026-10-05",
        proposedFee: "$40,000",
        notes: "Dinner keynote for 120 institutional investors."
      },
      {
        id: "SSB-2026-1004",
        eventName: "Annual Sales Kickoff & Performance Summit",
        speakerName: "David O'Connor",
        speakerId: "david-oconnor",
        eventDate: "2027-01-15",
        requestDate: "2026-10-09",
        format: "In-Person",
        location: "Orlando, FL — Omni ChampionsGate",
        budget: "$25,000 USD",
        status: "Under Review",
        lastUpdated: "2026-10-10",
        proposedFee: "Pending Bureau Review",
        notes: "Keynote on decentralized high-performance team accountability."
      }
    ],
    contracts: [
      {
        id: "CTR-2026-0912",
        bookingRef: "SSB-2026-0912",
        docName: "Speaker Engagement Agreement — Dr. Marcus Vance",
        type: "Booking Agreement",
        issueDate: "2026-10-06",
        status: "Awaiting Client Signature",
        amount: "$35,000",
        version: "v1.2",
        signUrl: "#"
      },
      {
        id: "CTR-2026-0884",
        bookingRef: "SSB-2026-0884",
        docName: "Fully Executed Agreement — Elena Rostova",
        type: "Booking Agreement",
        issueDate: "2026-09-24",
        status: "Signed & Confirmed",
        amount: "$40,000",
        version: "Final",
        signUrl: "#"
      }
    ],
    invoices: [
      {
        id: "INV-2026-0884-A",
        bookingRef: "SSB-2026-0884",
        issueDate: "2026-09-25",
        dueDate: "2026-10-15",
        subtotal: 20000,
        tax: 0,
        total: 20000,
        amountPaid: 20000,
        balance: 0,
        status: "Paid",
        description: "Initial 50% Deposit for Elena Rostova Keynote Engagement"
      },
      {
        id: "INV-2026-0912-A",
        bookingRef: "SSB-2026-0912",
        issueDate: "2026-10-07",
        dueDate: "2026-10-21",
        subtotal: 17500,
        tax: 0,
        total: 17500,
        amountPaid: 0,
        balance: 17500,
        status: "Payment Pending",
        description: "Initial 50% Deposit for Dr. Marcus Vance Keynote Engagement"
      }
    ],
    notifications: [
      { id: 1, title: "Contract Ready for Review", body: "Agreement CTR-2026-0912 for Dr. Marcus Vance is prepared for signature.", time: "2 hours ago", unread: true, link: "contracts" },
      { id: 2, title: "Invoice Generated", body: "Deposit invoice INV-2026-0912-A ($17,500) has been issued.", time: "1 day ago", unread: true, link: "billing" },
      { id: 3, title: "Booking Confirmed", body: "Elena Rostova for European Macroeconomic Forum is fully confirmed.", time: "4 days ago", unread: false, link: "confirmed" },
      { id: 4, title: "Speaker Availability Confirmed", body: "Dr. Marcus Vance confirmed availability for November 18, 2026.", time: "5 days ago", unread: false, link: "requests" }
    ]
  }
};
