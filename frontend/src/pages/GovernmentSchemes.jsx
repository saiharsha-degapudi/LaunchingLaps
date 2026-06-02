import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳', hasData: true },
  { code: 'US', name: 'United States', flag: '🇺🇸', hasData: false },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', hasData: false },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', hasData: false },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', hasData: false },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', hasData: false },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', hasData: false },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', hasData: false },
  { code: 'FR', name: 'France', flag: '🇫🇷', hasData: false },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', hasData: false },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', hasData: false },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', hasData: false },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', hasData: false },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', hasData: false },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', hasData: false },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', hasData: false },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', hasData: false },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', hasData: false },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', hasData: false },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', hasData: false },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', hasData: false },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', hasData: false },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', hasData: false },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', hasData: false },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', hasData: false },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', hasData: false },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', hasData: false },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', hasData: false },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', hasData: false },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', hasData: false },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', hasData: false },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', hasData: false },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', hasData: false },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', hasData: false },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', hasData: false },
]

const INDIA_STATES = [
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=350&fit=crop&q=80',
    capital: 'Amaravati',
    tagline: 'Land of Heritage & Innovation',
    color: 'from-orange-500 to-red-600',
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=350&fit=crop&q=80',
    capital: 'Chennai',
    tagline: 'Gateway to South India',
    color: 'from-red-600 to-rose-700',
  },
  {
    code: 'TS',
    name: 'Telangana',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=350&fit=crop&q=80',
    capital: 'Hyderabad',
    tagline: 'Hub of Technology & Startups',
    color: 'from-pink-500 to-rose-600',
  },
]

