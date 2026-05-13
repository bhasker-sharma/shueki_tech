export const COMPANY_INFO = {
  name: 'Shueki Tech',
  tagline: 'Software for Connected Products and Operations',
  email: 'info@shuekitech.com',
  phone: '+91-84271-82071',
  address: 'Opposite UCO Bank, Ground Floor, Hoshiarpur Road, Garhshankar, Punjab - 144527',
  timezone: 'IST (UTC+5:30)',
  stats: {
    projects: '10+',
    clients: '3+',
    experience: '2+',
  },
}

export const NAVIGATION_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'What We Build', path: '/what-we-build' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export const PROJECTS = [
  {
    id: 'factory-automation',
    title: 'Automated Quality Control System',
    client: 'Anonymous',
    industry: 'Manufacturing',
    service: 'edge-integration',
    problem: 'Manual inspection caused an 8% defect rate reaching customers and significant production downtime.',
    result: 'Defect rate reduced to 0.3%. Line throughput improved by 40%.',
    tech: ['PLC/SCADA', 'Python', 'OpenCV', 'MQTT', 'OPC-UA'],
    featured: true,
    year: 2024,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'iot-sensor-dashboard',
    title: 'Industrial IoT Sensor Dashboard',
    client: 'Anonymous',
    industry: 'Industrial IoT',
    service: 'edge-integration',
    problem: 'Client needed real-time monitoring software for temperature and vibration sensors deployed in harsh environments.',
    result: 'Live sensor dashboard deployed in 3 weeks. System has been running without interruption since launch.',
    tech: ['MQTT', 'React', 'Node.js', 'InfluxDB', 'ESP32'],
    featured: true,
    year: 2023,
    gradient: 'from-green-500 to-teal-500',
  },
  {
    id: 'fleet-tracking-app',
    title: 'Fleet Operations Dashboard',
    client: 'Anonymous',
    industry: 'Logistics',
    service: 'web-dashboards',
    problem: 'Operations team had no real-time fleet visibility, causing delivery delays and fuel wastage.',
    result: 'Delivery accuracy improved by 28%. Fuel costs reduced by 15%.',
    tech: ['React', 'Node.js', 'Firebase', 'Google Maps API', 'REST'],
    featured: true,
    year: 2023,
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'vendor-management-portal',
    title: 'Multi-Vendor Management Portal',
    client: 'Anonymous',
    industry: 'Retail',
    service: 'web-dashboards',
    problem: 'Client needed a scalable admin portal for managing multiple vendors, inventory, and payments in one place.',
    result: '50+ vendors onboarded at launch. Order processing time reduced by 60%.',
    tech: ['React', 'Laravel', 'PostgreSQL', 'Stripe', 'AWS'],
    featured: true,
    year: 2024,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'operational-intelligence',
    title: 'Operational Intelligence Dashboard',
    client: 'Anonymous',
    industry: 'SaaS',
    service: 'web-dashboards',
    problem: 'Operations team needed a real-time view of workflow throughput, bottlenecks, and automated escalations.',
    result: '65% of routine workflows handled automatically. Average resolution time dropped from 18 hours to under 2 minutes.',
    tech: ['React', 'Python', 'LangChain', 'OpenAI', 'PostgreSQL'],
    featured: false,
    year: 2024,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'edge-sensor-control',
    title: 'Edge Sensor Control System',
    client: 'Anonymous',
    industry: 'AgriTech',
    service: 'edge-integration',
    problem: 'Startup needed a proof-of-concept for edge-based sensor control with a usable operator interface.',
    result: 'Working PoC delivered in 6 weeks. Client secured seed funding based on the technical prototype.',
    tech: ['Python', 'Raspberry Pi', 'MQTT', 'React', 'TensorFlow Lite'],
    featured: false,
    year: 2023,
    gradient: 'from-lime-500 to-green-600',
  },
]

