export const COMPANY_INFO = {
  name: 'Shueki Tech',
  tagline: 'Engineering Solutions That Drive Innovation',
  email: 'info@shuekitech.com',
  phone: '+91-XXXX-XXXXXX',
  address: 'Bangalore, Karnataka, India',
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
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
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
