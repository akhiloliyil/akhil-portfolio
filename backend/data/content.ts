export const profile = {
  name: "Akhil Kumar",
  title: "Lead Product Designer · UI/UX & CX · Design Systems",
  location: "Dubai, United Arab Emirates",
  email: "akhiloliyil@gmail.com",
  phone: "+971 565862460",
  linkedin: "https://www.linkedin.com/in/akhil-kumar-49789656/",
  blurb:
    "Lead Product Designer shaping AI-driven, user-centered experiences end to end — from research and design systems to production React, Next.js, and React Native. Six years at Danube Home driving e-commerce, OMS, and mobile platforms, turning UX and CX decisions into measurable business growth, with prior work across marketplaces, healthcare apps, and CMS builds.",
  focus: [
    "AI-Driven Experiences",
    "Design Systems",
    "React · Next.js · React Native",
    "E-commerce",
    "Business Growth",
  ],
};

export const stats = [
  { value: "16+", label: "years across design & front-end" },
  { value: "8", label: "companies, UAE & India" },
  { value: "9", label: "shipped product platforms" },
];

export const about = {
  lead:
    "I design AI-driven digital products and customer experiences that don't just look good — they perform.",
  paragraphs: [
    "With 16+ years as a UI/UX & CX lead designer and front-end developer, I build scalable, conversion-focused products across e-commerce, mobile apps, and complex web platforms — turning business goals, customer expectations, and user needs into intuitive, AI-enabled experiences that drive measurable results.",
    "What sets me apart is bridging UX, CX, AI, and engineering. I don't just design interfaces — I create seamless end-to-end customer journeys and make sure they're practical, scalable, and built efficiently. Combining AI-powered design workflows with hands-on front-end work closes the design-to-development gap, accelerates delivery, and keeps experiences consistent across every touchpoint.",
  ],
  delivers: [
    "Higher conversion, engagement, and customer satisfaction through UX, CX, and AI-driven design",
    "Simplified workflows for complex, data-rich systems",
    "Scalable design systems that improve consistency, usability, and delivery speed",
    "AI-assisted design and rapid prototyping that accelerate product development",
    "Strong alignment between product strategy, customer experience, and business goals",
  ],
  expertise: [
    {
      group: "Design & Strategy",
      items: [
        "AI-Driven Product Design",
        "UX Strategy",
        "CX Strategy",
        "Product Design",
        "Customer Journey Mapping",
        "Interaction Design",
        "Design Systems",
        "Accessibility (WCAG)",
        "Conversion Optimization",
      ],
    },
    {
      group: "Build",
      items: ["React", "Next.js", "React Native"],
    },
  ],
};

export type Project = {
  id: string;
  name: string;
  org: string;
  period?: string;
  role?: string;
  link?: string;
  featured?: boolean;
  summary: string;
  details: string[];
  stack: string[];
  frameType: "app" | "dashboard" | "ecommerce";
};

