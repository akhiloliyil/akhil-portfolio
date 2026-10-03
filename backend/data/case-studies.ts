// Case-study pages (/work/[slug]). Static, not admin-editable.
//
// Everything here comes from the project write-ups in content.json or from
// what is visible in the real screenshots. Nothing is measured or invented:
// no metrics, team sizes or research findings that aren't on record. Optional
// sections (beforeAfter, learnings) are left out until real material exists —
// the page skips any section that has no data.

export type CaseImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  // Design decisions called out next to the screen.
  notes?: { title: string; body: string }[];
};

export type CaseStudy = {
  slug: string;
  // Links back to the matching entry in content.projects, when there is one.
  projectId?: string;
  title: string;
  kicker: string;
  oneLiner: string;
  org: string;
  period?: string;
  link?: { href: string; label: string };
  cover: CaseImage;
  // Up to three short capabilities for the Work card.
  tags: string[];
  // Phone-sized screens shown instead of the wide cover on small screens.
  mobileCover?: string[];
  // Annotated device screens: the mobile UX decisions, one per screen.
  mobileScreens?: { src: string; alt: string; title: string; note: string }[];
  role: {
    title: string;
    scope: string[];
    // What I personally owned, as distinct from the wider team.
    owned: string[];
    team: string;
  };
  challenge: string[];
  users: { name: string; need: string }[];
  journey: { title: string; steps: { label: string; note: string }[] };
  problems: { title: string; body: string }[];
  // Notes per step of the shared UX approach chain (see APPROACH_STEPS).
  approach: Partial<Record<ApproachStep, string>>;
  // Capability grid — used by YARA to show each AI interaction and its UX decision.
  capabilities?: { label: string; decision: string }[];
  beforeAfter?: { before: CaseImage; after: CaseImage; note: string }[];
  screens: CaseImage[];
  designSystem: { summary: string; parts: { label: string; note: string }[] };
  designToCode: { label: string; note: string }[];
  outcome: string[];
  learnings?: string[];
};

export const APPROACH_STEPS = [
  "Customer Journey",
  "Information Architecture",
  "User Flow",
  "Wireframes",
  "Component Strategy",
  "Design System",
  "UI",
  "Prototype",
  "Development",
] as const;
export type ApproachStep = (typeof APPROACH_STEPS)[number];