export const SERVICES = [
  {
    id: 'desktop-applications',
    title: 'Desktop Applications',
    icon: 'Monitor',
    tagline: 'Software that runs close to the hardware',
    description: 'Operator tools, monitoring applications, control interfaces, and internal workflow software built for reliability on managed hardware.',
    features: [
      'Machine operator panels and HMI interfaces',
      'Production monitoring and alerting tools',
      'Field data collection and management software',
      'Engineering configuration and calibration utilities',
      'Cross-platform desktop apps (Windows, Linux)',
    ],
    tech: ['Electron', 'Tauri', 'React', 'Python', 'C++', 'SQLite'],
    overview: 'When the browser is not the right deployment target, we build desktop software that sits close to the hardware and the user. Built for operational environments where reliability, speed, and direct hardware access matter.',
    useCases: [
      'Machine operators who need fast, focused control interfaces',
      'Field technicians working in low-connectivity environments',
      'Teams managing local hardware with direct serial or USB connections',
      'Operations that need software running on locked-down managed hardware',
    ],
    processSteps: [
      { step: '01', title: 'Environment & requirements', desc: 'We start by understanding the hardware it runs on, the network context (offline, LAN, restricted), the users — operators, technicians, or engineers — and what the software must do reliably.' },
      { step: '02', title: 'UI architecture for operations', desc: 'Desktop interfaces for operational users are not consumer apps. We design for clarity, speed, and error resilience — layouts that work in noisy, high-stakes environments.' },
      { step: '03', title: 'Development & hardware integration', desc: 'We build the application, connecting to local hardware, serial ports, or databases as required. Hardware-facing layers are tested against real devices, not just mocked connections.' },
      { step: '04', title: 'Packaging, deployment & handover', desc: 'We deliver an installer or deployment package, on-site or remote testing support, and documentation for your IT team. You get the full source code on handover.' },
    ],
    meta: {
      title: 'Desktop Applications | Software for Operators & Connected Hardware — Shueki Tech',
      description: 'Shueki Tech builds desktop applications for machine operators, field technicians, and operational teams — control interfaces, monitoring tools, and workflow software that connects to hardware.',
    },
  },
  {
    id: 'web-dashboards',
    title: 'Web Dashboards',
    icon: 'LayoutDashboard',
    tagline: 'Real operational data, made usable',
    description: 'Browser-based monitoring, reporting, and control systems designed for real operational data — device state, sensor feeds, live alerts, and historical logs.',
    features: [
      'Real-time device and sensor monitoring',
      'Fleet and asset management portals',
      'Operational reporting and analytics views',
      'Role-based access and multi-user management',
      'Alert management and notification workflows',
    ],
    tech: ['React', 'Node.js', 'Laravel', 'PostgreSQL', 'WebSockets', 'REST APIs'],
    overview: 'Browser-based systems designed to handle real operational data — not just static charts. We build dashboards that are usable in daily operations, with live data, alerts, and controls that your team can depend on.',
    useCases: [
      'Remote monitoring of devices, sensors, or assets',
      'Operations teams managing multi-site or multi-device environments',
      'Companies needing a reporting layer on top of operational data',
      'Connected product teams who need a cloud-facing interface',
    ],
    processSteps: [
      { step: '01', title: 'Data source mapping', desc: 'We identify what feeds the dashboard — APIs, databases, device streams, or third-party services — and understand data frequency, format, and reliability before designing anything.' },
      { step: '02', title: 'Information architecture', desc: 'We define what your users need to see, act on, and report from. Layouts are designed around operational decisions, not just data display.' },
      { step: '03', title: 'Dashboard build', desc: 'Frontend, backend API, real-time connections, and role-based access are built together as a cohesive system. Performance and data accuracy are validated throughout.' },
      { step: '04', title: 'Staging, review & rollout', desc: 'You review the working dashboard in a staging environment before it goes live. We support the production deployment and train your team on usage.' },
    ],
    meta: {
      title: 'Web Dashboards | Operational Monitoring & Control Systems — Shueki Tech',
      description: 'Shueki Tech builds web dashboards for device monitoring, fleet management, sensor data visualization, and operational control — designed for real data, not just demos.',
    },
  },
  {
    id: 'edge-integration',
    title: 'Edge Integration',
    icon: 'Cpu',
    tagline: 'The connection layer between software and the real world',
    description: 'The software layer between your hardware and your interface — handling device communication, sensor protocols, and field-connected data as part of the software system.',
    features: [
      'MQTT, OPC-UA, and Modbus protocol integration',
      'PLC and SCADA data connectivity',
      'IoT gateway software and middleware',
      'Serial and industrial bus interface layers',
      'Edge-to-cloud data pipeline development',
    ],
    tech: ['MQTT', 'OPC-UA', 'Modbus', 'Python', 'Node.js', 'C++'],
    overview: 'This is not a separate service — it is part of how we architect software for connected environments. When your system needs to communicate with hardware, we handle the integration as part of the same delivery.',
    useCases: [
      'Systems where software must read from or write to PLCs, sensors, or machines',
      'IoT products that need a reliable data collection and transmission layer',
      'Operations where edge data needs to flow into a web or desktop interface',
      'Hardware products that need companion software with device communication',
    ],
    processSteps: [
      { step: '01', title: 'Hardware context review', desc: 'We assess the hardware — what devices, what protocols, what data format, what polling frequency, and what failure conditions matter. This shapes every architectural decision that follows.' },
      { step: '02', title: 'Integration layer design', desc: 'We design the communication middleware: protocol drivers, data normalization, error handling, reconnection logic, and buffering for intermittent connectivity.' },
      { step: '03', title: 'Development & lab testing', desc: 'We build the integration layer and test it against real hardware or validated simulation. Protocol edge cases, timing issues, and data integrity are verified before the broader system is built on top.' },
      { step: '04', title: 'Field deployment & documentation', desc: 'We support on-site or remote deployment, document the integration layer fully — protocols, register maps, configuration — and hand over everything so your team can maintain it.' },
    ],
    meta: {
      title: 'Edge Integration | Device & Sensor Software for Connected Systems — Shueki Tech',
      description: 'Shueki Tech builds the software integration layer between your hardware and your interface — PLC connectivity, MQTT, OPC-UA, IoT gateway software, and edge-to-cloud pipelines.',
    },
  },
]

