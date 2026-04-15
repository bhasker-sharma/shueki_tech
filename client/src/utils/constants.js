export const COMPANY_INFO = {
  name: 'Shueki Tech',
  tagline: 'Engineering Solutions That Drive Innovation',
  email: 'info@shuekitech.com',
  phone: '+91-84271-82071',
  address: 'Opposite UCO Bank, Ground Floor, Hoshiarpur Road, Garhshankar, Punjab - 144527',
  timezone: 'IST (UTC+5:30)',
  stats: {
    projects: '50+',
    clients: '30+',
    experience: '10+',
  },
}

export const NAVIGATION_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export const PROJECTS = [
  {
    id: 'ecommerce-platform',
    title: 'Multi-Vendor E-Commerce Platform',
    client: 'Anonymous',
    industry: 'Retail',
    service: 'web-development',
    problem: 'Client needed a scalable multi-vendor marketplace with integrated payment gateway and vendor management dashboard.',
    result: '3x increase in sales within 6 months. 50+ vendors onboarded at launch.',
    tech: ['React', 'Laravel', 'PostgreSQL', 'Stripe', 'AWS'],
    featured: true,
    year: 2024,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'factory-automation',
    title: 'Automated Quality Control System',
    client: 'Anonymous',
    industry: 'Manufacturing',
    service: 'machine-integration',
    problem: 'Manual inspection caused an 8% defect rate reaching customers and significant production downtime.',
    result: 'Defect rate reduced to 0.3%. Line throughput improved by 40%.',
    tech: ['PLC/SCADA', 'Python', 'OpenCV', 'MQTT', 'OPC-UA'],
    featured: true,
    year: 2024,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'ai-customer-support',
    title: 'AI-Powered Customer Support Pipeline',
    client: 'Anonymous',
    industry: 'SaaS',
    service: 'ai-pipelines',
    problem: 'Support team was overwhelmed with repetitive tickets. Average response time was 18 hours.',
    result: 'Auto-resolved 65% of tickets. Average response time dropped to under 2 minutes.',
    tech: ['Python', 'LangChain', 'OpenAI', 'n8n', 'PostgreSQL'],
    featured: true,
    year: 2024,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'iot-pcb-design',
    title: 'Industrial IoT Sensor Board',
    client: 'Anonymous',
    industry: 'Industrial IoT',
    service: 'pcb-designing',
    problem: 'Client needed a compact 4-layer PCB for real-time temperature and vibration monitoring in harsh environments.',
    result: 'Production-ready design delivered in 3 weeks. Board passed all certifications on first run.',
    tech: ['KiCAD', 'ESP32', 'MQTT', 'LTSpice', 'JLCPCB'],
    featured: true,
    year: 2023,
    gradient: 'from-green-500 to-teal-500',
  },
  {
    id: 'fleet-tracking-app',
    title: 'Fleet Tracking Mobile App',
    client: 'Anonymous',
    industry: 'Logistics',
    service: 'app-development',
    problem: 'Operations team had no real-time fleet visibility, causing delivery delays and fuel wastage.',
    result: 'Delivery accuracy improved by 28%. Fuel costs reduced by 15%.',
    tech: ['React Native', 'Firebase', 'Google Maps API', 'Redux'],
    featured: false,
    year: 2023,
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'smart-irrigation-rd',
    title: 'Smart Irrigation R&D Consultancy',
    client: 'Anonymous',
    industry: 'AgriTech',
    service: 'rd-consultancy',
    problem: 'Startup needed a technical feasibility study and PoC for an AI-based irrigation control system.',
    result: 'PoC delivered in 6 weeks. Client secured seed funding based on the technical prototype.',
    tech: ['Python', 'Raspberry Pi', 'MQTT', 'TensorFlow Lite'],
    featured: false,
    year: 2023,
    gradient: 'from-lime-500 to-green-600',
  },
]

