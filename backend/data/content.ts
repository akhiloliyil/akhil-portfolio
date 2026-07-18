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
  { value: "75+", label: "shipped product platforms" },
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
  category?: string;
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

// Industry groupings for the Selected Work section, in display order.
export type ProjectCategory = { id: string; label: string; icon: string };
export const projectCategories: ProjectCategory[] = [
  { id: "commerce", label: "Commerce & Retail", icon: "🛍️" },
  { id: "ai", label: "AI & Innovation", icon: "🤖" },
  { id: "enterprise", label: "Enterprise Products", icon: "🏢" },
];

export const projects: Project[] = [
  {
    id: "yara",
    category: "ai",
    name: "YARA — AI Shopping Assistant",
    org: "Danube Home",
    role: "Lead Product Designer",
    link: "https://www.danubehome.com/ae/en/yara-ai-search",
    featured: true,
    summary:
      "Led the end-to-end product design of YARA, an AI-powered shopping assistant that transformed the customer journey across web, mobile, and in-store retail. Defined the conversational UX strategy, AI interaction patterns, and scalable design system across an omnichannel experience.",
    details: [
      "Led AI UX strategy and product design for a next-generation conversational shopping assistant",
      "Ran user research, customer journey mapping, and AI interaction design to simplify product discovery and decision-making",
      "Designed conversational user flows, wireframes, and interactive prototypes for text and voice shopping",
      "Created AI-powered discovery with intent-aware search, personalized recommendations, and contextual assistance",
      "Connected web, mobile, and physical stores via QR-based discovery and real-time in-store assistance",
      "Designed \"Imagine with YARA\" — visualize furniture and décor in curated interior settings before purchase",
      "Built reusable conversational UI components within a scalable AI design system",
      "Collaborated with AI engineers, PMs, and frontend developers to turn complex AI capabilities into intuitive experiences",
    ],
    stack: [
      "AI UX",
      "Conversational Design",
      "UX Research",
      "Customer Journey",
      "Voice UI",
      "Design System",
      "Omnichannel Experience",
      "Frontend Collaboration",
    ],
    frameType: "app",
  },
  {
    id: "hexa",
    category: "enterprise",
    name: "Hexa — Showroom Sales App",
    org: "Danube Home",
    role: "Lead Product Designer",
    period: "Jan 2024 — Present",
    summary:
      "Led the end-to-end UX and product design of Hexa, an enterprise mobile app for showroom sales teams — streamlining in-store operations, accelerating order processing, and improving inventory visibility through an intuitive, role-based experience with real-time insights.",
    details: [
      "Led UX strategy and product design for a role-based enterprise sales application",
      "Ran stakeholder workshops, user research, workflow analysis, and competitor benchmarking to surface operational pain points",
      "Designed information architecture, user flows, wireframes, and interactive prototypes for complex sales workflows",
      "Built reusable mobile components within a scalable enterprise design system",
      "Designed role-based dashboards for executives, supervisors, and managers with personalized KPIs and insights",
      "Streamlined product discovery — advanced search, rich detail pages, multi-basket order management, and real-time stock visibility",
      "Improved customer management with detailed profiles, purchase history, sales status tracking, and personalized service workflows",
      "Collaborated with React Native developers to ship production-ready mobile interfaces with design consistency and usability",
    ],
    stack: [
      "UX Research",
      "Enterprise UX",
      "User Journey",
      "Wireframing",
      "Design System",
      "React Native",
      "Frontend Implementation",
    ],
    frameType: "app",
  },
  {
    id: "danube-app",
    category: "commerce",
    name: "Danube Home — Mobile App",
    org: "Danube Home",
    role: "Lead Product Designer",
    period: "Jan 2023 — Present",
    summary:
      "Led the end-to-end UX and product design of the Danube Home mobile app — a seamless omnichannel shopping experience across iOS and Android, with scalable mobile design patterns and production-ready React Native implementation.",
    details: [
      "Led UX strategy and mobile product design",
      "Conducted UX research, customer journey mapping, and competitor analysis",
      "Designed information architecture, user flows, wireframes, and interactive prototypes",
      "Built reusable mobile components within a scalable design system",
      "Designed predictive search and personalized shopping experiences",
      "Optimized PLP, PDP, Cart, Checkout, Wallets, Reward Points, Gift Cards, Click & Collect, Order Tracking, and Delivery Rescheduling",
      "Collaborated with React Native developers to implement responsive, production-ready mobile interfaces",
    ],
    stack: [
      "UX Research",
      "Mobile UX",
      "Wireframing",
      "Design System",
      "AI UX",
      "React Native",
      "Frontend Implementation",
    ],
    frameType: "app",
  },
  {
    id: "danubehome-web",
    category: "commerce",
    name: "Danubehome.com — E-commerce Website",
    org: "Danube Home",
    role: "Lead Product Designer",
    period: "Sep 2020 — Present",
    link: "https://www.danubehome.com",
    summary:
      "Led end-to-end product design for Danube Home's omnichannel e-commerce platform — driving UX strategy, customer experience, and scalable design systems, then translating approved designs into production-ready ReactJS and Next.js interfaces with pixel-perfect fidelity.",
    details: [
      "Led UX research, customer journey mapping, and information architecture",
      "Designed wireframes, interactive prototypes, and high-fidelity UI",
      "Established and maintained a scalable design system across web and mobile",
      "Designed AI-powered product discovery with YARA AI",
      "Optimized PLP, PDP, Cart, Checkout, Wallets, Rewards, and Gift Cards",
      "Collaborated with Product Managers, Developers, and QA across the product lifecycle",
      "Converted approved UI into responsive ReactJS and Next.js components, maintaining design fidelity and performance",
    ],
    stack: [
      "UX Research",
      "Wireframing",
      "Design System",
      "AI UX",
      "React",
      "Next.js",
      "Frontend Implementation",
    ],
    frameType: "ecommerce",
  },
  {
    id: "oms",
    category: "enterprise",
    name: "Order Management System (OMS)",
    org: "Danube Home",
    role: "Lead Product Designer",
    period: "Sep 2020 — Present",
    summary:
      "Led the end-to-end UX and product design of an enterprise Order Management System that streamlined order processing, inventory management, and operational workflows across teams — simplifying complex flows, improving real-time visibility, and delivering a scalable, role-based platform.",
    details: [
      "Led UX strategy and product design for a centralized enterprise order-management platform",
      "Ran user research, stakeholder workshops, workflow analysis, and competitor benchmarking to optimize business processes",
      "Designed IA, user flows, wireframes, prototypes, and high-fidelity interfaces for the full order lifecycle",
      "Built reusable UI components within a scalable enterprise design system",
      "Designed real-time dashboards with order tracking, delivery monitoring, sales insights, and KPI visualization",
      "Simplified order management with advanced search, filtering, bulk actions, status tracking, and detailed workflows",
      "Integrated inventory visibility, stock sync, replenishment alerts, and fulfillment workflows to reduce operational errors",
      "Collaborated with ReactJS developers to ship responsive, production-ready interfaces with accessibility and consistency",
    ],
    stack: [
      "Enterprise UX",
      "UX Research",
      "Workflow Analysis",
      "Dashboard Design",
      "Wireframing",
      "Design System",
      "ReactJS",
      "Frontend Implementation",
    ],
    frameType: "dashboard",
  },
  {
    id: "price-tag",
    category: "enterprise",
    name: "Dynamic Price Tag Editor",
    org: "Danube Home",
    role: "Lead Product Designer",
    summary:
      "Led the end-to-end UX and product design of a Dynamic Price Tag Editor — an enterprise platform that simplifies large-scale retail pricing, catalog management, and in-store printing workflows, reducing manual effort and improving pricing accuracy across high-volume operations.",
    details: [
      "Led UX strategy and product design for a centralized retail price-tag management platform",
      "Ran user research, stakeholder workshops, workflow analysis, and operational mapping to surface pricing/print inefficiencies",
      "Designed IA, user flows, wireframes, prototypes, and high-fidelity interfaces for large-scale merchandising workflows",
      "Built reusable enterprise UI components within a scalable design system",
      "Designed intuitive batch editing — reusable templates, live previews, bulk actions, and print-ready workflows",
      "Simplified catalog management — advanced search, filtering, category organization, CSV/Excel import-export, and bulk updates",
      "Integrated real-time inventory visibility, stock sync, pricing validation, and low-stock alerts for accuracy",
      "Collaborated with developers for pixel-perfect, responsive implementation across enterprise retail systems",
    ],
    stack: [
      "Enterprise UX",
      "Workflow Analysis",
      "UX Research",
      "Wireframing",
      "Design System",
      "Retail Operations",
      "Dashboard Design",
    ],
    frameType: "dashboard",
  },
  {
    id: "omnichannel",
    category: "ai",
    name: "Omnichannel Retail Experience Platform",
    org: "Danube Home",
    role: "Concept Case Study · Lead Product Designer · Product Strategy · AI UX · Omnichannel CX",
    summary:
      "A forward-looking omnichannel retail concept that seamlessly connects physical stores with digital commerce — reimagining the customer journey from discovery and personalization to visualization and checkout through AI-driven experiences and connected touchpoints.",
    details: [
      "Defined the end-to-end product vision and UX strategy for a unified omnichannel experience",
      "Ran customer journey mapping, service blueprinting, and retail workflow analysis across online and in-store",
      "Designed user flows, wireframes, and prototypes connecting physical and digital touchpoints",
      "Smart Check-in Kiosk — instant access to saved preferences, wishlists, loyalty benefits, and ongoing sessions on store entry",
      "Frictionless Checkout — transparent pricing, flexible payments, delivery scheduling, digital receipts, and omnichannel fulfillment",
      "AI-Powered Room Design — place furniture in realistic room layouts, explore personalized styles, and buy directly from the design",
      "Connected journey integrating AI recommendations, discovery, and visualization across web, mobile, and store",
      "Established reusable interaction patterns and scalable principles for future AI-driven retail experiences",
    ],
    stack: [
      "Product Strategy",
      "Omnichannel CX",
      "AI UX",
      "Service Design",
      "Customer Journey Mapping",
      "Wireframing",
      "Product Thinking",
      "UX Strategy",
    ],
    frameType: "app",
  },
  {
    id: "pim",
    category: "enterprise",
    name: "Product Information Management (PIM)",
    org: "Danube Home",
    role: "Lead Product Designer",
    summary:
      "Led the end-to-end UX and product design of a Product Information Management platform that centralized product data, digital assets, and catalog management across channels — simplifying complex workflows, improving data accuracy, and supporting ERP and e-commerce integrations.",
    details: [
      "Led UX strategy and product design for a centralized PIM platform",
      "Ran user research, stakeholder workshops, workflow analysis, and information architecture for complex product processes",
      "Designed user flows, wireframes, prototypes, and high-fidelity interfaces for large-scale catalog management",
      "Built reusable enterprise UI components within a scalable design system",
      "Designed real-time dashboards for product health, inventory status, content completeness, and publishing workflows",
      "Simplified catalog management — advanced search, filtering, bulk editing, category hierarchy, DAM, and version control",
      "Designed workflows for ERP integration, e-commerce sync, API connectivity, and multi-channel publishing",
      "Collaborated with developers for pixel-perfect implementation and scalable enterprise UX",
    ],
    stack: [
      "Enterprise UX",
      "UX Research",
      "Information Architecture",
      "Workflow Analysis",
      "Wireframing",
      "Design System",
      "Dashboard Design",
      "Product Management",
    ],
    frameType: "dashboard",
  },
  {
    id: "sleephubz",
    category: "commerce",
    name: "Sleephubz.com — Sleep E-commerce",
    org: "Danube Home",
    role: "Lead Product Designer",
    summary:
      "Led end-to-end UX and product design for SleepHubz.com, an e-commerce platform for mattresses and sleep solutions — creating intuitive shopping experiences, optimizing customer journeys, and building a scalable design system that lifted usability, engagement, and conversion across web and mobile.",
    details: [
      "Led UX strategy and product design for a conversion-focused sleep & mattress e-commerce platform",
      "Ran UX research, competitor analysis, customer journey mapping, and usability testing to remove friction",
      "Designed IA, user flows, wireframes, prototypes, and high-fidelity UI for the full purchase journey",
      "Optimized discovery, category navigation, PLP, PDP, Cart, Checkout, and post-purchase experiences",
      "Lifted conversion by simplifying journeys, reducing checkout friction, and validating via A/B testing",
      "Built a scalable design system with reusable components, responsive layouts, and accessibility guidelines",
      "Collaborated with developers for pixel-perfect, responsive implementation and clean design-to-dev handoff",
      "Used analytics and customer feedback to continuously refine the experience and drive data-informed decisions",
    ],
    stack: [
      "UX Research",
      "Customer Journey",
      "A/B Testing",
      "Usability Testing",
      "Wireframing",
      "Design System",
      "Conversion Optimization",
      "Frontend Collaboration",
    ],
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

export type SectionToggle = { id: string; label: string; enabled: boolean };

// Controls which sections show on the site + in the nav. Edit in /ak-admin.
export const sections: SectionToggle[] = [
  { id: "about", label: "About", enabled: true },
  { id: "work", label: "Work", enabled: true },
  { id: "process", label: "Process", enabled: true },
  { id: "experience", label: "Experience", enabled: true },
  { id: "gallery", label: "Gallery", enabled: true },
  { id: "toolkit", label: "Toolkit", enabled: true },
  { id: "testimonials", label: "Praise", enabled: true },
  { id: "contact", label: "Contact", enabled: true },
];
