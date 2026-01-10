// WordPress Development Project Template Configuration
// Designed for 20-day project cycle (1 month)

export const projectConfig = {
  name: "WordPress Development",
  description: "Complete end-to-end WordPress website development on cPanel/Hostinger",
  totalDays: 20,
  
  // Custom fields for GitHub Project
  customFields: {
    status: {
      name: "Status",
      type: "SINGLE_SELECT",
      options: ["Backlog", "To Do", "In Progress", "In Review", "Done", "Blocked"]
    },
    phase: {
      name: "Phase",
      type: "SINGLE_SELECT",
      options: [
        "1. Discovery",
        "2. Planning",
        "3. Design",
        "4. Environment",
        "5. Backend",
        "6. Frontend",
        "7. Content",
        "8. Testing",
        "9. Functionality",
        "10. User Acceptance",
        "11. Deployment"
      ]
    },
    priority: {
      name: "Priority",
      type: "SINGLE_SELECT",
      options: ["Critical", "High", "Medium", "Low"]
    },
    timeAllocation: {
      name: "Time %",
      type: "NUMBER"
    },
    estimatedDays: {
      name: "Est. Days",
      type: "NUMBER"
    },
    assignee: {
      name: "Developer",
      type: "SINGLE_SELECT",
      options: ["Dev 1 (Lead)", "Dev 2 (FE)", "Dev 3 (FE)", "Dev 4 (BE/Ecom)", "Dev 5 (BE/Int)", "Dev 6 (QA)"]
    },
    siteType: {
      name: "Site Type",
      type: "SINGLE_SELECT",
      options: ["Static", "Dynamic", "E-Commerce", "Portfolio", "Corporate", "Blog"]
    }
  },

  // Phases and Tasks (33 activities across 11 phases)
  phases: [
    {
      id: "phase-1",
      name: "Discovery",
      percentage: 10,
      days: 2,
      color: "BLUE",
      tasks: [
        {
          title: "Client Onboarding & Kickoff Call",
          description: "Initial client meeting, business objectives documentation, target audience identification, competitor analysis brief",
          percentage: 3,
          priority: "Critical",
          labels: ["client-facing", "documentation"],
          checklist: [
            "Schedule kickoff call",
            "Prepare discovery questionnaire",
            "Document business objectives",
            "Identify target audience",
            "Create competitor brief"
          ]
        },
        {
          title: "Requirements Gathering",
          description: "Site type determination, feature requirements list, content inventory, third-party integrations identification",
          percentage: 4,
          priority: "Critical",
          labels: ["documentation", "planning"],
          checklist: [
            "Determine site type (static/dynamic/e-commerce)",
            "Create feature requirements list",
            "Inventory existing content",
            "List required integrations (CRM, email, payment)",
            "Document form requirements",
            "Identify membership/booking needs"
          ]
        },
        {
          title: "Project Planning",
          description: "Milestone definition, resource allocation, communication protocol setup, risk assessment",
          percentage: 3,
          priority: "Critical",
          labels: ["planning", "management"],
          checklist: [
            "Define project milestones",
            "Allocate resources",
            "Setup communication channels",
            "Create RACI matrix",
            "Conduct risk assessment"
          ]
        }
      ]
    },
    {
      id: "phase-2",
      name: "Planning",
      percentage: 8,
      days: 1.5,
      color: "PURPLE",
      tasks: [
        {
          title: "Technical Scoping",
          description: "Hosting requirements validation, domain & SSL setup planning, performance requirements, security requirements",
          percentage: 3,
          priority: "High",
          labels: ["technical", "infrastructure"],
          checklist: [
            "Validate Hostinger cPanel specs",
            "Plan domain & SSL setup",
            "Define performance requirements",
            "Document security requirements",
            "Estimate traffic expectations"
          ]
        },
        {
          title: "Solution Architecture",
          description: "Theme selection, plugin stack decision, database structure planning, URL structure & permalink planning",
          percentage: 3,
          priority: "High",
          labels: ["technical", "architecture"],
          checklist: [
            "Evaluate theme options (Starter/Astra/Custom)",
            "Define plugin stack",
            "Plan custom post types & taxonomies",
            "Design URL structure",
            "Plan database schema"
          ]
        },
        {
          title: "Technical Spec Docs",
          description: "Sitemap creation, wireframe approval workflow, feature specification sign-off",
          percentage: 2,
          priority: "High",
          labels: ["documentation", "client-facing"],
          checklist: [
            "Create sitemap",
            "Define wireframe workflow",
            "Document feature specifications",
            "Get client sign-off"
          ]
        }
      ]
    },
    {
      id: "phase-3",
      name: "Design",
      percentage: 15,
      days: 3,
      color: "GREEN",
      tasks: [
        {
          title: "Visual Identity Setup",
          description: "Color palette selection, typography selection, logo placement, design system/style guide creation",
          percentage: 5,
          priority: "High",
          labels: ["design", "branding"],
          checklist: [
            "Select and approve color palette",
            "Choose typography (Google Fonts)",
            "Position logo and branding assets",
            "Create style guide document"
          ]
        },
        {
          title: "UI/UX Design - All Pages",
          description: "Complete UI/UX design for homepage and all inner pages in Figma/Adobe XD with mobile responsive design specs",
          percentage: 7,
          priority: "Critical",
          labels: ["design", "ui-ux"],
          checklist: [
            "Create desktop homepage mockup",
            "Create tablet homepage mockup",
            "Create mobile homepage mockup",
            "Design hero section",
            "Design navigation",
            "Design about page template",
            "Design services/products template",
            "Design contact page template",
            "Design blog listing template",
            "Design single post template",
            "Map user flow"
          ]
        },
        {
          title: "Design Review & Approval",
          description: "Client presentation, revision cycles (2 rounds typical), final design sign-off",
          percentage: 3,
          priority: "Critical",
          labels: ["client-facing", "design"],
          checklist: [
            "Schedule design review call",
            "Present designs to client",
            "Document feedback - Round 1",
            "Implement revisions - Round 1",
            "Document feedback - Round 2",
            "Implement revisions - Round 2",
            "Get final sign-off"
          ]
        }
      ]
    },
    {
      id: "phase-4",
      name: "Environment",
      percentage: 5,
      days: 1,
      color: "ORANGE",
      tasks: [
        {
          title: "Hostinger/cPanel Configuration",
          description: "Domain pointing, DNS configuration, SSL certificate installation, PHP version configuration, MySQL database creation",
          percentage: 2,
          priority: "Critical",
          labels: ["infrastructure", "hosting"],
          checklist: [
            "Point domain to Hostinger",
            "Configure DNS records",
            "Install SSL certificate",
            "Set PHP version to 8.0+",
            "Create MySQL database"
          ]
        },
        {
          title: "WordPress/CMS Installation",
          description: "Fresh WP installation via Softaculous, admin credentials setup, staging environment",
          percentage: 2,
          priority: "Critical",
          labels: ["infrastructure", "wordpress"],
          checklist: [
            "Install WordPress via Softaculous",
            "Configure admin credentials",
            "Setup staging URL",
            "Configure wp-config.php security",
            "Initialize Git (optional)"
          ]
        },
        {
          title: "Development Environment Sync",
          description: "Local dev sync (LocalWP/DevKinsta), backup automation setup",
          percentage: 1,
          priority: "Medium",
          labels: ["infrastructure", "devops"],
          checklist: [
            "Setup local development environment",
            "Sync with staging",
            "Configure backup automation"
          ]
        }
      ]
    },
    {
      id: "phase-5",
      name: "Backend",
      percentage: 20,
      days: 4,
      color: "RED",
      tasks: [
        {
          title: "Theme Setup, Essential Plugin Installation & Configuration",
          description: "Theme installation, child theme creation, essential plugins setup including page builder, SEO, forms, security, performance, backup",
          percentage: 8,
          priority: "Critical",
          labels: ["backend", "theme", "plugins"],
          checklist: [
            "Install parent theme",
            "Create child theme",
            "Configure theme options",
            "Setup header/footer",
            "Create menu structure",
            "Install Elementor/Gutenberg",
            "Configure Yoast SEO",
            "Setup WPForms/Contact Form 7",
            "Install Wordfence security",
            "Configure caching plugin",
            "Setup UpdraftPlus backup"
          ]
        },
        {
          title: "Custom Functionality Development",
          description: "Custom post types, custom fields (ACF), shortcodes, custom widgets, API integrations",
          percentage: 6,
          priority: "High",
          labels: ["backend", "development"],
          checklist: [
            "Register custom post types",
            "Create custom taxonomies",
            "Setup ACF field groups",
            "Build custom shortcodes",
            "Develop custom widgets",
            "Integrate third-party APIs"
          ]
        },
        {
          title: "E-Commerce Setup (WooCommerce)",
          description: "WooCommerce configuration, payment gateway integration, shipping, tax configuration, inventory",
          percentage: 6,
          priority: "High",
          labels: ["backend", "ecommerce"],
          conditions: ["siteType:E-Commerce"],
          checklist: [
            "Install WooCommerce",
            "Configure store settings",
            "Setup payment gateways (Stripe/PayPal)",
            "Configure shipping zones & methods",
            "Setup tax configuration",
            "Configure inventory management",
            "Test checkout flow"
          ]
        }
      ]
    },
    {
      id: "phase-6",
      name: "Frontend",
      percentage: 20,
      days: 4,
      color: "YELLOW",
      tasks: [
        {
          title: "Page Building - Core 7 Secondary Pages",
          description: "Complete page building for homepage, core pages, and all secondary pages including policies, templates, and error pages",
          percentage: 13,
          priority: "Critical",
          labels: ["frontend", "pages"],
          checklist: [
            "Build homepage",
            "Build about page",
            "Build services/products page",
            "Build contact page with forms",
            "Build blog listing page",
            "Build single post template",
            "Build privacy policy page",
            "Build terms & conditions page",
            "Build FAQ page",
            "Build landing page templates",
            "Build category/archive pages",
            "Build 404 error page",
            "Build search results page"
          ]
        },
        {
          title: "Responsive Implementation",
          description: "Tablet breakpoint adjustments, mobile optimization, touch-friendly navigation",
          percentage: 4,
          priority: "Critical",
          labels: ["frontend", "responsive"],
          checklist: [
            "Adjust tablet breakpoints (768px-1024px)",
            "Optimize mobile layout (<768px)",
            "Configure touch-friendly navigation",
            "Setup mobile menu",
            "Test all device viewports"
          ]
        },
        {
          title: "Animation & Interactions",
          description: "Scroll animations, hover effects, loading transitions, micro-interactions",
          percentage: 3,
          priority: "Medium",
          labels: ["frontend", "ux"],
          checklist: [
            "Add scroll animations",
            "Configure hover effects",
            "Setup loading transitions",
            "Add micro-interactions",
            "Test performance impact"
          ]
        }
      ]
    },
    {
      id: "phase-7",
      name: "Content",
      percentage: 7,
      days: 1.5,
      color: "PINK",
      tasks: [
        {
          title: "Content Migration/Entry",
          description: "Text content insertion, image optimization & upload (WebP), media library organization",
          percentage: 3,
          priority: "High",
          labels: ["content", "media"],
          checklist: [
            "Insert all text content",
            "Optimize images (compression/WebP)",
            "Upload media assets",
            "Organize media library",
            "Add alt text to all images"
          ]
        },
        {
          title: "Content Formatting & SEO",
          description: "Typography consistency, spacing alignment, CTA placement, internal linking, meta data",
          percentage: 2,
          priority: "High",
          labels: ["content", "seo"],
          checklist: [
            "Check typography consistency",
            "Adjust spacing & alignment",
            "Position CTAs properly",
            "Setup internal linking structure",
            "Add meta titles & descriptions",
            "Configure heading hierarchy"
          ]
        },
        {
          title: "Quality Assurance",
          description: "Content quality review, proofreading, link validation, visual consistency check",
          percentage: 2,
          priority: "High",
          labels: ["content", "qa"],
          checklist: [
            "Proofread all content",
            "Verify spelling and grammar",
            "Check link accuracy",
            "Validate visual consistency",
            "Review content hierarchy",
            "Confirm brand voice alignment"
          ]
        }
      ]
    },
    {
      id: "phase-8",
      name: "Testing",
      percentage: 5,
      days: 1,
      color: "GRAY",
      tasks: [
        {
          title: "Functional Testing",
          description: "All links verification, form submission testing, e-commerce checkout flow, search functionality",
          percentage: 2,
          priority: "Critical",
          labels: ["testing", "qa"],
          checklist: [
            "Test all internal links",
            "Test all external links",
            "Test form submissions",
            "Test e-commerce checkout (if applicable)",
            "Test search functionality",
            "Test user registration/login"
          ]
        },
        {
          title: "Cross-Browser Testing",
          description: "Chrome, Firefox, Safari, Edge testing on desktop browsers",
          percentage: 2,
          priority: "High",
          labels: ["testing", "browser"],
          checklist: [
            "Test on Chrome desktop",
            "Test on Firefox desktop",
            "Test on Safari desktop",
            "Test on Edge desktop",
            "Fix browser-specific CSS issues"
          ]
        },
        {
          title: "Mobile Browser Testing",
          description: "Mobile browser testing on iOS and Android devices",
          percentage: 1,
          priority: "High",
          labels: ["testing", "browser", "mobile"],
          checklist: [
            "Test on iOS Safari",
            "Test on Chrome Android",
            "Test responsive layouts",
            "Verify touch interactions",
            "Fix mobile-specific issues"
          ]
        }
      ]
    },
    {
      id: "phase-9",
      name: "Functionality",
      percentage: 5,
      days: 1,
      color: "CYAN",
      tasks: [
        {
          title: "Performance Testing",
          description: "Google PageSpeed (target: 90+), GTmetrix analysis, Core Web Vitals optimization",
          percentage: 2,
          priority: "Critical",
          labels: ["testing", "performance"],
          checklist: [
            "Run Google PageSpeed Insights",
            "Analyze with GTmetrix",
            "Check Core Web Vitals (LCP, FID, CLS)",
            "Optimize images if needed",
            "Verify lazy loading",
            "Target: 90+ mobile score"
          ]
        },
        {
          title: "Security Testing",
          description: "Vulnerability scan, login security verification, file permissions, SSL verification",
          percentage: 2,
          priority: "Critical",
          labels: ["testing", "security"],
          checklist: [
            "Run Wordfence scan",
            "Verify login security",
            "Check file permissions",
            "Verify SSL across all pages",
            "Test brute force protection"
          ]
        },
        {
          title: "SEO Audit",
          description: "Meta titles/descriptions, heading hierarchy, schema markup, XML sitemap",
          percentage: 1,
          priority: "High",
          labels: ["testing", "seo"],
          checklist: [
            "Verify meta titles & descriptions",
            "Check heading hierarchy (H1-H6)",
            "Validate schema markup",
            "Generate XML sitemap",
            "Submit to search console"
          ]
        }
      ]
    },
    {
      id: "phase-10",
      name: "User Acceptance",
      percentage: 3,
      days: 0.5,
      color: "BLUE",
      tasks: [
        {
          title: "Client Review Session",
          description: "Guided walkthrough with client, feature demonstration, content accuracy verification",
          percentage: 1,
          priority: "Critical",
          labels: ["client-facing", "uat"],
          checklist: [
            "Schedule UAT session",
            "Prepare demo script",
            "Conduct guided walkthrough",
            "Demonstrate all features",
            "Verify content accuracy",
            "Collect feedback"
          ]
        },
        {
          title: "UAT Feedback Implementation",
          description: "Punch list creation, minor revisions execution, final approval sign-off",
          percentage: 1,
          priority: "Critical",
          labels: ["client-facing", "uat"],
          checklist: [
            "Create punch list from feedback",
            "Implement minor revisions",
            "Re-verify with client",
            "Get final sign-off"
          ]
        },
        {
          title: "Handover & Documentation",
          description: "Prepare comprehensive documentation, training materials, and handover package for client",
          percentage: 1,
          priority: "High",
          labels: ["client-facing", "documentation"],
          checklist: [
            "Prepare handover documentation",
            "Create training materials",
            "Document admin procedures",
            "Compile credentials package",
            "Prepare maintenance guidelines",
            "Schedule handover meeting"
          ]
        }
      ]
    },
    {
      id: "phase-11",
      name: "Deployment",
      percentage: 2,
      days: 0.5,
      color: "GREEN",
      tasks: [
        {
          title: "Pre-Launch Checklist",
          description: "Favicon, analytics, search console, social meta tags, robots.txt, htaccess review",
          percentage: 0.7,
          priority: "Critical",
          labels: ["deployment", "seo"],
          checklist: [
            "Install favicon",
            "Setup Google Analytics",
            "Configure Google Tag Manager",
            "Verify search console",
            "Add Open Graph meta tags",
            "Review robots.txt",
            "Review .htaccess"
          ]
        },
        {
          title: "Go-Live Monitoring",
          description: "Staging to production migration, DNS propagation monitoring, cache management, live verification",
          percentage: 0.7,
          priority: "Critical",
          labels: ["deployment", "launch"],
          checklist: [
            "Migrate staging to production",
            "Monitor DNS propagation",
            "Purge all caches",
            "Warm cache",
            "Final live verification",
            "Monitor site performance post-launch"
          ]
        },
        {
          title: "Post-Launch Handover",
          description: "Client handover session, admin training, backup verification, project closure",
          percentage: 0.6,
          priority: "High",
          labels: ["client-facing", "documentation"],
          checklist: [
            "Conduct final handover session",
            "Complete admin training",
            "Verify backup system operational",
            "Provide all login credentials",
            "Deliver final documentation",
            "Close project officially"
          ]
        }
      ]
    }
  ],

  // Labels to create in the repository
  labels: [
    { name: "client-facing", color: "0E8A16", description: "Involves client interaction" },
    { name: "documentation", color: "1D76DB", description: "Documentation tasks" },
    { name: "planning", color: "5319E7", description: "Planning & architecture" },
    { name: "technical", color: "B60205", description: "Technical tasks" },
    { name: "infrastructure", color: "FBCA04", description: "Infrastructure setup" },
    { name: "design", color: "F9D0C4", description: "Design related" },
    { name: "ui-ux", color: "D4C5F9", description: "UI/UX design" },
    { name: "branding", color: "C2E0C6", description: "Branding assets" },
    { name: "wordpress", color: "21759B", description: "WordPress specific" },
    { name: "hosting", color: "FFA500", description: "Hosting configuration" },
    { name: "devops", color: "006B75", description: "DevOps tasks" },
    { name: "backend", color: "B60205", description: "Backend development" },
    { name: "frontend", color: "0052CC", description: "Frontend development" },
    { name: "theme", color: "7057FF", description: "Theme related" },
    { name: "plugins", color: "008672", description: "Plugin configuration" },
    { name: "development", color: "E99695", description: "Development tasks" },
    { name: "ecommerce", color: "96281B", description: "E-commerce specific" },
    { name: "pages", color: "BFDADC", description: "Page building" },
    { name: "responsive", color: "C5DEF5", description: "Responsive design" },
    { name: "ux", color: "D93F0B", description: "User experience" },
    { name: "content", color: "FEF2C0", description: "Content tasks" },
    { name: "media", color: "EDEDED", description: "Media assets" },
    { name: "seo", color: "0E8A16", description: "SEO tasks" },
    { name: "testing", color: "FBCA04", description: "Testing tasks" },
    { name: "qa", color: "D4C5F9", description: "Quality assurance" },
    { name: "browser", color: "C2E0C6", description: "Browser testing" },
    { name: "mobile", color: "FFC0CB", description: "Mobile testing" },
    { name: "performance", color: "F9D0C4", description: "Performance optimization" },
    { name: "security", color: "B60205", description: "Security tasks" },
    { name: "uat", color: "0052CC", description: "User acceptance testing" },
    { name: "deployment", color: "006B75", description: "Deployment tasks" },
    { name: "launch", color: "0E8A16", description: "Go-live tasks" },
    { name: "management", color: "5319E7", description: "Project management" },
    { name: "architecture", color: "1D76DB", description: "Architecture design" }
  ]
};

export default projectConfig;