export const SERVICES = [
  {
    id: 'web-development',
    title: 'Website Development',
    icon: 'Globe',
    description: 'Full-stack web applications, e-commerce platforms, and custom portals built with modern frameworks.',
    features: [
      'Custom web application development',
      'E-commerce platforms & payment integration',
      'Progressive Web Apps (PWA)',
      'API development & third-party integrations',
      'Admin dashboards & CMS solutions',
    ],
    tech: ['React', 'Node.js', 'Laravel', 'PostgreSQL', 'AWS', 'Tailwind CSS'],
  },
  {
    id: 'machine-integration',
    title: 'Machine Integration & Automation',
    icon: 'Cog',
    description: 'Industrial automation solutions including PLC/SCADA programming, robotics integration, and smart factory systems.',
    features: [
      'PLC & SCADA programming',
      'Industrial robotics integration',
      'IoT-enabled machine monitoring',
      'Process automation & optimization',
      'HMI design & development',
    ],
    tech: ['PLC/SCADA', 'ROS2', 'MQTT', 'Python', 'C++', 'OPC-UA'],
  },
  {
    id: 'ai-pipelines',
    title: 'AI Pipelines',
    icon: 'Brain',
    description: 'End-to-end ML model development, data pipelines, and AI workflow automation for intelligent business solutions.',
    features: [
      'Custom ML model training & deployment',
      'Data pipeline architecture',
      'Natural language processing solutions',
      'Computer vision applications',
      'AI workflow automation with n8n & LangChain',
    ],
    tech: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI', 'LangChain', 'n8n'],
  },
  {
    id: 'pcb-designing',
    title: 'PCB Designing',
    icon: 'CircuitBoard',
    description: 'Professional PCB design services from schematic capture to manufacturing-ready outputs and prototyping.',
    features: [
      'Schematic design & capture',
      'Multi-layer PCB layout (2-8 layers)',
      'DFM analysis & optimization',
      'Prototype coordination & testing',
      'Component sourcing & BOM management',
    ],
    tech: ['KiCAD', 'Altium Designer', 'Eagle', 'LTSpice', 'JLCPCB'],
  },
  {
    id: 'app-development',
    title: 'App Development',
    icon: 'Smartphone',
    description: 'Cross-platform mobile applications for iOS and Android built with a single codebase for faster delivery.',
    features: [
      'Cross-platform iOS & Android apps',
      'Native performance with shared codebase',
      'Push notifications & real-time features',
      'App Store & Play Store deployment',
      'Backend API integration & offline support',
    ],
    tech: ['React Native', 'Flutter', 'Firebase', 'REST APIs', 'SQLite', 'Redux'],
  },
  {
    id: 'rd-consultancy',
    title: 'R&D Consultancy',
    icon: 'Lightbulb',
    description: 'Technical consulting for new product development, feasibility studies, and innovation strategy.',
    features: [
      'Technical feasibility studies',
      'Product architecture design',
      'Technology stack evaluation',
      'Proof of concept development',
      'Innovation roadmap planning',
    ],
    tech: ['Custom Stack', 'Agile', 'Scrum', 'Documentation', 'Prototyping'],
  },
]

export const SERVICE_TYPE_LABELS = {
  'web-development': 'Website Development',
  'machine-integration': 'Machine Integration & Automation',
  'ai-pipelines': 'AI Pipelines',
  'pcb-designing': 'PCB Designing',
  'app-development': 'App Development',
  'rd-consultancy': 'R&D Consultancy',
  'general': 'General Enquiry',
}

export const TESTIMONIALS = [
  {
    name: 'Rajiv Mehta',
    role: 'Founder & CEO',
    company: 'RetailNexus',
    text: 'Shueki Tech built our multi-vendor marketplace from scratch. The team was professional, hit every milestone, and the final product exceeded our expectations. Our sales tripled within 6 months of launch.',
    rating: 5,
    service: 'Website Development',
    initials: 'RM',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Priya Sharma',
    role: 'Operations Director',
    company: 'Apex Manufacturing',
    text: 'We had persistent quality issues on our assembly line. Shueki Tech\'s automation solution cut our defect rate from 8% to under 0.3%. The ROI was visible within the first quarter — outstanding work.',
    rating: 5,
    service: 'Machine Integration',
    initials: 'PS',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    name: 'Arjun Kapoor',
    role: 'CTO',
    company: 'SupportFlow SaaS',
    text: 'The AI pipeline they built auto-resolves 65% of our support tickets. Our team is now free to handle only complex issues. Shueki Tech truly understands how to bridge AI capabilities with real business workflows.',
    rating: 5,
    service: 'AI Pipelines',
    initials: 'AK',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'David Chen',
    role: 'Hardware Lead',
    company: 'SensorGrid Technologies',
    text: 'We needed a production-ready 4-layer IoT sensor board under a tight timeline. Shueki Tech delivered a clean, certified design in 3 weeks. Their attention to DFM detail saved us a costly board respin.',
    rating: 5,
    service: 'PCB Designing',
    initials: 'DC',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    name: 'Neha Gupta',
    role: 'Product Manager',
    company: 'SwiftLogix',
    text: 'Our fleet tracking app is now the backbone of daily operations. Shueki Tech grasped our logistics domain quickly, delivered on schedule, and was always responsive. I would not hesitate to work with them again.',
    rating: 5,
    service: 'App Development',
    initials: 'NG',
    gradient: 'from-yellow-500 to-orange-500',
  },
]