export const projects: Project[] = [
  {
    id: "yara",
    name: "YARA — AI Shopping Assistant",
    org: "Danube Home",
    role: "UI Lead",
    link: "https://www.danubehome.com/ae/en/yara-ai-search",
    featured: true,
    summary:
      "Next-generation AI shopping assistant transforming retail across digital and physical stores. As UI Lead, I drove the end-to-end experience strategy — intelligent, conversational, and consistent across every touchpoint.",
    details: [
      "AI-powered, intent-driven product discovery with personalized recommendations",
      "Conversational AI with text and voice-enabled real-time assistance",
      "In-store QR scan-to-connect for instant specs, pricing, and availability",
      "\"Imagine with YARA\" — visualize products in curated interior settings",
      "Personalized, omnichannel UX unified across web and in-store",
    ],
    stack: ["AI UX", "Conversational UI", "Design System", "Omnichannel"],
    frameType: "app",
  },
  {
    id: "hexa",
    name: "Hexa — Showroom Sales App",
    org: "Danube Home",
    period: "Jan 2024 — Present",
    summary:
      "Mobile app that streamlines showroom sales operations — fast, role-aware, and built for accurate transactions on the floor.",
    details: [
      "Role-based dashboards for sales staff and managers with key metrics",
      "Product search, rich detail pages, and multi-basket order placement",
      "Real-time stock checks with low and out-of-stock alerts",
      "Customer profiles with sortable sales history and status tracking",
    ],
    stack: ["Adobe XD", "React Native", "Design System"],
    frameType: "app",
  },
  {
    id: "danube-app",
    name: "Danube Home — Mobile App",
    org: "Danube Home",
    period: "Jan 2023 — Present",
    summary:
      "React Native shopping app delivering a seamless, feature-rich experience for the Middle East's largest home retailer.",
    details: [
      "Digital wallet, reward points, and gift-card management",
      "Multi-step secure checkout with real-time tracking and reschedule",
      "Predictive search, rich PDPs, and layered PLP filtering",
      "Click-and-collect with fast address entry and autocomplete",
    ],
    stack: ["Adobe XD", "React Native"],
    frameType: "app",
  },
  {
    id: "danubehome-web",
    name: "Danubehome.com — E-commerce Website",
    org: "Danube Home",
    period: "Sep 2020 — Present",
    link: "https://www.danubehome.com",
    summary:
      "Modern, conversion-focused storefront built on ReactJS and SCSS, designed for clarity and a strong search experience.",
    details: [
      "YARA AI Search — natural-language, intent-aware product search with personalized results",
      "Clean homepage, sticky responsive navigation, and robust discovery",
      "Layered PLP filtering and comprehensive PDPs with reviews",
      "Wallets, rewards, gift cards, and secure multi-option checkout",
      "Account management, order history, and click-and-collect",
    ],
    stack: ["ReactJS", "SCSS", "Adobe XD", "AI Search"],
    frameType: "ecommerce",
  },
  {
    id: "oms",
    name: "Order Management System (OMS)",
    org: "Danube Home",
    period: "Sep 2020 — Present",
    summary:
      "Internal platform for handling and tracking orders end to end — real-time, role-based, and built for operational efficiency.",
    details: [
      "Live dashboard of orders, deliveries, and sales performance",
      "Sortable, filterable order lists with detailed order actions",
      "Inventory linkage with replenishment alerts to prevent overselling",
      "Role-based access and exportable reporting and analytics",
    ],
    stack: ["Adobe XD", "ReactJS", "CSS"],
    frameType: "dashboard",
  },
  {
    id: "price-tag",
    name: "Dynamic Price Tag Editor",
    org: "Danube Home",
    summary:
      "Batch price-tag editor and catalog system with live preview — designed for high-volume, accurate in-store printing.",
    details: [
      "Batch tag editing with templates, live preview, and bulk actions",
      "Central product catalog with search, filters, and CSV/Excel import-export",
      "Real-time inventory updates and low-stock alerts",
      "Role-based access across editor, catalog, and print settings",
    ],
    stack: ["Adobe XD", "Design System"],
    frameType: "dashboard",
  },
  {
    id: "omnichannel",
    name: "Omnichannel Retail Experience Platform",
    org: "Danube Home",
    role: "Concept",
    summary:
      "A concept that bridges physical stores and digital convenience — from discovery to visualization to purchase in one connected, frictionless flow.",
    details: [
      "Smart Check-in Kiosk — customers log in instantly, access their preferences, and continue their journey without friction",
      "Frictionless Checkout UI — fast, intuitive checkout with clear pricing, delivery options, and flexible payments",
      "AI-Powered Room Design (PureSpace-inspired) — visualize furniture in your own space, explore styles, and shop directly from the design",
      "Connected discovery → visualization → purchase across physical and digital channels",
      "Improves user experience, conversion, and in-store engagement",
    ],
    stack: ["UI/UX Design", "Product Thinking", "UX Strategy", "AI UX"],
    frameType: "app",
  },
  {
    id: "pim",
    name: "Product Information Management (PIM)",
    org: "Danube Home",
    summary:
      "Comprehensive PIM interface for managing product data at scale — accurate, structured, and integration-ready.",
    details: [
      "Central dashboard with real-time product and inventory status",
      "Sortable catalog with advanced filters and bulk updates",
      "Media management and a hierarchical category structure",
      "Role-based access and API integration with ERP and e-commerce",
    ],
    stack: ["Adobe XD", "Design System"],
    frameType: "dashboard",
  },
  {
    id: "sleephubz",
    name: "Sleephubz.com — Sleep E-commerce",
    org: "Danube Home",
    summary:
      "UI/UX lead for a mattress and sleep-products storefront, focused on conversion, usability, and a scalable design system.",
    details: [
      "End-to-end UX for discovery, PDP, cart, and checkout",
      "Conversion gains by optimizing journeys and reducing friction",
      "Scalable design system for consistent web and mobile UI",
      "Usability testing and data analysis to refine the experience",
    ],
    stack: ["Figma", "A/B Testing", "Design System"],
    frameType: "ecommerce",
  },
];