const SCHEMES = {
  AP: [
    {
      id: 'ap-1',
      name: 'AP MSME Development Policy 2023–28',
      category: 'MSME',
      badge: '🏭',
      description: 'Comprehensive support for Micro, Small & Medium Enterprises with capital subsidy, interest subsidy, power tariff concessions, and marketing assistance to boost industrial growth.',
      eligibility: ['Enterprises with investment up to ₹250 crore', 'Registered in Andhra Pradesh', 'Operational for at least 1 year', 'No default on bank loans'],
      benefits: ['15% capital subsidy (max ₹50 lakh)', 'Interest subsidy up to 6% p.a.', 'Power tariff concession ₹1/unit', 'GST reimbursement for 5 years', 'Stamp duty exemption on land'],
      documents: ['Udyam Registration Certificate', 'GST Certificate', 'Bank statements (6 months)', 'Project Report', 'Land documents'],
      ministry: 'AP Industries & Commerce Dept.',
      applyLink: 'https://ipass.ap.gov.in/',
      status: 'Active',
      launched: 'Jan 2023',
    },
    {
      id: 'ap-2',
      name: 'AP IPASS — Single Window Clearance',
      category: 'Approvals',
      badge: '✅',
      description: 'Instant and transparent single-window system for all business approvals, licenses, and clearances in Andhra Pradesh within a guaranteed 21-day timeline.',
      eligibility: ['All new businesses', 'Existing businesses seeking expansion', 'Any sector except restricted categories'],
      benefits: ['All approvals in 21 days', 'Online tracking of applications', 'No physical visits required', 'Dedicated relationship manager', 'Automatic renewals for 3 years'],
      documents: ['Company incorporation documents', 'Project Report', 'Land Use Certificate', 'Environmental Clearance (if required)', 'PAN & GST'],
      ministry: 'AP Industrial Infrastructure Corporation',
      applyLink: 'https://ipass.ap.gov.in/',
      status: 'Active',
      launched: 'Apr 2015',
    },
    {
      id: 'ap-3',
      name: 'Jagananna Thodu — Zero Interest Loan',
      category: 'Finance',
      badge: '💰',
      description: 'Government-backed zero-interest working capital loans for small traders, street vendors, and micro-entrepreneurs to strengthen livelihood and business growth.',
      eligibility: ['Small traders and vendors', 'Micro-entrepreneurs', 'Annual turnover below ₹10 lakh', 'AP state resident'],
      benefits: ['Loan up to ₹10,000 (first time)', 'Zero interest rate', 'No collateral required', 'Loan up to ₹1 lakh for regular borrowers', 'Linked with insurance'],
      documents: ['Aadhaar Card', 'Ration Card', 'Bank account details', 'Trade license (if any)', 'Passport photo'],
      ministry: 'AP BC Welfare Department',
      applyLink: 'https://spandana.ap.gov.in/',
      status: 'Active',
      launched: 'Mar 2020',
    },
    {
      id: 'ap-4',
      name: 'AP Startup Policy — Seed & Scale',
      category: 'Startup',
      badge: '🚀',
      description: 'End-to-end support for startups including seed funding, mentorship, incubation support, and market access through the official AP Startup ecosystem.',
      eligibility: ['Startups registered in AP', 'Company age below 7 years', 'Innovative product or service', 'Not listed on stock exchange'],
      benefits: ['Seed fund up to ₹10 lakh', 'Free co-working space (12 months)', 'Mentorship from 200+ experts', 'Market linkage support', 'Patent filing reimbursement'],
      documents: ['DPIIT Startup Registration', 'Incorporation Certificate', 'Business Plan', 'Founders KYC', 'Pitch Deck'],
      ministry: 'AP Innovation Society',
      applyLink: 'https://www.startupap.com/',
      status: 'Active',
      launched: 'Sep 2021',
    },
    {
      id: 'ap-5',
      name: 'YSR SC/ST New Entrepreneur Policy',
      category: 'Social',
      badge: '🤝',
      description: 'Special incentive scheme for SC/ST entrepreneurs to establish industries and enterprises with enhanced subsidies, reservations in government procurement, and skill support.',
      eligibility: ['SC/ST community entrepreneurs', 'AP domicile', 'New enterprise or expansion', 'Below poverty line not mandatory'],
      benefits: ['25% capital subsidy (additional 10% over general)', 'Reserved allocation in industrial parks', '10% reservation in govt purchases', 'Free skill training (3 months)', 'Legal & compliance support'],
      documents: ['Caste Certificate', 'Aadhaar Card', 'Bank Account', 'Project Report', 'Land documents (if owned)'],
      ministry: 'AP SC/ST Corporations',
      applyLink: 'https://www.apindustries.gov.in/',
      status: 'Active',
      launched: 'Jul 2020',
    },
    {
      id: 'ap-6',
      name: 'AP Women Entrepreneur Scheme',
      category: 'Women',
      badge: '👩‍💼',
      description: 'Dedicated scheme to empower women entrepreneurs through preferential financing, training, market linkages, and government purchase reservations.',
      eligibility: ['Women-owned/led enterprise (51%+ ownership)', 'AP resident', 'Business below 5 years old', 'Any sector eligible'],
      benefits: ['Additional 5% interest subsidy', '5% reservation in government tenders', 'Free EDP training program', 'Marketing exposure at national trade fairs', 'Legal support for business registration'],
      documents: ['Aadhaar Card', 'Business Registration', 'Bank Statements', 'Ownership Proof', 'Passport Photo'],
      ministry: 'AP Women Development & Child Welfare Dept.',
      applyLink: 'https://www.apindustries.gov.in/',
      status: 'Active',
      launched: 'Feb 2022',
    },
    {
      id: 'ap-7',
      name: 'AP Green Energy Industrial Policy',
      category: 'Clean Energy',
      badge: '🌿',
      description: 'Incentives and support for industries adopting renewable energy, green manufacturing processes, and sustainable business practices.',
      eligibility: ['Industries using 20%+ renewable energy', 'New green-tech ventures', 'EV manufacturing units', 'AP-registered companies'],
      benefits: ['Additional 10% capital subsidy', 'Priority grid connection', 'Carbon credit support', 'Green certification support', 'Reduced land lease rates in eco-parks'],
      documents: ['Energy audit report', 'Green certification plan', 'Project Report', 'Company registration', 'Environmental clearance'],
      ministry: 'AP New & Renewable Energy Development Corporation',
      applyLink: 'https://www.nredcap.in/',
      status: 'Active',
      launched: 'Oct 2022',
    },
    {
      id: 'ap-8',
      name: 'AP e-Pragati — Digital Business Services',
      category: 'Digital',
      badge: '💻',
      description: 'Integrated digital platform for availing 800+ government services online, including business registrations, renewals, certificates, and compliance filings.',
      eligibility: ['All businesses and individuals', 'Registered in AP', 'Aadhaar-linked account required'],
      benefits: ['800+ services online', 'Real-time status tracking', 'Digital document vault', 'Integrated payment gateway', 'WhatsApp notifications'],
      documents: ['Aadhaar Card', 'Mobile number linked to Aadhaar'],
      ministry: 'AP Technology Services Ltd.',
      applyLink: 'https://www.apepragati.ap.gov.in/',
      status: 'Active',
      launched: 'Jan 2018',
    },
  ],

  TN: [
    {
      id: 'tn-1',
      name: 'NEEDS — New Entrepreneur Enterprise Development',
      category: 'Startup',
      badge: '🚀',
      description: 'Flagship Tamil Nadu scheme providing financial assistance, mentoring, and skill development to first-generation entrepreneurs from economically weaker sections.',
      eligibility: ['First-generation entrepreneur', 'Age 18–35 years', 'Tamil Nadu resident', 'Project cost ₹5 lakh to ₹5 crore'],
      benefits: ['25% subsidy on project cost', 'Soft loan at 3% interest', 'Free 6-month EDP training', 'Mentoring from industry experts', 'Priority in government procurement'],
      documents: ['Educational certificates', 'Aadhaar Card', 'Nativity Certificate', 'Project Report', 'Bank No-Dues Certificate'],
      ministry: 'Tamil Nadu Industries Dept.',
      applyLink: 'https://www.msmeonline.tn.gov.in/',
      status: 'Active',
      launched: 'Jun 2012',
    },
    {
      id: 'tn-2',
      name: 'CMEGP — Chief Minister Employment Generation',
      category: 'Employment',
      badge: '💼',
      description: 'State-sponsored scheme to generate employment through setting up new micro-enterprises by providing margin money assistance to entrepreneurs.',
      eligibility: ['Age 18–55 years', 'TN resident (3 years)', 'Not defaulter to any bank', 'First-time entrepreneur'],
      benefits: ['Subsidy 25%–35% of project cost', 'Bank loan for balance amount', 'Max project cost ₹25 lakh (manufacturing)', 'Online application process', 'Skill training support'],
      documents: ['Aadhaar', 'Community Certificate', 'Educational Proof', 'Project Report', 'Bank Account details'],
      ministry: 'TN Khadi & Village Industries Board',
      applyLink: 'https://www.tnkvib.com/',
      status: 'Active',
      launched: 'Apr 2019',
    },
    {
      id: 'tn-3',
      name: 'Tamil Nadu Startup & Innovation Policy 2023',
      category: 'Startup',
      badge: '💡',
      description: 'Comprehensive startup ecosystem policy offering grants, incubation, market access, and regulatory fast-track for technology and deep-tech startups.',
      eligibility: ['DPIIT-recognised startups', 'Registered in Tamil Nadu', 'Technology or innovation focus', 'Turnover below ₹100 crore'],
      benefits: ['Seed grant up to ₹15 lakh', 'Incubation in TIDCO facilities', 'IP support (patent filing)', 'Government pilot projects', 'Access to marquee investors'],
      documents: ['DPIIT Certificate', 'Incorporation papers', 'Pitch deck', 'Technology description', 'Founders KYC'],
      ministry: 'Tamil Nadu Startup & Innovation Mission (TANSIM)',
      applyLink: 'https://tansim.in/',
      status: 'Active',
      launched: 'Jan 2023',
    },
    {
      id: 'tn-4',
      name: 'TAHDCO — SC/ST Entrepreneur Scheme',
      category: 'Social',
      badge: '🤝',
      description: 'Targeted financial and infrastructural support for SC/ST community members to establish and scale businesses in manufacturing, trade, and services.',
      eligibility: ['SC/ST community', 'TN domicile', 'Age 18–50 years', 'Enterprise below 3 years old'],
      benefits: ['Subsidy up to 50% of project cost', 'Concessional loans', 'Free skill training', 'Reserved stalls in fairs', 'Legal documentation support'],
      documents: ['Caste Certificate', 'Aadhaar Card', 'Income Certificate', 'Project Report', 'Land/Shop proof'],
      ministry: 'Tamil Nadu Adi Dravidar Housing & Development Corporation',
      applyLink: 'https://www.tahdco.com/',
      status: 'Active',
      launched: 'Mar 2015',
    },
    {
      id: 'tn-5',
      name: 'Make in Tamil Nadu — Industrial Incentives',
      category: 'Manufacturing',
      badge: '🏭',
      description: 'Investment-attracting policy with tiered incentives for manufacturing units, special economic zones, and anchor industries setting up in Tamil Nadu.',
      eligibility: ['Manufacturing units', 'Investment ₹10 lakh and above', 'TN-registered company', 'Generates local employment'],
      benefits: ['Capital subsidy 15%–25%', 'Power tariff concession', 'Stamp duty exemption', 'Employment generation incentive', 'Infrastructure support'],
      documents: ['Company registration', 'DIC registration', 'Factory license', 'Project Report', 'Employment details'],
      ministry: 'TN Industries Promotion Corporation (TIDCO)',
      applyLink: 'https://www.tidco.com/',
      status: 'Active',
      launched: 'Sep 2021',
    },
    {
      id: 'tn-6',
      name: 'TN Agri-Business Incubation Forum',
      category: 'Agriculture',
      badge: '🌾',
      description: 'Support for agri-tech and food processing startups with lab facilities, market linkage, and financial assistance through the NABARD-backed incubation network.',
      eligibility: ['Agri-tech entrepreneurs', 'Food processing units', 'Farmer Producer Organizations', 'Below 10 years of operation'],
      benefits: ['Free lab & cold storage access', 'NABARD refinance linkage', '₹25 lakh grant for prototyping', 'Market linkage support', 'FPO formation support'],
      documents: ['Aadhaar', 'Land records (if farmer)', 'Business Plan', 'Bank Account', 'KYC documents'],
      ministry: 'TN Agribusiness Development Agency (TNAD)',
      applyLink: 'https://agri.tn.gov.in/',
      status: 'Active',
      launched: 'Nov 2020',
    },
    {
      id: 'tn-7',
      name: 'TNSIC — Micro Enterprise Loan Scheme',
      category: 'Finance',
      badge: '💰',
      description: 'Low-interest term loans and working capital support for micro enterprises in manufacturing and services through the Tamil Nadu Small Industries Corporation.',
      eligibility: ['Micro enterprises (investment < ₹1 crore)', 'TN-registered', 'Minimum 1 year operation', 'No bank default'],
      benefits: ['Loans up to ₹25 lakh at 8% interest', 'No processing fee', 'Repayment up to 7 years', 'Moratorium period 6 months', 'Collateral free up to ₹10 lakh'],
      documents: ['Udyam Certificate', 'GST registration', 'IT returns (2 years)', 'Bank statements', 'Quotations for machinery'],
      ministry: 'Tamil Nadu Small Industries Corporation (TNSIC)',
      applyLink: 'https://www.tnsic.in/',
      status: 'Active',
      launched: 'Jan 2017',
    },
    {
      id: 'tn-8',
      name: 'TN Women Entrepreneur Support Scheme',
      category: 'Women',
      badge: '👩‍💼',
      description: 'Dedicated financial and capacity-building support for women entrepreneurs including training, market linkage, and subsidised credit.',
      eligibility: ['Women-led enterprises (51%+ ownership)', 'TN resident', 'Age 18–60 years', 'Any sector'],
      benefits: ['Additional 5% subsidy on capital', 'Free EDP training (45 days)', 'Priority in SIDCO estates', '5% reservation in govt tenders', 'Online mentoring access'],
      documents: ['Aadhaar', 'Community Certificate', 'Business Registration', 'Bank Statements', 'Nativity Certificate'],
      ministry: 'Tamil Nadu Corporation for Development of Women',
      applyLink: 'https://www.tamilnaduwomen.org/',
      status: 'Active',
      launched: 'Mar 2021',
    },
  ],

  TS: [
    {
      id: 'ts-1',
      name: 'T-Hub — Startup Incubation Program',
      category: 'Startup',
      badge: '🚀',
      description: "Asia's largest startup incubator offering co-working space, mentorship, investor access, and corporate partnerships for tech and deep-tech startups.",
      eligibility: ['Registered startups (any sector)', 'Technology-driven business model', 'Telangana-based or willing to relocate', 'Under 7 years old'],
      benefits: ['12 months free co-working space', 'Access to 300+ mentors', 'Direct investor connects', 'Corporate pilot opportunities', 'International market exposure'],
      documents: ['DPIIT Startup Certificate', 'Company Registration', 'Pitch Deck', 'Founders KYC', 'Product Demo'],
      ministry: 'T-Hub Foundation (Govt. of Telangana)',
      applyLink: 'https://t-hub.co/apply',
      status: 'Active',
      launched: 'Nov 2015',
    },
    {
      id: 'ts-2',
      name: 'TS-iPASS — Investment Promotion',
      category: 'Investment',
      badge: '✅',
      description: "Telangana's transparent single-window investment facilitation system guaranteeing approvals within 15 days for all industries.",
      eligibility: ['All new industrial units', 'Service industries', 'Existing units for expansion', 'Any investment size'],
      benefits: ['Approvals within 15 days guaranteed', 'Online tracking dashboard', 'Deemed approval if delayed', 'Single point contact', 'Post-investment monitoring'],
      documents: ['Company Registration', 'Project Report', 'Land documents', 'Promoter KYC', 'Bank sanction letter'],
      ministry: 'Telangana Industrial & Commerce Dept.',
      applyLink: 'https://ipass.telangana.gov.in/',
      status: 'Active',
      launched: 'Jan 2015',
    },
    {
      id: 'ts-3',
      name: 'WE-Hub — Women Entrepreneurs Hub',
      category: 'Women',
      badge: '👩‍💼',
      description: "India's first state-led incubator exclusively for women entrepreneurs, offering funding, mentoring, market access, and policy advocacy.",
      eligibility: ['Women-led startups (51%+ women ownership)', 'Pre-revenue to growth stage', 'Telangana-based or willing to register', 'Any sector'],
      benefits: ['Seed funding up to ₹15 lakh', 'Free incubation (6 months)', '100+ women-focused mentors', 'Procurement support (state govt)', 'Export promotion assistance'],
      documents: ['Aadhaar Card', 'Incorporation Documents', 'Pitch Deck', 'Business Plan', 'Bank Account Proof'],
      ministry: 'WE-Hub (Govt. of Telangana)',
      applyLink: 'https://wehub.telangana.gov.in/',
      status: 'Active',
      launched: 'Mar 2018',
    },
    {
      id: 'ts-4',
      name: 'T-Works — Hardware Startup Hub',
      category: 'Hardware',
      badge: '⚙️',
      description: "India's largest prototyping facility for hardware and deep-tech startups, offering state-of-the-art manufacturing equipment and design support.",
      eligibility: ['Hardware/IoT/robotics startups', 'Deep-tech ventures', 'Students with prototypes', 'MSME manufacturing units'],
      benefits: ['Access to ₹100 crore worth of equipment', 'Free for startups (first 3 months)', 'Expert engineers on-site', 'Product testing labs', 'Manufacturing scale-up support'],
      documents: ['Company Registration / Student ID', 'Project Brief', 'Founders KYC', 'Prototype Plan'],
      ministry: 'T-Works (Govt. of Telangana)',
      applyLink: 'https://t-works.io/apply',
      status: 'Active',
      launched: 'Dec 2019',
    },
    {
      id: 'ts-5',
      name: 'Telangana Industrial Policy 2020–2025',
      category: 'MSME',
      badge: '🏭',
      description: 'Comprehensive industrial policy offering location-based incentives, capital subsidies, and employment incentives to attract manufacturing to Telangana.',
      eligibility: ['All manufacturing units', 'Service industries', 'Investment ₹25 lakh and above', 'Generates minimum 10 local jobs'],
      benefits: ['Capital subsidy 15%–25% (zone-based)', 'Employment incentive ₹2000/employee/month', 'Power cost reimbursement', 'Stamp duty exemption', 'SGST reimbursement (5 years)'],
      documents: ['Udyam Certificate', 'Factory License', 'GST Registration', 'Investment Proof', 'Employment records'],
      ministry: 'Telangana Industries & Commerce Dept.',
      applyLink: 'https://ipass.telangana.gov.in/',
      status: 'Active',
      launched: 'May 2020',
    },
    {
      id: 'ts-6',
      name: 'TASK — Skill Development for Entrepreneurs',
      category: 'Skills',
      badge: '🎓',
      description: 'Free and subsidised industry-aligned skill development programs for entrepreneurs and their employees in IT, manufacturing, healthcare, and emerging technologies.',
      eligibility: ['Entrepreneurs and employees in Telangana', 'Age 18–45 years', 'Minimum 10th standard education', 'Aadhaar-registered'],
      benefits: ['Free training in 50+ courses', 'Industry certification upon completion', 'Job placement assistance', 'Paid internship opportunities', 'NSQF-aligned curriculum'],
      documents: ['Aadhaar Card', 'Educational Certificates', 'Passport Photo', 'Bank Account (for stipend)'],
      ministry: 'Telangana Academy for Skill & Knowledge (TASK)',
      applyLink: 'https://task.telangana.gov.in/',
      status: 'Active',
      launched: 'Apr 2016',
    },
    {
      id: 'ts-7',
      name: 'Telangana MSME Finance Scheme',
      category: 'Finance',
      badge: '💰',
      description: 'Interest subsidy and collateral-free loan scheme for MSME units in Telangana to support working capital needs and capital expenditure.',
      eligibility: ['MSME units in Telangana', 'Udyam registered', 'No NPA classification', 'Bank account in nationalised bank'],
      benefits: ['Interest subsidy 5% p.a.', 'Collateral-free up to ₹10 lakh', 'Working capital up to ₹50 lakh', 'Term loan up to ₹1 crore', 'Online application via TS-iPASS'],
      documents: ['Udyam Certificate', 'GST Certificate', 'IT Returns (2 years)', 'Bank Statements (12 months)', 'Project Report'],
      ministry: 'Telangana State Financial Corporation (TSFC)',
      applyLink: 'https://tsfc.telangana.gov.in/',
      status: 'Active',
      launched: 'Jun 2021',
    },
    {
      id: 'ts-8',
      name: 'Hyderabad Pharma City — Pharma Cluster',
      category: 'Pharma',
      badge: '💊',
      description: "World's largest integrated pharmaceutical city offering plug-and-play facilities, shared utilities, and regulatory support for pharma and biotech companies.",
      eligibility: ['Pharma manufacturing companies', 'Biotech ventures', 'API & formulation units', 'R&D companies'],
      benefits: ['Plug-and-play factory spaces', 'Shared ETP & utilities', 'Fast regulatory clearances', 'Export facilitation center', 'Logistics hub access'],
      documents: ['Company Registration', 'Drug License', 'Project Report', 'Environmental Plan', 'Investment Proof'],
      ministry: 'Telangana Industrial Infrastructure Corporation (TGIIC)',
      applyLink: 'https://tgiic.telangana.gov.in/',
      status: 'Active',
      launched: 'Oct 2021',
    },
  ],
}