export const SERVICE_TYPE_LABELS = {
  'desktop-applications': 'Desktop Applications',
  'web-dashboards': 'Web Dashboards',
  'edge-integration': 'Edge Integration',
  'general': 'General Enquiry',
  // Legacy labels — for existing database records
  'web-development': 'Web Development',
  'machine-integration': 'Machine Integration',
  'ai-pipelines': 'AI Pipelines',
  'pcb-designing': 'PCB Design',
  'app-development': 'App Development',
  'rd-consultancy': 'R&D Consultancy',
}

export const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Operations Director',
    company: 'Apex Manufacturing',
    text: 'We had persistent quality issues on our assembly line. Shueki Tech\'s monitoring and integration work cut our defect rate from 8% to under 0.3%. The ROI was visible within the first quarter — outstanding work.',
    rating: 5,
    service: 'Edge Integration',
    initials: 'PS',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    name: 'David Chen',
    role: 'Hardware Lead',
    company: 'SensorGrid Technologies',
    text: 'We needed software that could reliably pull data from deployed IoT sensors and surface it in a usable dashboard. Shueki Tech understood the hardware side from day one — that combination of software craft and device knowledge is genuinely rare.',
    rating: 5,
    service: 'Edge Integration',
    initials: 'DC',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    name: 'Neha Gupta',
    role: 'Product Manager',
    company: 'SwiftLogix',
    text: 'Our fleet operations dashboard is now the backbone of daily dispatch. Shueki Tech grasped our domain quickly, delivered on schedule, and was always responsive. I would not hesitate to work with them again.',
    rating: 5,
    service: 'Web Dashboards',
    initials: 'NG',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    name: 'Rajiv Mehta',
    role: 'Founder & CEO',
    company: 'RetailNexus',
    text: 'Shueki Tech built our vendor management portal from scratch. The team was professional, hit every milestone, and the final product exceeded our expectations.',
    rating: 5,
    service: 'Web Dashboards',
    initials: 'RM',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Arjun Kapoor',
    role: 'CTO',
    company: 'SupportFlow SaaS',
    text: 'The operational dashboard they built gave us real-time visibility into workflow bottlenecks for the first time. Shueki Tech understood our data model and delivered something genuinely useful to the team.',
    rating: 5,
    service: 'Web Dashboards',
    initials: 'AK',
    gradient: 'from-purple-500 to-pink-500',
  },
]