export type Role = {
  company: string;
  title?: string;
  period: string;
  location?: string;
  blurb?: string;
  highlights?: string[];
};

export const experience: Role[] = [
  {
    company: "Danube Home",
    title: "UI/UX & CX Lead Designer · Product Designer · Front-End Developer",
    period: "Sep 2020 — Present",
    location: "United Arab Emirates · On-site",
    blurb:
      "Largest furniture and home-improvement brand in the Middle East.",
    highlights: [
      "Led end-to-end UI/UX & CX for e-commerce and mobile apps — AI-driven, user-centered experiences that lifted engagement, conversion, and satisfaction",
      "Designed scalable, AI-enabled design systems for consistent, accessible experiences across web and mobile",
      "Ran UX research, journey mapping, usability testing, and data analysis — with AI tools — to surface pain points and optimize journeys",
      "Redesigned critical journeys like onboarding and checkout, reducing drop-offs and increasing conversion through data-driven UX",
      "Partnered with product, engineering, and cross-functional teams to ship responsive, customer-centric products aligned to business goals",
      "Bridged design and development hands-on in React, Next.js, and React Native, using AI-assisted workflows to speed prototyping and handoff",
    ],
  },
  {
    company: "Organic & Real.com",
    title: "Sr. UI/UX Designer / Magento Front-End Developer",
    period: "Aug 2019 — Sep 2020",
    location: "Dubai, UAE",
    blurb:
      "UAE organic grocery store — certified organic, vegan, gluten-free, keto, and paleo products.",
    highlights: [
      "Built the Magento e-commerce site from scratch — themes, layouts, and checkout",
      "Responsive front-end in HTML5, CSS, jQuery, and Bootstrap, optimized across devices",
      "Custom modules to extend catalog functionality, performance, and usability",
      "Brand-aligned visuals designed in Adobe XD, Photoshop, and Illustrator",
    ],
  },
  {
    company: "Shopinc.com",
    title: "Sr. UI/UX Designer / Magento Front-End Developer",
    period: "May 2018 — Jul 2019",
    location: "Dubai Marina, UAE",
    blurb:
      "UAE e-commerce marketplace connecting buyers and sellers across categories.",
    highlights: [
      "Designed and built a Magento multi-vendor marketplace from the ground up",
      "Responsive, engaging UI in HTML5, CSS, jQuery, and Bootstrap",
      "Optimized navigation, search, and multi-vendor management",
      "Brand-cohesive visuals in Adobe XD, Photoshop, and Illustrator",
    ],
  },
  {
    company: "Citrus Informatics (India) Pvt Ltd",
    title: "Sr. UI/UX Designer / Web Designer / Front-End Developer",
    period: "Dec 2016 — Feb 2018",
    location: "Cochin, India",
    blurb:
      "Global IT solutions provider — healthcare apps, desktop apps, and CMS sites for primarily US clients.",
    highlights: [
      "UI/UX research for healthcare mobile apps, desktop apps, and CMS websites",
      "Designed user-centric product UIs aligned to client objectives and trends",
      "Built and maintained responsive CMS sites on Joomla and WordPress",
      "Created design systems and style guides for consistency and scalability",
      "Ensured accessible, inclusive designs to usability standards",
    ],
  },
  {
    company: "eWoke Innovative Solutions Pvt. Ltd",
    title: "UI/UX Designer / Web Designer / Front-End Developer",
    period: "Oct 2013 — Nov 2016",
    location: "Kochi, India",
    blurb:
      "Digital creative agency serving clients across the US, Middle East, Europe, and UK.",
    highlights: [
      "Built responsive e-commerce sites on Magento, ZenCart, CodeIgniter, and Yii",
      "Delivered shopping cart, payment gateway, and customer-management features",
      "Customized and optimized storefronts to client requirements",
      "Conducted UI research and product design for intuitive navigation",
      "Enhanced scalability and cross-device responsiveness",
    ],
  },
  {
    company: "Eden Software",
    title: "UI/UX Designer / Web Designer / Front-End Developer",
    period: "Feb 2013 — Sep 2013",
    location: "Kochi, India",
    highlights: [
      "Designed and built web interfaces with Google Web Designer and Adobe tools",
      "Delivered responsive, user-friendly e-commerce designs",
      "HTML5, CSS, jQuery, Bootstrap, WordPress, and Magento",
    ],
  },
  {
    company: "Viaweb Solutions",
    title: "UI/UX Designer / Web Designer / Front-End Developer",
    period: "Feb 2012 — Feb 2013",
    location: "Kochi, India",
    highlights: [
      "Designed and built web interfaces with Google Web Designer and Adobe tools",
      "Delivered responsive, user-friendly e-commerce designs",
      "HTML5, CSS, jQuery, Bootstrap, WordPress, and Magento",
    ],
  },
  {
    company: "Media Crow",
    title: "Web Designer / HTML Developer",
    period: "Apr 2010 — Feb 2012",
    location: "Thrissur, India",
    highlights: [
      "Designed and built web interfaces with Google Web Designer and Adobe tools",
      "Delivered responsive, user-friendly e-commerce designs",
      "HTML5, CSS, jQuery, Bootstrap, and WordPress",
    ],
  },
];