export const FAQ_DATA = [
  {
    category: 'Timeline & Process',
    items: [
      {
        question: 'How long does a typical project take?',
        answer: 'It depends on scope. A standard website takes 3–6 weeks. A mobile app or automation solution typically runs 6–14 weeks. R&D or PCB projects are scoped individually. We always provide a detailed timeline before work begins.',
      },
      {
        question: 'What does your development process look like?',
        answer: 'We follow a structured 4-phase process: Discovery & Requirements → Design & Architecture → Development & Testing → Delivery & Handover. You get weekly progress updates and demo access throughout.',
      },
      {
        question: 'Do you work with international clients?',
        answer: 'Yes. We work with clients across India, the US, UK, Europe, and Southeast Asia. All communication is in English and we schedule calls to accommodate different time zones.',
      },
      {
        question: 'How do you handle project changes mid-way?',
        answer: 'Minor scope changes are absorbed where possible. For significant additions we raise a change request with a revised timeline and cost estimate, which requires your approval before proceeding. We never surprise you with unplanned charges.',
      },
    ],
  },
  {
    category: 'Pricing & Contracts',
    items: [
      {
        question: 'How do you price your projects?',
        answer: 'Most projects are priced on a fixed-scope basis after a detailed requirements discussion. For ongoing work or evolving scopes, we offer a monthly retainer model. We are transparent — you receive a full itemised quote before signing.',
      },
      {
        question: 'What are your payment terms?',
        answer: 'Typically 40% upfront to commence work, 30% at mid-project milestone, and 30% on final delivery. For larger engagements we can agree on milestone-based billing spread over the project duration.',
      },
      {
        question: 'Do you sign NDAs and contracts?',
        answer: 'Absolutely. We sign a mutual NDA before any technical discussion, and a formal Statement of Work (SoW) is prepared for every project that covers scope, deliverables, timelines, and IP ownership.',
      },
      {
        question: 'Do you offer discounts for startups or long-term partnerships?',
        answer: 'Yes. Startups at the pre-revenue stage and clients who commit to ongoing work qualify for preferential rates. Reach out and we will work out an arrangement that fits your budget.',
      },
    ],
  },
  {
    category: 'Tech Stack & Quality',
    items: [
      {
        question: 'What technologies do you specialise in?',
        answer: 'Web: React, Laravel, Node.js, PostgreSQL, AWS. Mobile: React Native, Flutter. AI/ML: Python, LangChain, TensorFlow, OpenAI. Automation: PLC/SCADA, ROS2, MQTT, OPC-UA. PCB: KiCAD, Altium Designer, LTSpice.',
      },
      {
        question: 'Can you integrate with our existing tech stack?',
        answer: 'Yes. We frequently integrate into or extend existing systems. Share your current architecture during the discovery call and we will assess compatibility and recommend the cleanest integration path.',
      },
      {
        question: 'Will we own the source code and IP?',
        answer: 'Yes, 100%. Upon final payment all source code, design files, and documentation are transferred to you with full intellectual property rights. We retain no claims over the work we build for you.',
      },
      {
        question: 'How do you ensure code quality?',
        answer: 'We use peer code reviews, automated testing (unit + integration), linting, and CI/CD pipelines. For hardware and PCB work, design rule checks (DRC) and LTSpice simulations are run before fabrication files are released.',
      },
    ],
  },
  {
    category: 'Support & Maintenance',
    items: [
      {
        question: 'What support do you provide after project delivery?',
        answer: 'Every project includes a 30-day post-launch support window at no extra cost. This covers bug fixes, minor adjustments, and onboarding assistance. Extended support is available via our monthly maintenance plans.',
      },
      {
        question: 'Do you offer ongoing maintenance plans?',
        answer: 'Yes. We offer monthly retainer plans that include security updates, performance monitoring, feature additions, and priority response times. Plans are sized to the complexity of your platform.',
      },
      {
        question: 'Can we request new features after delivery?',
        answer: 'Absolutely. Many of our best client relationships are long-term. Post-delivery feature requests are scoped, quoted, and prioritised through a simple change request process so there are no surprises.',
      },
    ],
  },
]