export const FAQ_DATA = [
  {
    category: 'Connected Systems',
    items: [
      {
        question: 'Can you integrate software with our existing hardware or devices?',
        answer: 'Yes. Edge integration is a core part of how we build software for connected environments. We handle communication with PLCs, sensors, IoT gateways, and industrial machines as part of the software project — not as an afterthought. We ask about your hardware context in the first discovery conversation.',
      },
      {
        question: 'What device protocols and interfaces do you support?',
        answer: 'MQTT, OPC-UA, Modbus (TCP and RTU), serial interfaces (RS-232, RS-485), REST-based hardware APIs, and custom binary protocols where needed. If your device uses a different protocol, share the documentation and we will assess compatibility.',
      },
      {
        question: 'Do you build the hardware as well as the software?',
        answer: 'No. We are a software company. We build the software layer — interfaces, dashboards, data pipelines, and the communication middleware that connects them to hardware. We do not design or manufacture hardware. But we understand hardware-connected environments, which means we ask the right questions and design software that works reliably with your physical systems.',
      },
      {
        question: 'Can you work with our existing PLC or SCADA system?',
        answer: 'Yes, in most cases. We connect to existing PLC and SCADA systems via standard protocols (OPC-UA, Modbus, MQTT) and build the software layer on top — dashboards, monitoring tools, reporting, or operator interfaces.',
      },
    ],
  },
  {
    category: 'Timeline & Process',
    items: [
      {
        question: 'How long does a typical project take?',
        answer: 'A focused web dashboard typically takes 4–8 weeks. A desktop application or a project with hardware integration typically runs 8–14 weeks depending on protocol complexity and hardware availability. We provide a detailed timeline in the architecture document before development begins.',
      },
      {
        question: 'What does your development process look like?',
        answer: 'We follow a 5-phase process: Discovery → Architecture Document → Sprint Development → Integration & Testing → Handover. You receive a written architecture plan before we write code, and working software to review at the end of each sprint. Nothing moves forward without your approval.',
      },
      {
        question: 'Do you work with international clients?',
        answer: 'Yes. We work with clients in India, the US, UK, Europe, and Southeast Asia. Our IST timezone overlaps with EU afternoons and US mornings. Most collaboration is async — which we have found works well for technical projects with clear documentation and regular demos.',
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
        answer: 'Most projects are priced on a fixed-scope basis after a discovery conversation and architecture review. For ongoing work or evolving scopes, we offer a monthly retainer model. You receive a full itemised quote before signing.',
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
    category: 'Delivery & Support',
    items: [
      {
        question: 'Will we own the source code and IP?',
        answer: 'Yes, 100%. Upon final payment all source code, design files, and documentation are transferred to you with full intellectual property rights. We retain no claims over the work we build for you.',
      },
      {
        question: 'Can you integrate with our existing tech stack?',
        answer: 'Yes. We frequently integrate into or extend existing systems. Share your current architecture during the discovery call and we will assess compatibility and recommend the cleanest integration path.',
      },
      {
        question: 'What support do you provide after project delivery?',
        answer: 'Every project includes a 30-day post-launch support window at no extra cost. This covers bug fixes, minor adjustments, and onboarding assistance. Extended support is available via our monthly maintenance plans.',
      },
      {
        question: 'Can we request new features after delivery?',
        answer: 'Absolutely. Post-delivery feature requests are scoped, quoted, and prioritised through a simple change request process. Many of our best client relationships are long-term.',
      },
    ],
  },
]