export type Shot = {
  title: string;
  tag: string;
  url: string;
  src: string;
  projectId?: string;
};

// Placeholder imagery via Lorem Picsum (stable per seed). Swap `src` for real
// screenshots in /images/projects when available. `projectId` links a shot to
// its full details in `projects` for the lightbox.
export const gallery: Shot[] = [
  {
    title: "YARA — AI Assistant",
    tag: "AI · Conversational UI",
    url: "yara.danubehome.com",
    src: "https://picsum.photos/seed/yara-ai/1280/854",
    projectId: "yara",
  },
  {
    title: "Hexa — Showroom App",
    tag: "Mobile · Sales",
    url: "hexa.danubehome.com",
    src: "https://picsum.photos/seed/hexa-store/1280/854",
    projectId: "hexa",
  },
  {
    title: "Danube Home — App",
    tag: "React Native",
    url: "app.danubehome.com",
    src: "https://picsum.photos/seed/danube-app/1280/854",
    projectId: "danube-app",
  },
  {
    title: "Danube Property — App",
    tag: "Mobile · Real Estate",
    url: "danubeproperties.com",
    src: "https://picsum.photos/seed/danube-property/1280/854",
  },
  {
    title: "Seller Hub — Marketplace",
    tag: "Mobile · Dashboard",
    url: "sellerhub.danubehome.com",
    src: "https://picsum.photos/seed/seller-hub/1280/854",
  },
  {
    title: "Danubehome.com",
    tag: "E-commerce",
    url: "danubehome.com",
    src: "https://picsum.photos/seed/danube-web/1280/854",
    projectId: "danubehome-web",
  },
  {
    title: "Order Management (OMS)",
    tag: "Dashboard",
    url: "oms.danubehome.com",
    src: "https://picsum.photos/seed/oms-dash/1280/854",
    projectId: "oms",
  },
  {
    title: "Sleephubz.com",
    tag: "E-commerce",
    url: "sleephubz.com",
    src: "https://picsum.photos/seed/sleephubz/1280/854",
    projectId: "sleephubz",
  },
];

export const education = [
  {
    degree: "Bachelor's Degree, Mathematics",
    school: "Sree Sankara College, Kalady",
    period: "2007 — 2010",
  },
  {
    degree: "Higher Secondary, Science (Biology)",
    school: "NSS HSS Manikamangalam",
    period: "2004 — 2006",
  },
];