export default function GovernmentSchemes() {
  const { user } = useAuth()
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const stateRef = useRef(null)
  const schemeRef = useRef(null)

  function handleCountrySelect(country) {
    setSelectedCountry(country)
    setSelectedState(null)
    setSelectedScheme(null)
    setTimeout(() => stateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  function handleStateSelect(state) {
    setSelectedState(state)
    setSelectedScheme(null)
    setTimeout(() => schemeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const schemes = selectedState ? SCHEMES[selectedState.code] || [] : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* PAGE HEADER */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full border border-brand-200 mb-3 uppercase tracking-widest">
          🏛️ Government Schemes Portal
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-800 mb-2">
          Government Schemes & Policies
        </h1>
        <p className="text-gray-500 text-base max-w-2xl">
          Discover government-approved funding schemes, policies, and programs for entrepreneurs. Select your country and state to explore active opportunities.
        </p>
      </div>

      {/* STEP 1 — COUNTRY SCROLLER */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-brand-800 text-white text-xs font-black flex items-center justify-center">1</div>
          <h2 className="text-lg font-black text-brand-800">Select Your Country</h2>
          {selectedCountry && (
            <span className="text-sm text-gray-400 font-medium">
              → {selectedCountry.flag} {selectedCountry.name}
            </span>
          )}
        </div>

        <div className="overflow-x-auto pb-3 -mx-1 px-1">
          <div className="flex gap-3 w-max">
            {COUNTRIES.map(country => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:scale-105 whitespace-nowrap ${
                  selectedCountry?.code === country.code
                    ? 'bg-brand-800 text-white border-brand-800 shadow-lg shadow-brand-800/20'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-brand-400 hover:text-brand-800'
                }`}
              >
                <span className="text-lg">{country.flag}</span>
                <span>{country.name}</span>
                {country.hasData && (
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full inline-block" /> Green dot = schemes available</span>
        </p>
      </div>

      {/* STEP 2 — STATE / COMING SOON */}
      {selectedCountry && (
        <div ref={stateRef} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-brand-800 text-white text-xs font-black flex items-center justify-center">2</div>
            <h2 className="text-lg font-black text-brand-800">
              {selectedCountry.hasData ? 'Select Your State' : selectedCountry.name + ' — Schemes'}
            </h2>
            {selectedState && (
              <span className="text-sm text-gray-400 font-medium">→ {selectedState.name}</span>
            )}
          </div>

          {selectedCountry.hasData ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {INDIA_STATES.map(state => (
                <button
                  key={state.code}
                  onClick={() => handleStateSelect(state)}
                  className={`relative overflow-hidden rounded-2xl text-left transition-all hover:scale-[1.02] hover:shadow-2xl group ${
                    selectedState?.code === state.code ? 'ring-4 ring-brand-500 ring-offset-2 shadow-2xl scale-[1.02]' : 'shadow-md'
                  }`}
                >
                  <div className="relative h-44">
                    <img
                      src={state.image}
                      alt={state.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${state.color} opacity-70`} />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{state.capital} · Capital</p>
                      <h3 className="text-xl font-black leading-tight">{state.name}</h3>
                      <p className="text-xs opacity-80 mt-1">{state.tagline}</p>
                    </div>
                    {selectedState?.code === state.code && (
                      <div className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-brand-800" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="bg-white px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-brand-800">{SCHEMES[state.code]?.length || 0} Schemes Available</span>
                      <span className="text-xs text-brand-600 font-semibold group-hover:translate-x-1 transition-transform inline-block">Explore →</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-10 text-center">
              <div className="text-6xl mb-4">{selectedCountry.flag}</div>
              <h3 className="text-xl font-black text-gray-700 mb-2">Coming Soon for {selectedCountry.name}</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                We're actively adding government schemes and policies for {selectedCountry.name}. Be the first to know when we go live — register your interest below.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/+916300000000?text=Notify me when schemes for ${selectedCountry.name} are added on LaunchingLaps`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  🔔 Notify Me When Available
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3 — SCHEMES GRID */}
      {selectedState && schemes.length > 0 && (
        <div ref={schemeRef} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-brand-800 text-white text-xs font-black flex items-center justify-center">3</div>
            <h2 className="text-lg font-black text-brand-800">
              {selectedState.name} — Active Government Schemes
            </h2>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">
              {schemes.length} Active
            </span>
          </div>

          <div className="overflow-x-auto pb-4 -mx-1 px-1">
            <div className="flex gap-4 w-max">
              {schemes.map(scheme => (
                <button
                  key={scheme.id}
                  onClick={() => setSelectedScheme(scheme)}
                  className={`flex-shrink-0 w-72 text-left rounded-2xl border transition-all hover:shadow-xl hover:-translate-y-1 group overflow-hidden ${
                    selectedScheme?.id === scheme.id
                      ? 'border-brand-500 ring-2 ring-brand-400 shadow-xl'
                      : 'border-gray-100 bg-white shadow-sm'
                  }`}
                >
                  <div className={`p-5 ${selectedScheme?.id === scheme.id ? 'bg-brand-50' : 'bg-white'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{scheme.badge}</div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                        scheme.status === 'Active'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {scheme.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-1.5">{scheme.category}</p>
                    <h3 className="font-black text-brand-800 text-sm leading-snug mb-2 line-clamp-2">{scheme.name}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{scheme.description}</p>
                  </div>
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Since {scheme.launched}</span>
                    <span className="text-xs font-bold text-brand-700 group-hover:translate-x-1 transition-transform inline-block">
                      {selectedScheme?.id === scheme.id ? 'Selected ✓' : 'View Details →'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">← Scroll horizontally to see all schemes →</p>
        </div>
      )}

      {/* STEP 4 — SCHEME DETAIL PANEL */}
      {selectedScheme && (
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 mb-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-blue-900 px-8 py-7 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{selectedScheme.badge}</span>
                  <div>
                    <p className="text-brand-200 text-xs font-bold uppercase tracking-widest">{selectedScheme.category} · {selectedScheme.ministry}</p>
                    <span className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-400/40 text-green-300 text-xs font-bold px-2.5 py-1 rounded-full mt-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> {selectedScheme.status} · Since {selectedScheme.launched}
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight">{selectedScheme.name}</h2>
                <p className="text-blue-200 text-sm mt-2 max-w-2xl leading-relaxed">{selectedScheme.description}</p>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors text-lg font-light"
              >×</button>
            </div>
          </div>

          {/* Detail content */}
          <div className="bg-white p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

              {/* Eligibility */}
              <div>
                <h3 className="font-black text-brand-800 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-500 rounded-full" /> Eligibility
                </h3>
                <ul className="space-y-2.5">
                  {selectedScheme.eligibility.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="font-black text-brand-800 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gold-500 rounded-full" /> Key Benefits
                </h3>
                <ul className="space-y-2.5">
                  {selectedScheme.benefits.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-gold-500 font-black flex-shrink-0 mt-0.5">★</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents Required */}
              <div>
                <h3 className="font-black text-brand-800 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" /> Documents Required
                </h3>
                <ul className="space-y-2.5">
                  {selectedScheme.documents.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-400 flex-shrink-0 mt-0.5">📄</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <a
                href={selectedScheme.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-brand-800 to-brand-700 hover:from-brand-700 hover:to-brand-600 text-white font-black py-4 px-8 rounded-xl text-center transition-all hover:scale-[1.02] shadow-lg shadow-brand-800/20 flex items-center justify-center gap-3"
              >
                <span>Apply / Register Now</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href={selectedScheme.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 px-6 rounded-xl transition-colors text-sm"
              >
                🌐 Visit Official Portal
              </a>
              <button
                onClick={() => setSelectedScheme(null)}
                className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold py-4 px-6 rounded-xl transition-colors text-sm"
              >
                ← Back to Schemes
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>Disclaimer:</strong> This information is sourced from official government portals and is updated periodically. Scheme details, eligibility criteria, and deadlines may change. Always verify the latest terms on the official government website before applying.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