export const caseStudies: CaseStudy[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "yara",
    projectId: "yara",
    title: "YARA AI — Intelligent Retail & Shopping Assistant",
    kicker: "AI product design · Conversational commerce",
    oneLiner:
      "An AI shopping assistant that helps customers of a large UAE home & furniture retailer find, compare and choose products by text or voice, across retail stores, kiosks, web and mobile.",
    org: "Home & Furniture Retail, UAE",
    cover: {
      src: "/images/projects/yara.png",
      alt: "YARA entry screen: an illustrated assistant beside two buttons, 'Talk to Yara' and 'Imagine with Yara'.",
      width: 1290,
      height: 1016,
    },
    tags: ["Conversational AI", "Voice & text", "AI comparison"],
    role: {
      title: "Lead Product Designer",
      scope: [
        "AI UX strategy",
        "Conversational design",
        "Customer journey",
        "Information architecture",
        "Wireframes",
        "Prototyping",
        "UI",
        "Design system",
        "Front-end collaboration",
      ],
      owned: [
        "Led the UI/UX design and experience strategy for the assistant",
        "Owned UX research, user flows, wireframes, high-fidelity UI and interactive prototypes",
        "Designed conversational AI interactions for text and voice",
        "Designed AI-powered discovery, recommendations and product comparison",
        "Designed the QR-enabled showroom experience linking customers to product details",
        "Designed “Imagine with YARA” for visualising products in realistic interior spaces",
        "Built the scalable omnichannel design system across web, mobile and kiosks",
      ],
      team: "Worked with product managers, AI engineers, developers and business stakeholders. My part was the experience: strategy, flows, interaction design, UI and the design system.",
    },
    challenge: [
      "The retailer sells a large furniture and home-improvement range across its website, app and showrooms. Finding a product meant knowing its category and then narrowing with filters. That's hard when a customer starts from a need, like “minimalist living-room furniture in white and natural wood under AED 5,000”, rather than a product name.",
      "The goal was an assistant that understands that intent, keeps the customer moving toward a decision, and behaves the same way in showrooms, on kiosks, on the web and in the app.",
    ],
    users: [
      {
        name: "Online shoppers",
        need: "Start from a need or a style, not a product name, and want relevant options fast.",
      },
      {
        name: "Showroom & kiosk customers",
        need: "Want product details, availability and price on the spot, from the item in front of them.",
      },
      {
        name: "Customers furnishing a room",
        need: "Need to see how pieces will look together before committing to a purchase.",
      },
      {
        name: "Comparison shoppers",
        need: "Weighing several similar products and want the differences laid out clearly.",
      },
    ],
    journey: {
      title: "From customer intent to purchase",
      steps: [
        { label: "Customer intent", note: "The customer types or says what they need, in their own words." },
        { label: "AI understanding", note: "The assistant picks out category, style, colour, material and budget." },
        { label: "Search & recommendations", note: "Matching products appear as a result set rather than a filter panel." },
        { label: "Product comparison", note: "Side by side on specifications, pricing, ratings, reviews, features and availability." },
        { label: "Product discovery", note: "Rich content (videos, A+ Content, specs, reviews) with live availability and pricing." },
        { label: "Purchase", note: "Add to cart, or order in bulk, without leaving the result set." },
      ],
    },
    problems: [
      {
        title: "Filters assume catalogue knowledge",
        body: "Category trees and filter panels work for customers who already know what a product is called. People shopping by need had to translate it into the catalogue's vocabulary first.",
      },
      {
        title: "Comparing meant opening page after page",
        body: "Weighing up options required visiting each product page in turn and holding the details in memory.",
      },
      {
        title: "Out-of-stock was a dead end",
        body: "A strong match that was unavailable stopped the journey instead of steering it toward a close alternative.",
      },
      {
        title: "Store and online were separate journeys",
        body: "Help in a showroom and help on the website didn't share context, so the experience reset at each touchpoint.",
      },
      {
        title: "Hard to picture furniture at home",
        body: "Product photos show an item on its own, not in the customer's style or room.",
      },
    ],
    approach: {
      "Customer Journey": "Mapped intent → purchase across web, app and store, including the store-to-digital handover.",
      "Information Architecture": "Separated two modes up front: talking to YARA (help and search) and imagining with YARA (visualisation).",
      "User Flow": "Conversational flows for text and voice, including refinement, comparison and recovery when nothing matches.",
      Wireframes: "Result sets, the comparison tray and one-tap actions explored at low fidelity before visual design.",
      "Component Strategy": "Defined conversational components that sit alongside the existing commerce components rather than replacing them.",
      "Design System": "Added the conversational components to the shared design system so web and app stay consistent.",
      UI: "A distinct assistant identity, gradient accent for AI moments, and standard product cards for results.",
      Prototype: "Interactive prototypes for text and voice interactions.",
      Development: "Worked with AI engineers and developers to ship across web, mobile and kiosks.",
    },
    capabilities: [
      { label: "Conversational UI", decision: "A named assistant with a clear identity, so customers know when they're talking to AI rather than browsing." },
      { label: "Text interaction", decision: "Natural-language queries replace filter-building: the customer describes intent once." },
      { label: "Voice interaction", decision: "“Talk to Yara” is a primary entry point, not a hidden mic icon, for customers who'd rather speak." },
      { label: "AI search", decision: "Intelligent search returns a curated result set with a plain-language title of what was understood." },
      { label: "Recommendations", decision: "Personalised suggestions based on intent, preferences and shopping behaviour." },
      { label: "Product comparison", decision: "Select products to compare specifications, pricing, ratings, reviews, features and availability side by side." },
      { label: "QR / showroom", decision: "QR codes in the showroom link customers straight to product details on their own phone." },
      { label: "Rich product content", decision: "Videos, A+ Content, specifications and reviews answer pre-purchase questions without a sales associate." },
      { label: "Live availability & pricing", decision: "Real-time stock and price shown with every result, so a recommendation is always something you can buy." },
      { label: "Imagine with YARA", decision: "A separate visual mode for seeing products in realistic interior spaces before purchase." },
    ],
    screens: [
      {
        src: "/images/projects/yara.png",
        alt: "YARA entry screen with an illustrated assistant and two buttons: 'Talk to Yara' with a voice waveform icon, and 'Imagine with Yara' with a sparkle icon.",
        width: 1290,
        height: 1016,
        caption: "Entry point — two modes, chosen up front",
        notes: [
          { title: "Two intents, two buttons", body: "Getting help (talk) and visualising (imagine) are different jobs, so they're separate entry points rather than one chat box that has to guess." },
          { title: "Voice is visible", body: "The waveform icon signals voice before the customer taps, so speaking feels like a supported path, not an accessibility afterthought." },
          { title: "A face for the assistant", body: "A named, illustrated character makes it clear the customer is talking to an assistant, and gives the AI a consistent identity across channels." },
        ],
      },
      {
        src: "/images/projects/AISearch.png",
        alt: "AI product search: a natural-language query for minimalist living-room furniture in white and natural wood under AED 5,000, returning five product cards with prices, select boxes and add-to-cart buttons, annotated with UX callouts.",
        width: 1277,
        height: 1173,
        caption: "AI product search — describe intent instead of building filters",
        notes: [
          { title: "Intent in, results out", body: "One natural-language query replaces several filter steps: style, colour, material and budget are read from the sentence." },
          { title: "Dynamic multi-select tray", body: "Selecting products enables compare, add to cart or order in bulk, so the result set becomes a decision space." },
          { title: "One-click answers", body: "Delivery timeline, return policy and specs are one action away, answering the usual pre-purchase questions in place." },
          { title: "Smart refinement", body: "When items are out of stock, the assistant offers refinement variations instead of an empty state." },
        ],
      },
    ],
    designSystem: {
      summary: "One omnichannel design system across web, mobile and kiosks. Conversational patterns sit alongside the commerce components, so AI results look and behave like the rest of the store.",
      parts: [
        { label: "Entry points", note: "Primary pill buttons for each assistant mode, with icon cues for voice and generation." },
        { label: "Query input", note: "Large natural-language field with a gradient focus state reserved for AI moments." },
        { label: "Result set", note: "Titled result group that restates what the assistant understood." },
        { label: "Product card", note: "Standard commerce card (image, name, price, was-price, add to cart) plus a select state." },
        { label: "Multi-select tray", note: "Contextual actions that appear once one or more products are selected." },
        { label: "States", note: "Out-of-stock and no-match states that suggest refinements instead of ending the flow." },
      ],
    },
    designToCode: [
      { label: "Figma", note: "Flows, conversational components and prototypes." },
      { label: "Design system", note: "Conversational components added alongside commerce components." },
      { label: "Web · mobile · kiosk", note: "Built with developers and AI engineers for each touchpoint." },
      { label: "Production", note: "Live as YARA AI search on the retailer's website." },
    ],
    outcome: [
      "Live on the retailer's website as YARA AI search.",
      "Simplified product discovery and comparison.",
      "Bridged showroom and online shopping with QR-enabled journeys.",
      "More engagement and purchase confidence through visualisation and personalised recommendations.",
      "A scalable design system supporting multiple retail touchpoints.",
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "home-retail",
    projectId: "retail-web",
    title: "Home & Furniture Commerce — Web & App",
    kicker: "E-commerce · Retail · Omnichannel CX",
    oneLiner:
      "The customer-facing commerce experience for one of the Middle East's largest furniture and home-improvement brands: its website and its iOS and Android app.",
    org: "Home & Furniture Retail, UAE",
    period: "Web: Sep 2020 — Present · App: Jan 2023 — Present",
    cover: {
      src: "/images/projects/DHMobileApp.jpeg",
      alt: "A spread of mobile app screens: room inspiration, category listing, flash sale, product detail, order tracking, delivery location map, checkout, wallet and account.",
      width: 3000,
      height: 2000,
    },
    tags: ["E-commerce", "Mobile app", "Checkout & loyalty"],
    mobileCover: ["/images/projects/screens/dh-pdp.webp", "/images/projects/screens/dh-home-tracking.webp"],
    mobileScreens: [
      { src: "/images/projects/screens/dh-plp.webp", alt: "Sofas listing: category shortcuts, two-column product grid with discount badges, and a floating Sort and Filter pill.", title: "Listing — product discovery", note: "Category shortcuts across the top, a two-column grid, and Sort / Filter as a floating pill at the bottom, within thumb reach." },
      { src: "/images/projects/screens/dh-flash-sale.webp", alt: "Flash sale listing with a countdown timer in the header and stock bars on each product card.", title: "Flash sale — urgency", note: "A countdown in the header and a stock bar on each card show urgency without leaving the listing." },
      { src: "/images/projects/screens/dh-pdp.webp", alt: "Product detail: lifestyle photo with a tappable product tag, price with saving and reward points, today's deal timer, delivery estimate, and a quantity stepper with Add to Cart.", title: "Product details — the decision", note: "Tappable tags in the lifestyle photo; price, saving and points lead; quantity and Add to Cart stay pinned at the bottom." },
      { src: "/images/projects/screens/dh-home-tracking.webp", alt: "Home screen with a dismissible order-status stepper from Placed to Delivered, campaign banners and a bottom tab bar.", title: "Home — order tracking", note: "Order status sits on the home screen (Placed → Delivered); a bottom tab bar keeps Home, Categories, Cart, Wishlist and Me in reach." },
      { src: "/images/projects/screens/dh-delivery-map.webp", alt: "Delivery location map with the hint 'Long press and drag the pin on the most accurate location' and a Confirm & Save Location button.", title: "Delivery location — forms", note: "Long-press and drag a pin for the exact drop point, instead of typing an imprecise address; one full-width confirm action." },
      { src: "/images/projects/screens/dh-wallet.webp", alt: "Ahlan Wallet: balance card with Redeem Gift Card and Add Money buttons, lifetime credited and debited totals, and Spendable, Pending and History tabs.", title: "Wallet — account", note: "Balance first, then the two main actions; Spendable / Pending / History tabs keep the detail one tap away." },
    ],
    role: {
      title: "Lead Product Designer — UI/UX & CX",
      scope: [
        "UX research",
        "Customer journey mapping",
        "Information architecture",
        "Wireframes",
        "Prototyping",
        "UI",
        "Design system",
        "Front-end collaboration",
      ],
      owned: [
        "Led UX strategy and product design for the website and the mobile app",
        "Ran UX research, customer journey mapping and competitor analysis",
        "Designed the information architecture, user flows, wireframes and prototypes",
        "Established and maintained the design system shared by web and mobile",
        "Designed and optimised PLP, PDP, cart, checkout, wallet, rewards, gift cards, Click & Collect, order tracking and delivery rescheduling",
        "Designed predictive search, layered navigation, rich PDPs and multi-step checkout",
      ],
      team: "Partnered with product managers, developers and business stakeholders. The website is built in React.js and SCSS; the app in React Native.",
    },
    challenge: [
      "The brand sells across showrooms, a website and an app. Customers needed to move between inspiration, a large catalogue, layered offers, delivery choices and after-sales without the experience changing from one channel to the next.",
      "Commerce features kept growing: wallet, reward points, gift cards, Click & Collect, instalments, delivery rescheduling. Each one needed a place that didn't make the core path to purchase harder.",
    ],
    users: [
      { name: "Inspiration shoppers", need: "Browse by room and style before they know which product they want." },
      { name: "Deal-driven shoppers", need: "Want to see sale price, savings, points and bank offers clearly before deciding." },
      { name: "Customers at checkout", need: "Choose home delivery or Click & Collect, pin an exact location, and pick a payment or instalment option." },
      { name: "Returning customers", need: "Track orders, arrange returns, and manage wallet balance and gift cards on their own." },
    ],
    journey: {
      title: "Omnichannel purchase journey",
      steps: [
        { label: "Inspire", note: "Ideas browsed by room: living room, bedroom, kitchen, bathroom." },
        { label: "Browse", note: "Categories and listings with sort, filter, badges and live sale timers." },
        { label: "Decide", note: "Product detail: images, specs, reviews, recommendations, price, savings and reward points." },
        { label: "Checkout", note: "Multi-step: delivery or Click & Collect, saved or autocompleted address, wallet and other payment options." },
        { label: "After purchase", note: "Order tracking, cancellations, returns, delivery rescheduling, wallet and gift cards." },
      ],
    },
    problems: [
      { title: "Large catalogue, many entry points", body: "Customers arrive from campaigns, categories and inspiration content, and each route has to lead somewhere useful." },
      { title: "Layered pricing", body: "Sale price, original price, savings, reward points, coupons and bank offers can all apply to one product, and need a clear hierarchy." },
      { title: "Delivery accuracy", body: "Addresses in the UAE are often imprecise, so checkout needed a map pin, not just a text address." },
      { title: "After-sales self-service", body: "Orders, returns, wallet credit and gift cards had to be manageable without contacting support." },
      { title: "Web and app drifting apart", body: "Two platforms shipping in parallel needed one set of patterns to stay consistent." },
    ],
    approach: {
      "Customer Journey": "Mapped inspiration → purchase → after-sales across web, app and showroom.",
      "Information Architecture": "Bottom navigation built around Home, Categories, Ideas, Cart and Me; account organised by orders, links and settings.",
      "User Flow": "Flows for checkout, Click & Collect, returns, wallet top-up and delivery rescheduling.",
      Wireframes: "Listing, product detail, checkout and account explored at low fidelity first.",
      "Component Strategy": "One product card, one price block and one status stepper reused across every surface.",
      "Design System": "A shared web + mobile system covering tokens, components and responsive behaviour.",
      UI: "Brand red for commerce actions; neutral surfaces so product photography leads.",
      Prototype: "Interactive prototypes for key purchase and account flows.",
      Development: "Worked with developers on the React.js + SCSS website and the React Native app.",
    },
    screens: [
      {
        src: "/images/projects/DHMobileApp.jpeg",
        alt: "Mobile app screens: room ideas grid, sofa listing with discount badges, flash sale with countdown, product detail with price and reward points, order status tracker, map pin for delivery location, payment options with instalments, wallet balance and the account menu.",
        width: 3000,
        height: 2000,
        caption: "Mobile app — from inspiration to after-sales",
        notes: [
          { title: "Price block hierarchy", body: "Sale price leads, then the struck-through price, the saving, and points earned, so layered offers read in one glance." },
          { title: "Order status as a stepper", body: "Placed → Confirmed → In transit → In dispatch → Delivered, shown on the home screen as well as in orders." },
          { title: "Map-pinned delivery", body: "“Long press and drag the pin” fixes the exact drop point, addressing imprecise addresses at the source." },
          { title: "Self-service account", body: "Orders, returns, wallet, gift cards and language (English / Arabic) are grouped under one Me tab." },
          { title: "Sticky purchase action", body: "Add to cart stays pinned on product detail, with stock and delivery estimate next to it." },
        ],
      },
    ],
    designSystem: {
      summary: "One design system serves the website and the app, so a product card, a price or an order status looks and behaves the same everywhere.",
      parts: [
        { label: "Product card", note: "Image, badges (new, % off, online only), price, was-price, add to cart." },
        { label: "Price block", note: "Sale price, original price, saving and reward points in a fixed order." },
        { label: "Status stepper", note: "Order progress reused on home, order list and order detail." },
        { label: "Navigation", note: "Bottom tab bar on mobile; category navigation on web." },
        { label: "Forms & checkout", note: "Address, payment selection and instalment options." },
        { label: "Responsive behaviour", note: "Components defined for mobile first, then adapted to desktop web." },
      ],
    },
    designToCode: [
      { label: "Figma", note: "Flows, UI and prototypes for web and app." },
      { label: "Design system", note: "Shared components and tokens across platforms." },
      { label: "React.js · SCSS · React Native", note: "Responsive web in React.js and SCSS; the app in React Native." },
      { label: "Production", note: "The website and the shopping app on iOS and Android." },
    ],
    outcome: [
      "Live on the website and in the shopping app on iOS and Android.",
      "Improved product discovery and checkout efficiency by reducing friction in the purchase flow.",
      "More engagement through wallet, reward points, gift cards and personalised content.",
      "Reusable components gave design consistency and faster development across web and app.",
      "Responsive, accessible experiences across desktop, tablet and mobile.",
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "sellerhub",
    title: "SellerHub — Marketplace Seller Platform",
    kicker: "Marketplace · Seller operations",
    oneLiner:
      "The seller side of a large home & furniture marketplace: how sellers receive orders, prepare them for pickup and track what they're paid.",
    org: "Home & Furniture Retail, UAE",
    cover: {
      src: "/images/projects/IMG_2972.jpeg",
      alt: "SellerHub mobile screens: seller dashboard with sales and order status, order lists by status, order details with accept and reject actions, and settlement statements.",
      width: 3000,
      height: 2000,
    },
    tags: ["Marketplace", "Order workflow", "Payout statements"],
    mobileCover: ["/images/projects/screens/seller-dashboard.webp", "/images/projects/screens/seller-order-detail.webp"],
    mobileScreens: [
      { src: "/images/projects/screens/seller-dashboard.webp", alt: "Seller dashboard: sales today with trend, total revenue, an order-status gauge updated five minutes ago, and a Pending for Approval list.", title: "Dashboard — action first", note: "Sales and an order-status gauge (with 'updated 5 mins ago'), then the orders waiting for a decision." },
      { src: "/images/projects/screens/seller-order-list.webp", alt: "Order list with Today, Tomorrow and Delivered tabs; each card shows status, delivery deadline, distance and a Set Delivered button.", title: "Order list — status tabs", note: "Day-based tabs; each card shows status, deadline and distance, with Set Delivered as the one primary action." },
      { src: "/images/projects/screens/seller-order-detail.webp", alt: "Order detail: order number and date, accept-before date, pending status, item list with prices and SKUs, order total and Reject and Accept buttons.", title: "Order detail — the decision", note: "Accept-before date and status up top; Reject and Accept fixed at the bottom with the order total." },
      { src: "/images/projects/screens/seller-order-states.webp", alt: "Order detail with a green 'Successfully accepted the order' banner and a red 'Something went wrong' banner above the items.", title: "Feedback states", note: "Inline success and error banners at the top of the order, so the result of an action is never ambiguous." },
    ],
    role: {
      title: "Lead Product Designer",
      scope: ["Marketplace UX", "Workflow design", "Information architecture", "UI", "Design system", "React front-end"],
      owned: [
        "Led the design of SellerHub within the retailer's marketplace ecosystem",
        "Designed the seller workflow from new order to pickup to payout",
        "Designed the dashboard, order lists, order detail and statements",
        "Converted the UI into React front-end",
      ],
      team: "Worked with the in-house product and engineering teams.",
    },
    challenge: [
      "Marketplace sellers fulfil orders that customers place on the marketplace. They need to know what needs action now, respond before deadlines, get goods ready for pickup, and understand exactly how their payout was calculated.",
    ],
    users: [
      { name: "Marketplace sellers", need: "See new orders quickly, accept or reject them in time, and prepare them for pickup." },
      { name: "Seller finance contacts", need: "Reconcile statements: product charges, fees, refunds and the net amount payable." },
    ],
    journey: {
      title: "Seller order workflow",
      steps: [
        { label: "New order", note: "Appears under Pending for approval on the dashboard." },
        { label: "Accept / reject", note: "Decide before the accept-by date shown on the order." },
        { label: "Pack", note: "Enter the number of boxes for the shipment." },
        { label: "Ready to pickup", note: "Mark ready; the expected pickup date is shown." },
        { label: "Delivered", note: "Status moves through to completion." },
        { label: "Statement", note: "Settlement periods with a full charge breakdown." },
      ],
    },
    problems: [
      { title: "Action items get buried", body: "Orders needing a decision must stand out from orders that are simply in progress." },
      { title: "Deadlines matter", body: "Acceptance is time-bound, so the accept-by date has to be visible at decision time." },
      { title: "Many statuses", body: "Pending, accepted, ready to pickup, declined, undelivered and invoiced each need their own view." },
      { title: "Payout transparency", body: "Sellers need to see how fees, shipping, refunds and platform charges add up to the net payable amount." },
    ],
    approach: {
      "Customer Journey": "Mapped the seller's day: new orders → fulfilment → settlement.",
      "Information Architecture": "Four tabs: Dashboard, Orders, Statement, Account.",
      "User Flow": "Accept/reject, pack-and-pickup and statement-review flows.",
      "Component Strategy": "Order card and status tabs reused across every order view.",
      UI: "Clear success / pending / rejected colour states; primary actions anchored at the bottom.",
      Development: "Built as a React front-end.",
    },
    screens: [
      {
        src: "/images/projects/IMG_2972.jpeg",
        alt: "SellerHub screens: dashboard with sales today, total revenue and an order-status gauge; pending approvals list; order lists filtered by status; order detail with box count, accept and reject buttons; statement with charges, fees and net payable amount; login screen.",
        width: 3000,
        height: 2000,
        caption: "SellerHub — dashboard, orders and statements",
        notes: [
          { title: "Dashboard leads with action", body: "Sales today, revenue and an order-status gauge sit above a Pending for approval list, so what needs a decision is first." },
          { title: "Status tabs", body: "Ready to pick up, declined, undelivered and invoice each get a tab, rather than one long mixed list." },
          { title: "Decision at the bottom", body: "Order detail ends with Reject and Accept side by side, with the order total right above them." },
          { title: "Itemised statement", body: "Product charges, shipping, refunds, Easy Ship and platform fees roll up to a net payable amount." },
        ],
      },
    ],
    designSystem: {
      summary: "Seller tools share the visual language of the customer app, adapted for dense operational data.",
      parts: [
        { label: "Order card", note: "Order number, date, item count, status and a View details action." },
        { label: "Status tabs", note: "Horizontal filters for each fulfilment state." },
        { label: "States", note: "Success, pending, error and rejected banners and labels." },
        { label: "Data summary", note: "Statement rows with right-aligned amounts and a bold total." },
      ],
    },
    designToCode: [
      { label: "Figma", note: "Seller workflows and UI." },
      { label: "Design system", note: "Order and status components shared with other operations tools." },
      { label: "React", note: "Front-end conversion." },
      { label: "Production", note: "Live with marketplace sellers." },
    ],
    outcome: [
      "Live with marketplace sellers.",
      "Order decisions, fulfilment and settlement in one seller tool.",
      "Order and status patterns shared with the retailer's other operations products.",
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "hexa",
    projectId: "hexa",
    title: "Hexa Store — Showroom Sales & Order Management",
    kicker: "Enterprise UX · Store operations",
    oneLiner:
      "A mobile app that lets a large retailer's showroom sales teams manage customers, product discovery, stock availability and order placement from a single platform.",
    org: "Home & Furniture Retail, UAE",
    period: "Jan 2024 — Present",
    cover: {
      src: "/images/projects/HexaApp.jpeg",
      alt: "Hexa app screens: sales targets, active sales staff, customer profile with loyalty tier, purchase timeline, basket, quotation and payment options.",
      width: 3000,
      height: 2000,
    },
    tags: ["Enterprise mobile", "Multi-basket orders", "Role-based"],
    mobileCover: ["/images/projects/screens/hexa-manager-dashboard.webp", "/images/projects/screens/hexa-customer-timeline.webp"],
    mobileScreens: [
      { src: "/images/projects/screens/hexa-manager-dashboard.webp", alt: "Manager dashboard: Target and Sale tabs, month and country selectors, achieved target with trend, KPI tiles, active customers with open baskets, and a bottom bar with a central scan button.", title: "Dashboard — KPIs at a glance", note: "Target / Sale tabs with month and country filters, KPI tiles with trend, and active customers with their open baskets." },
      { src: "/images/projects/screens/hexa-customer-timeline.webp", alt: "Customer profile with gold tier, points, wallet balance and visit count, tabs for purchases, online, store visit, notes and address, and a dated store-visit timeline.", title: "Customer — history as a timeline", note: "Tier, points, wallet and visits in the header; store visits and orders as a dated timeline under clear tabs." },
      { src: "/images/projects/screens/hexa-customer-insights.webp", alt: "Customer dashboard tab with number of purchases, average spending chart and customer lifetime value bar chart.", title: "Customer — insights", note: "Purchase count, average spending and lifetime value on the customer's dashboard tab, for personalised service." },
      { src: "/images/projects/screens/hexa-cart.webp", alt: "Customer's online cart and wishlist with Select all, product cards, and Cancel and Move to Basket buttons.", title: "Cart — online to in-store", note: "The customer's online cart and wishlist, with Select all and Move to Basket to continue the order in store." },
    ],
    role: {
      title: "Lead Product Designer",
      scope: ["Enterprise UX", "Workflow analysis", "Information architecture", "Wireframes", "Prototyping", "UI", "Design system"],
      owned: [
        "Led UX strategy and user research for the showroom sales workflow",
        "Designed the information architecture, wireframes, high-fidelity UI and interactive prototypes",
        "Designed role-based access and personalised dashboards for sales staff and managers",
        "Designed product search, stock visibility, multi-basket ordering and customer management",
        "Built the scalable mobile design system",
      ],
      team: "Worked with product managers, React Native developers and business stakeholders.",
    },
    challenge: [
      "Showroom staff serve customers face to face, often several at once, but the information they need sits in many places: the customer's history and loyalty status, live stock, pending orders, open baskets and their own targets.",
      "Hexa brings that into one app built for a fast-paced showroom floor, with role-based views for sales staff and managers.",
    ],
    users: [
      { name: "Sales associates", need: "Identify the customer, find products and stock, and place orders, sometimes for several customers at once." },
      { name: "Managers", need: "See sales KPIs, pending orders, who is serving whom and progress against targets." },
    ],
    journey: {
      title: "Showroom sales workflow",
      steps: [
        { label: "Identify customer", note: "Profile with loyalty tier, points, wallet and visit count." },
        { label: "Understand history", note: "Timeline of store visits, orders and categories viewed." },
        { label: "Find product", note: "Search with filters and categories, detail pages, real-time stock and low-stock alerts." },
        { label: "Build basket", note: "A basket per customer — several open at once — or a formal quotation." },
        { label: "Take payment", note: "Card, cash, Tabby instalments or pay-by-link." },
        { label: "Track targets", note: "Personal and team targets by category cluster." },
      ],
    },
    problems: [
      { title: "Context lived in separate systems", body: "Customer history, loyalty, stock and orders weren't visible together at the moment of sale." },
      { title: "Different roles, different questions", body: "A sales rep, a manager and an executive need different first screens from the same data." },
      { title: "Several customers at once", body: "Associates juggle more than one customer on a busy floor and need each basket kept separate." },
      { title: "Following up", body: "Customers who don't buy on the first visit need tracking: Active, Pending and Archived segments, plus searchable sales history." },
      { title: "Who's serving whom", body: "On a busy floor, staff need to know which customer each colleague is currently serving." },
    ],
    approach: {
      "Customer Journey": "Mapped the showroom visit from greeting to payment, from both the customer's and the rep's side.",
      "Information Architecture": "Home, Information, Orders and Me, with a central scan action.",
      "User Flow": "Customer lookup, multi-basket ordering, quotation, payment and sales-history flows.",
      Wireframes: "Role-based dashboards explored per role before visual design.",
      "Component Strategy": "Profile header, KPI tiles and target bars shared across roles.",
      "Design System": "Reusable mobile components in the enterprise design system.",
      UI: "Loyalty tier shown in the profile header colour; a persistent 'currently serving' banner.",
      Prototype: "Interactive prototypes of the sales flows.",
      Development: "Shipped with React Native developers.",
    },
    screens: [
      {
        src: "/images/projects/HexaApp.jpeg",
        alt: "Hexa app screens: sales target and achievement tiles, active sales staff with serving and completed counts, gold-tier customer profile with points and wallet balance, store-visit timeline, basket with a 'currently serving' banner, create quotation, payment options and order confirmation.",
        width: 3000,
        height: 2000,
        caption: "Hexa — role-based views on one sales floor",
        notes: [
          { title: "Customer at a glance", body: "Loyalty tier, points, wallet balance and visit count sit in the profile header, before any tab." },
          { title: "History as a timeline", body: "Store visits, orders and categories viewed are shown chronologically, so a rep can pick up where the last one left off." },
          { title: "Currently serving", body: "A persistent banner shows which rep is serving the customer while a basket is open." },
          { title: "Flexible payment", body: "Card, cash, Tabby and pay-by-link are offered side by side at checkout." },
          { title: "Targets by cluster", body: "Progress bars by category cluster (furniture, outdoor) show target versus achieved." },
        ],
      },
    ],
    designSystem: {
      summary: "Enterprise mobile components designed to show dense data clearly on a phone, on a busy shop floor.",
      parts: [
        { label: "Profile header", note: "Avatar, role or tier, and key numbers." },
        { label: "KPI tiles", note: "Target, achieved, percentage and trend." },
        { label: "Staff row", note: "Person, serving count, completed count." },
        { label: "Timeline", note: "Dated events with location and outcome." },
        { label: "Navigation", note: "Bottom bar with a central scan action." },
      ],
    },
    designToCode: [
      { label: "Figma", note: "Role-based flows and UI." },
      { label: "Design system", note: "Enterprise mobile component set." },
      { label: "React Native", note: "Built with React Native developers." },
      { label: "Production", note: "Used by showroom sales teams." },
    ],
    outcome: [
      "Faster showroom sales and order processing.",
      "Less manual effort, thanks to real-time inventory visibility.",
      "Better customer engagement through faster product discovery and personalised service.",
      "Sales associates can handle several customer transactions at once.",
    ],
  },
];

export type ResponsiveScreen = {
  label: string;
  src: string;
  alt: string;
  notes: string[];
};

// Home & Furniture Commerce: one product, three surfaces, shown as tabs in
// the Selected work popup. Notes describe only what's visible in each
// capture: how navigation, search and layout change between breakpoints.
export const responsiveScreens: ResponsiveScreen[] = [
  {
    label: "Mobile web",
    src: "/images/responsive/retail-mobile.webp",
    alt: "The e-commerce site on a phone: menu button, logo, icons for support, search, wishlist and barcode scan, a delivery-location row, a full-width campaign banner and a bottom tab bar.",
    notes: [
      "Navigation collapses into a menu plus an icon row: support, search, wishlist, barcode scan.",
      "Delivery location gets its own row under the header.",
      "A bottom tab bar keeps Home, Categories, Cart and Me in thumb reach.",
    ],
  },
  {
    label: "Desktop web",
    src: "/images/responsive/retail-desktop.webp",
    alt: "The e-commerce site on desktop: utility bar with gift card, track order, sell with us, buy in bulk, store locator, delivery location and language; full-width search; horizontal category menu with Sale highlighted.",
    notes: [
      "A utility bar surfaces Gift Card, Track Order, Sell with us, Buy in Bulk and Store Locator.",
      "Search becomes a full-width field instead of an icon.",
      "Categories move into a horizontal menu, with Sale highlighted.",
    ],
  },
  {
    label: "Native app",
    src: "/images/projects/screens/dh-home-tracking.webp",
    alt: "Shopping app home screen with an order-status stepper at the top, campaign banners, delivery and payment benefits, and a bottom tab bar.",
    notes: [
      "Order status sits on the home screen, not buried in the account.",
      "Same components as the web, tuned for touch: larger targets, bottom tabs.",
    ],
  },
];

export const caseStudyBySlug = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);

// Project id → case-study slug, so Work cards can link to the deep dive.
export const caseStudyForProject = new Map(
  caseStudies.filter((c) => c.projectId).map((c) => [c.projectId!, c.slug])
);