export const toolkit = [
  {
    group: "Design",
    tools: [
      "Adobe XD",
      "Figma",
      "Photoshop",
      "Illustrator",
      "Balsamiq",
      "Canva",
      "Google Web Designer",
      "Material Icons",
    ],
  },
  {
    group: "Front-End",
    tools: [
      "HTML5",
      "CSS3 / SASS",
      "JavaScript (ES6+)",
      "jQuery",
      "ReactJS",
      "React Native",
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "Bootstrap",
      "Reactstrap",
      "Material-UI",
    ],
  },
  {
    group: "AI Tools",
    tools: [
      "ChatGPT",
      "Claude",
      "Gemini",
      "Google Stitch",
      "Google Whisk",
      "Midjourney",
      "Adobe Firefly",
      "Figma AI",
      "GitHub Copilot",
      "Cursor",
      "v0",
    ],
  },
  {
    group: "Platforms",
    tools: ["Magento", "WooCommerce", "Zen Cart", "WordPress", "Joomla"],
  },
  {
    group: "Practice",
    tools: [
      "Responsive / Mobile-first",
      "Cross-browser Compatibility",
      "WCAG Accessibility",
      "Design Systems",
    ],
  },
  {
    group: "Soft Skills",
    tools: [
      "Team Collaboration",
      "Time Management",
      "Problem Solving",
      "Adaptability",
      "Attention to Detail",
      "Multitasking",
      "Client Relations",
    ],
  },
  {
    group: "Languages",
    tools: ["English", "Hindi"],
  },
];

export type ProcessStep = {
  title: string;
  body: string;
};

// Placeholder — edit in /ak-admin to match how you actually work.
export const process: ProcessStep[] = [
  {
    title: "Research & Discovery",
    body: "Start with the business goal and the user. Stakeholder interviews, competitive teardown, analytics, and AI-assisted synthesis to find where the real friction is.",
  },
  {
    title: "Define & Map",
    body: "Turn findings into clarity — personas, jobs-to-be-done, and end-to-end customer journeys that align product, CX, and engineering on what to build and why.",
  },
  {
    title: "Design & Systemize",
    body: "Wireframes to high-fidelity flows in Figma, built on a scalable design system so patterns stay consistent, accessible, and fast to ship across web and mobile.",
  },
  {
    title: "Prototype & Validate",
    body: "Interactive prototypes and usability testing to de-risk decisions early. AI-powered ideation to explore more directions in less time.",
  },
  {
    title: "Build & Handoff",
    body: "Hands-on front-end in React, Next.js, and React Native — I bridge design and code, so quality holds from concept through production with a clean handoff.",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company?: string;
};

// Real LinkedIn recommendations.
export const testimonials: Testimonial[] = [
  {
    quote:
      "I had the pleasure of working with Akhil at Danube Home, where he consistently demonstrated exceptional skills as a UI/UX Designer, Web Designer, and Front-End Developer. He has a keen eye for design and a deep understanding of user experience principles, which he seamlessly integrates into his work. His ability to create visually appealing and user-friendly interfaces is truly impressive — and he ensures his designs are not only beautiful but also functional and responsive. His attention to detail and commitment to high-quality work make him an invaluable asset to any team.",
    name: "Naveen Varma",
    role: "D2C & Ecommerce Platform Strategist",
  },
  {
    quote:
      "Akhil is an excellent UI/UX React front-end developer with a strong eye for design and functionality. I had the pleasure of working with him on several projects, and he consistently delivers visually appealing, user-friendly designs while ensuring smooth functionality and performance. He combines strong React expertise with a deep understanding of UI/UX principles, and he's a great team player — always open to feedback and highly collaborative. I highly recommend him for any UI/UX React front-end role.",
    name: "Rishal KS",
    role: "Assistant Manager, UI/UX",
    company: "Danube Home",
  },
  {
    quote:
      "I've worked with Akhil on multiple projects, and he's one of the most talented and versatile designers I've met. As a UI/UX designer he has a keen eye for detail and a deep understanding of what makes a user experience truly exceptional — his designs are always visually stunning, intuitive, and user-friendly. What sets him apart is his ability to bring those designs to life with front-end skills in HTML, CSS, JavaScript, and React, turning complex concepts into fully functional, responsive, pixel-perfect web apps. If you want a designer who can also ship the code, look no further.",
    name: "Isham Azad",
    role: "Full Stack Developer & Technical Architect",
  },
  {
    quote:
      "Akhil excels in UI/UX design, combining a keen eye for aesthetics with a deep understanding of user behavior to create seamless, engaging digital experiences. His commitment to enhancing customer experience is evident in every project, where he skillfully balances functionality with visually striking designs. His ability to translate complex ideas into user-friendly interfaces makes him a standout professional and a true asset.",
    name: "Muhammed Shafeel",
    role: "Solutions Architect — AI & ML",
  },
  {
    quote: "Hardworking, and pretty fast at what he does!",
    name: "Eldho Joy",
    role: "Founder & Managing Director",
    company: "eWoke",
  },
];
