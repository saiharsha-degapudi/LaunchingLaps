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

// type: 'state' = state government scheme | 'central' = Government of India scheme
const SCHEMES = {
  AP: [
    // ── STATE SCHEMES ──────────────────────────────────────────────────────────
    {
      id: 'ap-1',
      type: 'state',
      name: 'AP IPASS — Single Window Investment Approval',
      category: 'Approvals',
      badge: '✅',
      description: 'AP\'s transparent single-window clearance system for all industrial approvals, licenses, and permissions — guaranteed within 21 days. Covers 189 services across 33 departments.',
      eligibility: ['All new businesses & industries', 'Existing businesses seeking expansion', 'Any sector (except negative list)', 'Domestic & foreign investors'],
      benefits: ['189 services under one window', 'Guaranteed clearance in 21 days', 'Deemed approval if deadline missed', 'Online application & real-time tracking', 'Dedicated relationship manager', 'Auto-renewal for 3 years'],
      documents: ['Company Registration / MoA', 'Project Report (DPR)', 'Land ownership / lease documents', 'PAN & GST Certificate', 'Environmental clearance (if applicable)'],
      ministry: 'AP Industries & Commerce Dept.',
      applyLink: 'https://ipass.ap.gov.in/',
      officialLink: 'https://ipass.ap.gov.in/',
      status: 'Active',
      launched: 'Apr 2015',
    },
    {
      id: 'ap-2',
      type: 'state',
      name: 'AP MSME Development Policy 2023–28',
      category: 'MSME',
      badge: '🏭',
      description: 'Comprehensive 5-year policy framework providing capital subsidy, interest subsidy, power tariff concession, and GST reimbursement for Micro, Small & Medium Enterprises registered in Andhra Pradesh.',
      eligibility: ['MSME units with investment ≤ ₹250 crore', 'Registered & operational in AP', 'Udyam-registered enterprise', 'No wilful default on bank loans'],
      benefits: ['Capital subsidy 15%–25% (max ₹3 crore)', 'Interest subsidy 5%–6% p.a. (5 years)', 'Power tariff concession ₹1/unit for 5 years', 'SGST reimbursement for 5 years', 'Stamp duty & registration fee waiver', 'Employment generation incentive ₹1000/employee/month'],
      documents: ['Udyam Registration Certificate', 'GST Certificate', 'Bank statements (6 months)', 'Audited financials (2 years)', 'Project Report', 'Land / lease documents'],
      ministry: 'AP Industries & Commerce Dept.',
      applyLink: 'https://ipass.ap.gov.in/',
      officialLink: 'https://www.apindustries.gov.in/',
      status: 'Active',
      launched: 'Jan 2023',
    },
    {
      id: 'ap-3',
      type: 'state',
      name: 'Jagananna Thodu — Zero Interest Working Capital Loan',
      category: 'Finance',
      badge: '💰',
      description: 'AP government scheme providing zero-interest working capital loans of ₹10,000 to ₹1 lakh to small traders, street vendors, and micro-entrepreneurs to support livelihoods and business continuity.',
      eligibility: ['Small traders, hawkers, street vendors', 'Micro-entrepreneurs in AP', 'Annual turnover below ₹40 lakh', 'AP state resident (Aadhaar-linked)'],
      benefits: ['Loan ₹10,000 (1st cycle) to ₹1,00,000 (5th cycle)', 'Zero percent interest rate', 'No collateral or guarantor required', 'Subsidy on timely repayment', 'Linked with life & accidental insurance'],
      documents: ['Aadhaar Card', 'Ration Card / Voter ID', 'Bank passbook', 'Trade license (if held)', 'Passport-size photo'],
      ministry: 'AP BC Welfare & Education Dept.',
      applyLink: 'https://spandana.ap.gov.in/',
      officialLink: 'https://spandana.ap.gov.in/',
      status: 'Active',
      launched: 'Mar 2020',
    },
    {
      id: 'ap-4',
      type: 'state',
      name: 'StartupAP — State Startup Ecosystem',
      category: 'Startup',
      badge: '🚀',
      description: 'Official Andhra Pradesh startup platform offering seed funding, incubation, mentorship, and market access for technology-driven startups through T-Hub AP and partner incubators.',
      eligibility: ['Startups registered in AP', 'Company age ≤ 7 years', 'DPIIT-recognised or willing to register', 'Innovation-led product / service'],
      benefits: ['Seed fund up to ₹20 lakh', 'Free incubation space (12 months)', '200+ mentor network access', 'IP filing reimbursement (patents & trademarks)', 'Government pilot project opportunities', 'International exposure through MoUs'],
      documents: ['DPIIT Startup Certificate', 'Certificate of Incorporation', 'Business plan / pitch deck', 'Founders KYC (Aadhaar + PAN)', 'Bank account proof'],
      ministry: 'AP Innovation Society / IT Dept.',
      applyLink: 'https://www.startupap.com/',
      officialLink: 'https://www.startupap.com/',
      status: 'Active',
      launched: 'Sep 2021',
    },
    {
      id: 'ap-5',
      type: 'state',
      name: 'APIIC — Industrial Land & Infrastructure',
      category: 'Infrastructure',
      badge: '🏗️',
      description: 'AP Industrial Infrastructure Corporation provides land allotment, plug-and-play industrial sheds, and infrastructure support across 200+ industrial parks and estates in Andhra Pradesh.',
      eligibility: ['Manufacturing & processing units', 'Service industries', 'Any investment size', 'AP-registered companies'],
      benefits: ['Plot allotment in 200+ industrial parks', 'Plug-and-play factory sheds', 'Ready infrastructure (roads, power, water)', 'Concessional lease rates', 'Priority to MSME & women-led units', 'Flanking support for clearances'],
      documents: ['Company / firm registration', 'Project Report', 'PAN & GST Certificate', 'Bank sanction letter', 'Architecture / layout plan'],
      ministry: 'AP Industrial Infrastructure Corporation (APIIC)',
      applyLink: 'https://apiic.in/',
      officialLink: 'https://apiic.in/',
      status: 'Active',
      launched: 'Jan 1973',
    },
    {
      id: 'ap-6',
      type: 'state',
      name: 'AP NREDCAP — Renewable Energy & EV Incentives',
      category: 'Clean Energy',
      badge: '🌿',
      description: 'New & Renewable Energy Development Corporation of AP offers incentives for solar, wind, and EV ventures including land, grid connectivity, and capital subsidy for clean energy projects.',
      eligibility: ['Solar / wind / biomass power ventures', 'EV manufacturing & charging infra', 'Industries adopting 20%+ renewable energy', 'AP-registered companies'],
      benefits: ['Land allocation in solar parks at concessional rates', 'Additional 10% capital subsidy over MSME policy', 'Priority grid connectivity', 'Net metering approval support', 'Carbon credit facilitation', 'Rooftop solar subsidy for SMEs'],
      documents: ['Company Registration', 'Project Report with tech specs', 'Energy audit (for existing units)', 'Environmental clearance', 'Land documents / lease'],
      ministry: 'AP New & Renewable Energy Dev. Corporation (NREDCAP)',
      applyLink: 'https://www.nredcap.in/',
      officialLink: 'https://www.nredcap.in/',
      status: 'Active',
      launched: 'Jan 2000',
    },
    {
      id: 'ap-7',
      type: 'state',
      name: 'AP e-Pragati — Online Government Services',
      category: 'Digital',
      badge: '💻',
      description: 'Integrated digital platform with 800+ government services for businesses and citizens — registrations, renewals, certificates, licenses, and compliance filings all in one portal.',
      eligibility: ['All businesses and individuals in AP', 'Aadhaar-linked mobile number required'],
      benefits: ['800+ services online', 'Real-time application tracking', 'Secure digital document locker', 'Integrated online payment gateway', 'WhatsApp/SMS status notifications', 'Common service centre (CSC) access'],
      documents: ['Aadhaar Card', 'Mobile number linked to Aadhaar', 'Relevant supporting documents per service'],
      ministry: 'AP Technology Services Ltd. (APTS)',
      applyLink: 'https://epragati.ap.gov.in/',
      officialLink: 'https://epragati.ap.gov.in/',
      status: 'Active',
      launched: 'Jan 2017',
    },
    {
      id: 'ap-8',
      type: 'state',
      name: 'AP Food Processing Policy 2023',
      category: 'Food & Agri',
      badge: '🌾',
      description: 'Incentive policy for food processing industries covering primary, secondary, and tertiary processing with capital subsidy, cold chain infrastructure support, and backward-forward linkages.',
      eligibility: ['Food processing units in AP', 'Investment ≥ ₹10 lakh', 'Minimum 10 local employees', 'Any food category (dairy, horticulture, marine, etc.)'],
      benefits: ['Capital subsidy 25%–35% (max ₹2 crore)', 'Cold chain infrastructure support', 'QA & food safety certification reimbursement', 'Power tariff subsidy', 'Stamp duty waiver', 'Backward linkage incentive for farmer sourcing'],
      documents: ['FSSAI License', 'Udyam Certificate', 'GST Registration', 'Project Report', 'Land / factory documents'],
      ministry: 'AP Horticulture & Food Processing Dept.',
      applyLink: 'https://ipass.ap.gov.in/',
      officialLink: 'https://www.apindustries.gov.in/',
      status: 'Active',
      launched: 'Apr 2023',
    },
    {
      id: 'ap-9',
      type: 'state',
      name: 'YSR Cheyutha — Women Self-Help Group Support',
      category: 'Women',
      badge: '👩‍💼',
      description: 'Annual financial assistance of ₹18,750 to women in BC, SC, ST, and minority communities to support self-help group businesses, micro-entrepreneurship, and livelihood activities.',
      eligibility: ['Women in BC / SC / ST / Minority category', 'AP domicile', 'Age 45–60 years', 'Member of an active SHG'],
      benefits: ['₹18,750 annual financial support (4 years)', 'Linked with SHG bank credit', 'Skill training & capacity building', 'Market linkage through APMSS', 'Insurance cover'],
      documents: ['Aadhaar Card', 'Caste Certificate', 'Bank account details', 'SHG membership proof', 'Income Certificate'],
      ministry: 'AP Women Development & Child Welfare Dept.',
      applyLink: 'https://gsws.ap.gov.in/',
      officialLink: 'https://gsws.ap.gov.in/',
      status: 'Active',
      launched: 'Nov 2019',
    },
    // ── CENTRAL SCHEMES (applicable in AP) ────────────────────────────────────
    {
      id: 'ap-c1',
      type: 'central',
      name: 'PM MUDRA Yojana — Micro Enterprise Loans',
      category: 'Finance',
      badge: '🏦',
      description: 'Pradhan Mantri MUDRA Yojana provides collateral-free loans up to ₹20 lakh to non-corporate, non-farm small & micro enterprises through banks, MFIs, and NBFCs.',
      eligibility: ['Non-farm micro/small businesses', 'Individuals, proprietorships, partnerships', 'No requirement of collateral (up to ₹10 lakh)', 'Existing and new businesses'],
      benefits: ['Shishu: up to ₹50,000', 'Kishore: ₹50,001 – ₹5 lakh', 'Tarun: ₹5 lakh – ₹10 lakh', 'Tarun Plus: ₹10 lakh – ₹20 lakh', 'No processing fee (Shishu)', 'Mudra card for working capital'],
      documents: ['Aadhaar / PAN Card', 'Passport-size photo', 'Business address proof', 'Bank statements (6 months)', 'Quotations for machinery / equipment'],
      ministry: 'Ministry of Finance, Govt. of India',
      applyLink: 'https://www.mudra.org.in/',
      officialLink: 'https://www.mudra.org.in/',
      status: 'Active',
      launched: 'Apr 2015',
    },
    {
      id: 'ap-c2',
      type: 'central',
      name: 'PMEGP — Prime Minister Employment Generation Programme',
      category: 'Employment',
      badge: '💼',
      description: 'Credit-linked subsidy programme to generate employment by establishing micro enterprises in non-farm sector. Subsidy of 15%–35% on project cost up to ₹50 lakh (manufacturing) / ₹20 lakh (services).',
      eligibility: ['Individuals 18+ years', 'Educational qualification: 8th standard (projects above ₹10 lakh)', 'Existing units & PMRY beneficiaries not eligible', 'Only new projects'],
      benefits: ['Subsidy 15%–35% of project cost', 'Max project cost ₹50 lakh (manufacturing)', 'Max project cost ₹20 lakh (service)', 'Higher subsidy for women, SC/ST, minorities, ex-servicemen', 'EDP training support'],
      documents: ['Aadhaar Card', 'Educational certificates', 'Community / category certificate', 'Project Report', 'Bank account details'],
      ministry: 'KVIC, Ministry of MSME, Govt. of India',
      applyLink: 'https://www.kviconline.gov.in/pmegpwebportal/',
      officialLink: 'https://www.kviconline.gov.in/pmegpwebportal/',
      status: 'Active',
      launched: 'Aug 2008',
    },
    {
      id: 'ap-c3',
      type: 'central',
      name: 'Stand Up India — SC/ST & Women Entrepreneur Loans',
      category: 'Finance',
      badge: '🤝',
      description: 'Bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST borrower and one woman borrower per bank branch for setting up greenfield enterprises.',
      eligibility: ['SC/ST entrepreneurs', 'Women entrepreneurs', 'Greenfield enterprise (first time)', 'Age 18+ years'],
      benefits: ['Loan ₹10 lakh – ₹1 crore', 'Composite loan (term + working capital)', 'Repayment up to 7 years', 'Moratorium period up to 18 months', 'CGFSIL guarantee cover'],
      documents: ['Aadhaar & PAN', 'Caste certificate (SC/ST)', 'Business plan / project report', 'Bank account details', 'Quotations for assets'],
      ministry: 'Dept. of Financial Services, Govt. of India',
      applyLink: 'https://www.standupmitra.in/',
      officialLink: 'https://www.standupmitra.in/',
      status: 'Active',
      launched: 'Apr 2016',
    },
    {
      id: 'ap-c4',
      type: 'central',
      name: 'PM Vishwakarma — Artisan & Craftsman Support',
      category: 'Skill & Craft',
      badge: '🔨',
      description: 'Holistic support to traditional artisans and craftsmen covering skill upgradation, toolkit support, credit access up to ₹3 lakh, digital payment adoption, and market linkage.',
      eligibility: ['18 traditional trades (carpenter, blacksmith, potter, tailor, cobbler etc.)', 'Self-employed/household-based artisan', 'Not enrolled in similar central schemes', 'Age 18+ years'],
      benefits: ['Recognition as PM Vishwakarma (certificate + ID)', 'Skill training with ₹500/day stipend', 'Toolkit grant up to ₹15,000', 'Collateral-free credit: ₹1 lakh (1st) + ₹2 lakh (2nd tranche) at 5% interest', 'Digital transaction incentive', 'Market linkage support'],
      documents: ['Aadhaar Card', 'Mobile number linked to Aadhaar', 'Bank account', 'Ration card (optional)', 'Self-declaration of trade'],
      ministry: 'Ministry of MSME, Govt. of India',
      applyLink: 'https://pmvishwakarma.gov.in/',
      officialLink: 'https://pmvishwakarma.gov.in/',
      status: 'Active',
      launched: 'Sep 2023',
    },
    {
      id: 'ap-c5',
      type: 'central',
      name: 'Startup India — DPIIT Recognition & Benefits',
      category: 'Startup',
      badge: '🚀',
      description: 'Government of India\'s flagship startup initiative offering DPIIT recognition, tax exemptions, self-certification for 9 labour laws, faster IP registration, and access to ₹10,000 crore Fund of Funds.',
      eligibility: ['Incorporated as Pvt Ltd / LLP / Partnership', 'Turnover < ₹100 crore', 'Age ≤ 10 years from incorporation', 'Working on innovation / scalable model'],
      benefits: ['3-year income tax exemption (Section 80-IAC)', 'Exemption from angel tax (Section 56)', '80% rebate on patent filing fees', 'Self-certification for 9 labour & 3 environment laws', 'Fast-track patent examination', 'Access to ₹10,000 Cr Fund of Funds'],
      documents: ['Certificate of Incorporation', 'Proof of concept / innovation', 'Founder / Director details', 'PAN of company', 'Brief description of business'],
      ministry: 'DPIIT, Ministry of Commerce, Govt. of India',
      applyLink: 'https://www.startupindia.gov.in/',
      officialLink: 'https://www.startupindia.gov.in/',
      status: 'Active',
      launched: 'Jan 2016',
    },
    {
      id: 'ap-c6',
      type: 'central',
      name: 'Udyam Registration — MSME Certificate',
      category: 'Registration',
      badge: '📋',
      description: 'Free, paperless, self-declaration-based online registration for MSMEs on Udyam portal. Udyam Certificate unlocks all central & state MSME benefits, subsidies, and priority lending.',
      eligibility: ['Micro: investment ≤ ₹1 crore & turnover ≤ ₹5 crore', 'Small: investment ≤ ₹10 crore & turnover ≤ ₹50 crore', 'Medium: investment ≤ ₹50 crore & turnover ≤ ₹250 crore', 'All sectors including services'],
      benefits: ['Free online registration — no fees', 'Unlocks 50+ central MSME schemes', 'Priority sector lending eligibility', 'Government procurement preference', 'CGTMSE collateral-free loan access', 'Protection under MSME Act (delayed payment)'],
      documents: ['Aadhaar of proprietor / director', 'PAN (auto-verified)', 'GSTIN (if applicable)', 'Bank account number & IFSC'],
      ministry: 'Ministry of MSME, Govt. of India',
      applyLink: 'https://udyamregistration.gov.in/',
      officialLink: 'https://udyamregistration.gov.in/',
      status: 'Active',
      launched: 'Jul 2020',
    },
    {
      id: 'ap-c7',
      type: 'central',
      name: 'CGTMSE — Credit Guarantee for MSMEs',
      category: 'Finance',
      badge: '🛡️',
      description: 'Credit Guarantee Fund Trust for Micro & Small Enterprises covers collateral-free loans up to ₹5 crore extended by member lending institutions to MSMEs.',
      eligibility: ['Micro & Small Enterprises (Udyam registered)', 'New & existing businesses', 'Both manufacturing & service sectors', 'Loan from CGTMSE member bank / NBFC'],
      benefits: ['Collateral-free loans up to ₹5 crore', 'Guarantee cover 75%–85% of loan', 'Competitive interest rates (no premium to borrower)', 'Covers term loans & working capital', 'Available across 130+ member banks & institutions'],
      documents: ['Udyam Registration Certificate', 'Loan application to member bank', 'Project Report', 'Financial statements', 'KYC documents'],
      ministry: 'Ministry of MSME & SIDBI, Govt. of India',
      applyLink: 'https://www.cgtmse.in/',
      officialLink: 'https://www.cgtmse.in/',
      status: 'Active',
      launched: 'Aug 2000',
    },
    {
      id: 'ap-c8',
      type: 'central',
      name: 'GeM — Government e-Marketplace Seller',
      category: 'Market Access',
      badge: '🛒',
      description: 'Register as a seller on Government e-Marketplace to directly sell goods and services to central & state government departments, PSUs, and autonomous bodies without tender hassle.',
      eligibility: ['Any business entity (sole prop / Pvt Ltd / LLP)', 'Udyam / GST registered', 'Product/service offered to government', 'Pan India, no state restriction'],
      benefits: ['Direct access to ₹4 lakh+ crore government procurement', 'No tender participation fee', 'Timely payment guarantee (10 days)', 'MSME seller preference policy', 'Digital onboarding in < 30 minutes', 'Rating-based trust system'],
      documents: ['Aadhaar / PAN', 'GSTIN', 'Bank account details', 'Business registration', 'Product catalogue / service details'],
      ministry: 'Ministry of Commerce, Govt. of India',
      applyLink: 'https://gem.gov.in/',
      officialLink: 'https://gem.gov.in/',
      status: 'Active',
      launched: 'Aug 2016',
    },
  ],

  TN: [
    // ── STATE SCHEMES ──────────────────────────────────────────────────────────
    {
      id: 'tn-1',
      type: 'state',
      name: 'NEEDS — New Entrepreneur Enterprise Development Scheme',
      category: 'Startup',
      badge: '🚀',
      description: 'Tamil Nadu\'s flagship scheme providing 25% capital subsidy and soft loans to first-generation entrepreneurs from economically weaker sections to set up new enterprises.',
      eligibility: ['First-generation entrepreneur', 'Age 18–35 years (40 for ex-servicemen)', 'TN resident', 'Project cost ₹5 lakh – ₹5 crore', 'Educational qualification 10th standard minimum'],
      benefits: ['25% capital subsidy (max ₹75 lakh)', 'Soft loan at 3% p.a. interest', 'Free 6-month EDP training programme', 'Mentoring from 500+ industry experts', 'Priority in government procurement (Micro units)', 'Market linkage & trade fair participation'],
      documents: ['Educational Certificates', 'Aadhaar Card', 'Nativity / Domicile Certificate', 'Detailed Project Report', 'Bank No-Dues Certificate', 'Land / premises documents'],
      ministry: 'TN Industries Dept. / DIC',
      applyLink: 'https://www.msmeonline.tn.gov.in/',
      officialLink: 'https://www.msmeonline.tn.gov.in/',
      status: 'Active',
      launched: 'Jun 2012',
    },
    {
      id: 'tn-2',
      type: 'state',
      name: 'CMEGP — Chief Minister Employment Generation Programme',
      category: 'Employment',
      badge: '💼',
      description: 'State scheme generating employment through setting up new micro enterprises, providing 25%–35% margin money subsidy to unemployed youth and women entrepreneurs in Tamil Nadu.',
      eligibility: ['Age 18–55 years', 'TN resident (3+ years)', 'Not a bank defaulter', 'First-time entrepreneur', 'Below ₹40 lakh family income (self-employment category)'],
      benefits: ['Subsidy 25%–35% on project cost (max ₹25 lakh manufacturing)', 'Bank loan for remaining 65%–75%', 'Higher subsidy for women / SC/ST', 'EDP training (7-day free programme)', 'Easy repayment terms (up to 5 years)'],
      documents: ['Aadhaar Card', 'Community Certificate (if applicable)', 'Educational qualification proof', 'Detailed Project Report', 'Bank account & no-dues certificate'],
      ministry: 'TN Khadi & Village Industries Board (TNKVIB)',
      applyLink: 'https://www.tnkvib.com/',
      officialLink: 'https://www.tnkvib.com/',
      status: 'Active',
      launched: 'Apr 2019',
    },
    {
      id: 'tn-3',
      type: 'state',
      name: 'TANSIM — Tamil Nadu Startup & Innovation Mission',
      category: 'Startup',
      badge: '💡',
      description: 'Tamil Nadu\'s official startup mission offering grants, incubation, sector challenges, and market access for technology, deep-tech, and social innovation startups under the TN Startup Policy 2023.',
      eligibility: ['DPIIT-recognised startups', 'Incorporated & operational in TN', 'Technology or innovation focus', 'Turnover below ₹100 crore', 'Age of entity ≤ 10 years'],
      benefits: ['Seed grant up to ₹30 lakh (challenge grant)', 'Incubation in 14 TN state incubators', 'Patent filing reimbursement up to ₹2 lakh', 'Government pilot project access', 'International soft landing (Singapore, UK)', 'Investor connect & demo day platform'],
      documents: ['DPIIT Certificate', 'Certificate of Incorporation', 'Pitch deck / product demo', 'Founders KYC', 'Bank account proof'],
      ministry: 'TN Startup & Innovation Mission (TANSIM)',
      applyLink: 'https://tansim.in/',
      officialLink: 'https://tansim.in/',
      status: 'Active',
      launched: 'Jan 2023',
    },
    {
      id: 'tn-4',
      type: 'state',
      name: 'TAHDCO — SC/ST Entrepreneur Finance & Support',
      category: 'Social',
      badge: '🤝',
      description: 'Tamil Nadu Adi Dravidar Housing & Development Corporation offers targeted loans, subsidies, and training for SC/ST entrepreneurs to start businesses in manufacturing, trade, and services.',
      eligibility: ['SC/ST community entrepreneurs', 'TN domicile certificate', 'Age 18–50 years', 'Enterprise not more than 5 years old', 'Income below ₹3 lakh/year'],
      benefits: ['Subsidy 25%–50% of project cost', 'Concessional loans at 4% interest', 'Free skill development training (3 months)', 'Reserved stalls in exhibitions & fairs', 'Legal & documentation support', 'Market linkage through TAHDCO network'],
      documents: ['Caste Certificate (SC/ST)', 'Aadhaar Card', 'Income Certificate', 'Detailed Project Report', 'Land / shop / premises proof'],
      ministry: 'Tamil Nadu Adi Dravidar Housing & Dev. Corporation (TAHDCO)',
      applyLink: 'https://www.tahdco.com/',
      officialLink: 'https://www.tahdco.com/',
      status: 'Active',
      launched: 'Mar 1974',
    },
    {
      id: 'tn-5',
      type: 'state',
      name: 'TNSIC — Small Industries Corporation Loans',
      category: 'Finance',
      badge: '💰',
      description: 'Tamil Nadu Small Industries Corporation provides term loans, working capital, and hire-purchase financing for micro and small enterprises at competitive interest rates.',
      eligibility: ['Micro & Small Enterprises (Udyam registered)', 'TN-registered business', 'Operational for at least 1 year', 'No NPA classification with any bank'],
      benefits: ['Term loans up to ₹25 lakh at 9%–11% p.a.', 'Working capital up to ₹15 lakh', 'Hire-purchase for machinery (up to ₹10 lakh)', 'No processing fee for first-time borrowers', 'Moratorium of 6 months on repayment', 'MSME preference for women & SC/ST units'],
      documents: ['Udyam Registration Certificate', 'GST Registration', 'IT Returns (2 years)', 'Audited financials', 'Bank statements (12 months)', 'Quotations for machinery'],
      ministry: 'Tamil Nadu Small Industries Corporation (TNSIC)',
      applyLink: 'https://www.tnsic.in/',
      officialLink: 'https://www.tnsic.in/',
      status: 'Active',
      launched: 'Jan 1965',
    },
    {
      id: 'tn-6',
      type: 'state',
      name: 'TIDCO — Industrial Investment Facilitation',
      category: 'Investment',
      badge: '🏭',
      description: 'Tamil Nadu Industrial Development Corporation facilitates large industrial investments, joint ventures, and sector-specific projects with equity participation, land allotment, and clearance support.',
      eligibility: ['Large & medium industries', 'Investment ≥ ₹5 crore', 'TN-registered entity', 'Employment-generating projects'],
      benefits: ['Equity participation by TIDCO (joint ventures)', 'Industrial land allotment at TIDCO parks', 'Single-window clearance support', 'Liaison with state departments', 'Priority sector financing access', 'Export promotion support'],
      documents: ['Memorandum of Understanding with TIDCO', 'Project Report (DPR)', 'Company incorporation documents', 'Environmental Impact Assessment', 'Financial projections'],
      ministry: 'Tamil Nadu Industrial Dev. Corporation (TIDCO)',
      applyLink: 'https://www.tidco.com/',
      officialLink: 'https://www.tidco.com/',
      status: 'Active',
      launched: 'Jan 1965',
    },
    {
      id: 'tn-7',
      type: 'state',
      name: 'SIPCOT — Industrial Parks & Special Zones',
      category: 'Infrastructure',
      badge: '🏗️',
      description: 'State Industries Promotion Corporation of Tamil Nadu develops and manages 40+ industrial parks, SEZs, and growth corridors across TN with allotment of plots, sheds, and service facilities.',
      eligibility: ['Manufacturing industries', 'IT/ITES companies', 'Logistics & warehousing', 'Any investment size'],
      benefits: ['Plot allotment in 40+ industrial estates', 'Developed infrastructure (roads, power, water)', 'Concessional plot rates for MSME & anchor units', 'Export-oriented unit (EOU) facilities', 'Online allotment process', 'Cluster-specific parks (auto, textile, pharma)'],
      documents: ['Company / firm registration', 'Project Report', 'Promoter KYC', 'Bank sanction letter', 'Architectural layout plan'],
      ministry: 'State Industries Promotion Corporation of TN (SIPCOT)',
      applyLink: 'https://www.sipcot.com/',
      officialLink: 'https://www.sipcot.com/',
      status: 'Active',
      launched: 'Jun 1971',
    },
    {
      id: 'tn-8',
      type: 'state',
      name: 'InvestTN — Make in Tamil Nadu Incentives',
      category: 'Investment',
      badge: '📊',
      description: 'Invest Tamil Nadu is the official investment promotion body offering Make in TN incentives including capital subsidy, employment incentive, and sector-specific policies for global and domestic investors.',
      eligibility: ['All manufacturing sectors', 'IT, Healthcare, Logistics', 'Investment ≥ ₹25 lakh', 'Generates minimum 5 local jobs'],
      benefits: ['Capital subsidy 15%–25% (zone-based)', 'Employment cost reimbursement ₹3000/employee/month', 'Stamp duty exemption', 'SGST reimbursement (5 years)', 'Single application for all clearances (TNSWP)', 'Global investor meet facilitation'],
      documents: ['Business Registration', 'Project Report', 'Employment plan', 'Land / premises documents', 'Financial projections'],
      ministry: 'Guidance Tamil Nadu (InvestTN)',
      applyLink: 'https://www.investtn.in/',
      officialLink: 'https://www.investtn.in/',
      status: 'Active',
      launched: 'Jan 2021',
    },
    {
      id: 'tn-9',
      type: 'state',
      name: 'Naan Mudhalvan — Free Skill Training Programme',
      category: 'Skills',
      badge: '🎓',
      description: 'TN government flagship scheme for industry-aligned skill development, offering free training in 100+ job roles for students, job-seekers, and entrepreneurs with placement support.',
      eligibility: ['TN students and youth (18–35 years)', 'Entrepreneurs and their employees', 'No minimum qualification barrier for most courses', 'Aadhaar registered'],
      benefits: ['100+ industry-aligned free courses', 'Certificate from industry partners (TCS, Infosys, etc.)', 'Monthly stipend during training', 'Job placement support', 'Entrepreneurship development modules', 'Online + offline mode'],
      documents: ['Aadhaar Card', 'Educational qualification proof', 'Passport-size photo', 'Bank account (for stipend)'],
      ministry: 'TN Skill Development Corporation',
      applyLink: 'https://naanmudhalvan.tn.gov.in/',
      officialLink: 'https://naanmudhalvan.tn.gov.in/',
      status: 'Active',
      launched: 'Sep 2022',
    },
    {
      id: 'tn-10',
      type: 'state',
      name: 'TN Women Development Corporation — Entrepreneur Loans',
      category: 'Women',
      badge: '👩‍💼',
      description: 'Financial assistance, skill training, and market linkage exclusively for women entrepreneurs in Tamil Nadu through TNCWDC schemes including Magalir Udaviniyakar.',
      eligibility: ['Women entrepreneurs in TN (51%+ ownership)', 'TN resident', 'Age 18–55 years', 'Any sector including handicrafts, food, services'],
      benefits: ['Loan up to ₹3 lakh at concessional rates', 'Additional 5% capital subsidy over general schemes', '5% reservation in MSME procurement', 'Free EDP training (45-day programme)', 'Market linkage through exhibitions & buyer-seller meets', 'Legal & registration support'],
      documents: ['Aadhaar Card', 'Nativity / domicile certificate', 'Business registration', 'Bank statements', 'Proof of women ownership'],
      ministry: 'Tamil Nadu Corporation for Development of Women (TNCWDC)',
      applyLink: 'https://www.tamilnaduwomen.org/',
      officialLink: 'https://www.tamilnaduwomen.org/',
      status: 'Active',
      launched: 'Jun 1983',
    },
    // ── CENTRAL SCHEMES (applicable in TN) ────────────────────────────────────
    {
      id: 'tn-c1',
      type: 'central',
      name: 'PM MUDRA Yojana — Micro Enterprise Loans',
      category: 'Finance',
      badge: '🏦',
      description: 'Collateral-free loans up to ₹20 lakh to non-corporate micro/small enterprises through banks, MFIs, and NBFCs under Shishu, Kishore, Tarun, and Tarun Plus categories.',
      eligibility: ['Non-farm micro/small businesses', 'Individuals, sole props, partnerships', 'No collateral required (up to ₹10 lakh)', 'Existing and new businesses'],
      benefits: ['Shishu: up to ₹50,000', 'Kishore: ₹50,001–₹5 lakh', 'Tarun: ₹5 lakh–₹10 lakh', 'Tarun Plus: ₹10 lakh–₹20 lakh', 'No processing fee (Shishu)', 'Mudra RuPay card for working capital drawdown'],
      documents: ['Aadhaar / PAN Card', 'Passport-size photo', 'Business address proof', 'Bank statements (6 months)', 'Quotations for purchase'],
      ministry: 'Ministry of Finance, Govt. of India',
      applyLink: 'https://www.mudra.org.in/',
      officialLink: 'https://www.mudra.org.in/',
      status: 'Active',
      launched: 'Apr 2015',
    },
    {
      id: 'tn-c2',
      type: 'central',
      name: 'PMEGP — Prime Minister Employment Generation Programme',
      category: 'Employment',
      badge: '💼',
      description: 'Credit-linked subsidy programme for new micro enterprises in non-farm sector. Subsidy 15%–35% on project cost with max ₹50 lakh (manufacturing) / ₹20 lakh (services).',
      eligibility: ['Individuals 18+ years', '8th standard qualification for projects above ₹10 lakh', 'Only new projects (no existing units)', 'Not a previous PMRY / REGP beneficiary'],
      benefits: ['Subsidy 15%–35% (higher for women & SC/ST)', 'Max project ₹50 lakh (manufacturing)', 'Max project ₹20 lakh (service sector)', 'EDP training (free, 2 weeks)', 'Bank loan for balance amount'],
      documents: ['Aadhaar Card', 'Educational certificates', 'Community / category certificate', 'Project Report', 'Bank account details'],
      ministry: 'KVIC, Ministry of MSME, Govt. of India',
      applyLink: 'https://www.kviconline.gov.in/pmegpwebportal/',
      officialLink: 'https://www.kviconline.gov.in/pmegpwebportal/',
      status: 'Active',
      launched: 'Aug 2008',
    },
    {
      id: 'tn-c3',
      type: 'central',
      name: 'Stand Up India — SC/ST & Women Loans',
      category: 'Finance',
      badge: '🤝',
      description: 'Bank loans ₹10 lakh–₹1 crore per bank branch for at least one SC/ST and one woman entrepreneur for greenfield enterprises.',
      eligibility: ['SC/ST borrowers', 'Women borrowers', 'Greenfield enterprise only', 'Age 18+ years'],
      benefits: ['Loan ₹10 lakh–₹1 crore', 'Composite loan (term + working capital)', 'Repayment up to 7 years', 'CGFSIL guarantee cover', 'Moratorium up to 18 months'],
      documents: ['Aadhaar & PAN', 'Caste certificate (SC/ST)', 'Business plan', 'Bank account details', 'Asset quotations'],
      ministry: 'Dept. of Financial Services, Govt. of India',
      applyLink: 'https://www.standupmitra.in/',
      officialLink: 'https://www.standupmitra.in/',
      status: 'Active',
      launched: 'Apr 2016',
    },
    {
      id: 'tn-c4',
      type: 'central',
      name: 'PM Vishwakarma — Artisan & Craftsman Support',
      category: 'Skill & Craft',
      badge: '🔨',
      description: 'Recognition, skill training with stipend, toolkit support up to ₹15,000, and credit up to ₹3 lakh at 5% for 18 traditional artisan trades.',
      eligibility: ['18 traditional trades (weaver, carpenter, goldsmith, potter, tailor etc.)', 'Self-employed artisan or craftsman', 'Age 18+ years', 'Not enrolled in similar central govt. scheme'],
      benefits: ['PM Vishwakarma certificate & ID', 'Skill training + ₹500/day stipend', 'Toolkit support ₹15,000', 'Loan ₹1 lakh (1st) + ₹2 lakh (2nd) at 5%', 'Digital transaction incentive', 'Market linkage'],
      documents: ['Aadhaar Card', 'Mobile linked to Aadhaar', 'Bank account', 'Self-declaration of trade'],
      ministry: 'Ministry of MSME, Govt. of India',
      applyLink: 'https://pmvishwakarma.gov.in/',
      officialLink: 'https://pmvishwakarma.gov.in/',
      status: 'Active',
      launched: 'Sep 2023',
    },
    {
      id: 'tn-c5',
      type: 'central',
      name: 'Startup India — DPIIT Recognition & Tax Benefits',
      category: 'Startup',
      badge: '🚀',
      description: 'DPIIT recognition for eligible startups unlocking income tax exemption, angel tax relief, fast IP filing, self-certification for labour laws, and Fund of Funds access.',
      eligibility: ['Incorporated as Pvt Ltd / LLP / Partnership', 'Turnover < ₹100 crore', 'Age ≤ 10 years', 'Innovation-led & scalable model'],
      benefits: ['3-year income tax holiday (Sec 80-IAC)', 'Angel tax exemption (Sec 56)', '80% rebate on patent fees', 'Self-certification for 9 labour laws', 'Fast-track patent examination', 'Fund of Funds access (₹10,000 Cr)'],
      documents: ['Certificate of Incorporation', 'Business description', 'Founder / Director KYC', 'Company PAN'],
      ministry: 'DPIIT, Ministry of Commerce, Govt. of India',
      applyLink: 'https://www.startupindia.gov.in/',
      officialLink: 'https://www.startupindia.gov.in/',
      status: 'Active',
      launched: 'Jan 2016',
    },
    {
      id: 'tn-c6',
      type: 'central',
      name: 'Udyam Registration — MSME Portal',
      category: 'Registration',
      badge: '📋',
      description: 'Free, paperless, self-declaration MSME registration via Udyam portal. Mandatory for availing all central and state MSME schemes, subsidies, and priority lending benefits.',
      eligibility: ['Micro: investment ≤ ₹1 Cr & turnover ≤ ₹5 Cr', 'Small: investment ≤ ₹10 Cr & turnover ≤ ₹50 Cr', 'Medium: investment ≤ ₹50 Cr & turnover ≤ ₹250 Cr', 'Manufacturing & service sectors'],
      benefits: ['100% free registration', 'Unlocks 50+ central MSME schemes', 'Priority sector lending', 'Preference in government procurement', 'MSME Act protection (payment within 45 days)', 'Subsidy & grant eligibility'],
      documents: ['Aadhaar of proprietor / director', 'PAN (auto-verified from IT Dept.)', 'GSTIN (optional for micro)', 'Bank account & IFSC'],
      ministry: 'Ministry of MSME, Govt. of India',
      applyLink: 'https://udyamregistration.gov.in/',
      officialLink: 'https://udyamregistration.gov.in/',
      status: 'Active',
      launched: 'Jul 2020',
    },
    {
      id: 'tn-c7',
      type: 'central',
      name: 'GeM — Government e-Marketplace Seller',
      category: 'Market Access',
      badge: '🛒',
      description: 'Sell goods and services directly to 60,000+ government buyers on GeM portal — no physical tenders, online bidding, and timely payment within 10 working days.',
      eligibility: ['Any registered business entity', 'GST + Udyam / company registration', 'Product or service offered to govt', 'Pan India'],
      benefits: ['Access to ₹4 lakh+ crore annual govt procurement', 'No tender fee', 'Timely payment guarantee (10 days)', 'MSME priority procurement policy', 'Digital onboarding in < 30 min', 'Transparent reverse-auction pricing'],
      documents: ['Aadhaar / PAN', 'GSTIN', 'Bank account', 'Business registration', 'Product details & catalogue'],
      ministry: 'Ministry of Commerce, Govt. of India',
      applyLink: 'https://gem.gov.in/',
      officialLink: 'https://gem.gov.in/',
      status: 'Active',
      launched: 'Aug 2016',
    },
  ],

  TS: [
    // ── STATE SCHEMES ──────────────────────────────────────────────────────────
    {
      id: 'ts-1',
      type: 'state',
      name: 'T-Hub — Startup Incubation & Acceleration',
      category: 'Startup',
      badge: '🚀',
      description: 'Asia\'s largest startup incubator and innovation campus offering co-working, mentorship, corporate partnerships, and investor access for tech and deep-tech startups across all stages.',
      eligibility: ['Registered startups (any sector)', 'Technology-driven model', 'Telangana-based or willing to register in TS', 'Entity age ≤ 7 years'],
      benefits: ['12 months co-working space at HICC campus', '300+ global mentors & industry experts', 'Direct investor access & demo days', 'Corporate pilot & PoC opportunities', 'International market exposure (US, Israel, Japan)', 'Government contract facilitation'],
      documents: ['DPIIT Startup Certificate', 'Certificate of Incorporation', 'Pitch deck & product demo', 'Founders KYC (Aadhaar + PAN)', 'Bank account proof'],
      ministry: 'T-Hub Foundation, Govt. of Telangana',
      applyLink: 'https://t-hub.co/',
      officialLink: 'https://t-hub.co/',
      status: 'Active',
      launched: 'Nov 2015',
    },
    {
      id: 'ts-2',
      type: 'state',
      name: 'TS-iPASS — Telangana Single Window Approval',
      category: 'Approvals',
      badge: '✅',
      description: 'Telangana Industrial Project Approval & Self-Certification System provides all business approvals within 15 days with deemed approval clause — ranked #1 in India for ease of doing business.',
      eligibility: ['All new industrial & service units', 'Expansion of existing units', 'Any investment size', 'Domestic & foreign companies'],
      benefits: ['All approvals guaranteed in 15 days', 'Deemed approval if deadline breached', 'Online tracking of applications', 'Single relationship manager', 'Post-investment monitoring support', 'Self-certification for 9 compliances'],
      documents: ['Company Registration / MoA', 'Project Report (DPR)', 'Land ownership / lease documents', 'PAN & GST Certificate', 'Environmental clearance (if required)'],
      ministry: 'Telangana Industries & Commerce Dept.',
      applyLink: 'https://ipass.telangana.gov.in/',
      officialLink: 'https://ipass.telangana.gov.in/',
      status: 'Active',
      launched: 'Jan 2015',
    },
    {
      id: 'ts-3',
      type: 'state',
      name: 'WE-Hub — Women Entrepreneurs Hub',
      category: 'Women',
      badge: '👩‍💼',
      description: 'India\'s first state-led incubator exclusively for women entrepreneurs offering seed funding, free incubation, 100+ women-focused mentors, and government procurement access.',
      eligibility: ['Women-led startups (51%+ women ownership)', 'Pre-revenue to growth stage', 'Telangana-based or willing to register in TS', 'Any sector — tech, non-tech, social'],
      benefits: ['Seed funding up to ₹25 lakh', 'Free incubation space (6–12 months)', '100+ women-focused mentors', 'Government procurement support', 'Export facilitation & market access', 'Legal & IP support'],
      documents: ['Aadhaar Card', 'Certificate of Incorporation', 'Pitch deck / business plan', 'Founders KYC', 'Bank account proof'],
      ministry: 'WE-Hub Foundation, Govt. of Telangana',
      applyLink: 'https://wehub.telangana.gov.in/',
      officialLink: 'https://wehub.telangana.gov.in/',
      status: 'Active',
      launched: 'Mar 2018',
    },
    {
      id: 'ts-4',
      type: 'state',
      name: 'T-Works — Hardware & Deep Tech Startup Hub',
      category: 'Hardware',
      badge: '⚙️',
      description: 'India\'s largest prototyping facility for hardware, IoT, robotics, and deep-tech startups — offering state-of-the-art manufacturing equipment, design labs, and expert engineering support.',
      eligibility: ['Hardware / IoT / robotics startups', 'Deep-tech ventures', 'Students & researchers with prototypes', 'MSME manufacturing units'],
      benefits: ['Access to ₹100 crore worth of hi-tech equipment', 'Free access for startups (first 3 months)', 'In-house expert engineers', 'Testing & certification labs', 'Scale-up to manufacturing support', 'IP protection guidance'],
      documents: ['Company Registration / Student ID', 'Project Brief & prototype plan', 'Founders / team KYC', 'Technology description'],
      ministry: 'T-Works, Govt. of Telangana',
      applyLink: 'https://t-works.io/',
      officialLink: 'https://t-works.io/',
      status: 'Active',
      launched: 'Dec 2019',
    },
    {
      id: 'ts-5',
      type: 'state',
      name: 'TASK — Free Skill Development for Entrepreneurs',
      category: 'Skills',
      badge: '🎓',
      description: 'Telangana Academy for Skill & Knowledge offers free and subsidised industry-aligned training in IT, manufacturing, healthcare, BFSI, and emerging technologies for entrepreneurs and their workforce.',
      eligibility: ['Entrepreneurs and employees in TS', 'Age 18–45 years', 'Minimum 10th standard', 'Aadhaar-registered'],
      benefits: ['50+ industry-aligned free courses', 'Industry certification from TCS, Wipro, Microsoft', 'Paid internship placement', 'Entrepreneurship Development Programme (EDP)', 'Stipend during training period', 'NSQF-aligned curriculum'],
      documents: ['Aadhaar Card', 'Educational qualification proof', 'Passport-size photo', 'Bank account (for stipend)'],
      ministry: 'Telangana Academy for Skill & Knowledge (TASK)',
      applyLink: 'https://task.telangana.gov.in/',
      officialLink: 'https://task.telangana.gov.in/',
      status: 'Active',
      launched: 'Apr 2014',
    },
    {
      id: 'ts-6',
      type: 'state',
      name: 'Invest Telangana — Industrial Incentives 2020–25',
      category: 'Investment',
      badge: '📊',
      description: 'Official investment facilitation portal offering zone-based capital subsidies, employment incentives, power cost reimbursement, and sector-specific packages for industries setting up in Telangana.',
      eligibility: ['All manufacturing & service industries', 'Investment ₹25 lakh and above', 'Generates minimum 10 direct local jobs', 'TS-registered company'],
      benefits: ['Capital subsidy 15%–25% (zone A/B/C)', 'Employment incentive ₹2,000/employee/month (5 years)', 'Power cost reimbursement ₹1–₹2/unit (5 years)', 'SGST reimbursement (5 years)', 'Stamp duty & land registration waiver', 'Sector-specific packages (IT, Pharma, Textiles)'],
      documents: ['Company registration', 'Project Report (DPR)', 'Land / lease documents', 'Factory license', 'Employment records'],
      ministry: 'Telangana Industries & Commerce Dept.',
      applyLink: 'https://invest.telangana.gov.in/',
      officialLink: 'https://invest.telangana.gov.in/',
      status: 'Active',
      launched: 'May 2020',
    },
    {
      id: 'ts-7',
      type: 'state',
      name: 'TSFC — State Financial Corporation Loans',
      category: 'Finance',
      badge: '💰',
      description: 'Telangana State Financial Corporation provides term loans and working capital finance to MSMEs and first-generation entrepreneurs at competitive rates with flexible collateral norms.',
      eligibility: ['MSME units in Telangana', 'Udyam registered', 'No NPA with any bank', 'Telangana-based or relocating to TS'],
      benefits: ['Term loans up to ₹2 crore at 10.5%–12%', 'Working capital up to ₹50 lakh', 'Collateral-free up to ₹10 lakh (CGTMSE cover)', 'Moratorium period 6–12 months', 'Women / SC/ST entrepreneur preference', 'Online application via TS-iPASS'],
      documents: ['Udyam Certificate', 'GST Certificate', 'IT Returns (2 years)', 'Bank Statements (12 months)', 'Project Report & machinery quotations'],
      ministry: 'Telangana State Financial Corporation (TSFC)',
      applyLink: 'https://tsfc.telangana.gov.in/',
      officialLink: 'https://tsfc.telangana.gov.in/',
      status: 'Active',
      launched: 'Jan 1956',
    },
    {
      id: 'ts-8',
      type: 'state',
      name: 'TGIIC — Industrial Parks & Infrastructure',
      category: 'Infrastructure',
      badge: '🏗️',
      description: 'Telangana Government Infrastructure & Investment Corporation develops industrial parks, logistics parks, and special zones with plug-and-play infrastructure across Telangana.',
      eligibility: ['Manufacturing & processing units', 'Logistics & warehousing', 'IT parks & data centres', 'Any investment size'],
      benefits: ['Land allotment in 54+ industrial parks', 'Plug-and-play sheds (ready factories)', 'Developed roads, power, water & sewage', 'ETP (Effluent Treatment) at cluster level', 'Priority plot allotment for MSME', 'Flanking support for all clearances'],
      documents: ['Company Registration', 'Project Report', 'Promoter KYC', 'Architectural layout plan', 'Bank sanction letter'],
      ministry: 'Telangana Govt. Infrastructure & Investment Corp. (TGIIC)',
      applyLink: 'https://www.tgiic.telangana.gov.in/',
      officialLink: 'https://www.tgiic.telangana.gov.in/',
      status: 'Active',
      launched: 'Jan 1994',
    },
    {
      id: 'ts-9',
      type: 'state',
      name: 'Dharani — Land Records & Mutation Portal',
      category: 'Land & Property',
      badge: '🗺️',
      description: 'Telangana\'s integrated land records management portal for registration, mutation, property tax, and encumbrance certificate — essential for property-based business documentation.',
      eligibility: ['All property owners & buyers in Telangana', 'Businesses acquiring land or property', 'Farmers & agricultural land holders'],
      benefits: ['Online land registration & mutation', 'Encumbrance certificate in minutes', 'Property valuation certificate', 'Title deed verification', 'Slot booking for sub-registrar office', 'Integrated with banks for loan purposes'],
      documents: ['Aadhaar Card of buyer & seller', 'Property documents / title deed', 'Existing patta / 1B document', 'NOC from bank (if mortgaged)'],
      ministry: 'Revenue Dept., Govt. of Telangana',
      applyLink: 'https://dharani.telangana.gov.in/',
      officialLink: 'https://dharani.telangana.gov.in/',
      status: 'Active',
      launched: 'Oct 2020',
    },
    {
      id: 'ts-10',
      type: 'state',
      name: 'Hyderabad Pharma City — Pharma & Biotech Cluster',
      category: 'Pharma',
      badge: '💊',
      description: 'World\'s largest integrated pharmaceutical city spanning 19,333 acres, offering plug-and-play manufacturing facilities, shared ETP, regulatory support, and export facilitation for pharma companies.',
      eligibility: ['Bulk drug & API manufacturers', 'Formulation manufacturing companies', 'Biotech & medical device companies', 'R&D / CRO organizations'],
      benefits: ['Plug-and-play factory spaces (1–50 acres)', 'Shared common effluent treatment plant', 'Dedicated pharma export zone', 'Fast regulatory approvals via TS-iPASS', 'Logistics & cold chain hub', 'Skilled pharma workforce through TASK'],
      documents: ['Company Registration', 'Drug License / Manufacturing License', 'Project Report', 'Environmental clearance plan', 'Investment proof'],
      ministry: 'Telangana Govt. Infrastructure & Investment Corp. (TGIIC)',
      applyLink: 'https://www.tgiic.telangana.gov.in/',
      officialLink: 'https://hydphar.city/',
      status: 'Active',
      launched: 'Oct 2021',
    },
    // ── CENTRAL SCHEMES (applicable in TS) ────────────────────────────────────
    {
      id: 'ts-c1',
      type: 'central',
      name: 'PM MUDRA Yojana — Micro Enterprise Loans',
      category: 'Finance',
      badge: '🏦',
      description: 'Collateral-free loans up to ₹20 lakh to non-corporate micro/small enterprises through banks, MFIs, and NBFCs — no guarantor required under Shishu, Kishore, Tarun, and Tarun Plus.',
      eligibility: ['Non-farm micro/small businesses', 'Individuals, sole props, partnerships, companies', 'No collateral up to ₹10 lakh', 'New and existing businesses'],
      benefits: ['Shishu: up to ₹50,000', 'Kishore: ₹50,001–₹5 lakh', 'Tarun: ₹5 lakh–₹10 lakh', 'Tarun Plus: ₹10 lakh–₹20 lakh', 'Mudra RuPay Card for working capital', 'No processing fees (Shishu category)'],
      documents: ['Aadhaar / PAN Card', 'Business address proof', 'Bank statements (6 months)', 'Quotations for assets', 'Passport-size photo'],
      ministry: 'Ministry of Finance, Govt. of India',
      applyLink: 'https://www.mudra.org.in/',
      officialLink: 'https://www.mudra.org.in/',
      status: 'Active',
      launched: 'Apr 2015',
    },
    {
      id: 'ts-c2',
      type: 'central',
      name: 'PMEGP — Employment Generation Programme',
      category: 'Employment',
      badge: '💼',
      description: 'Subsidy of 15%–35% on project cost for new micro enterprises in non-farm sectors — manufacturing (max ₹50 lakh) and services (max ₹20 lakh) to generate self-employment.',
      eligibility: ['Individuals 18+ years', 'Only new projects', 'Not previously PMRY / REGP beneficiary', '8th standard (for projects > ₹10 lakh)'],
      benefits: ['15%–35% subsidy on project cost', 'Max ₹50 lakh manufacturing / ₹20 lakh services', 'Higher subsidy for women, SC/ST, minorities', 'Free EDP training (2 weeks)', 'Bank loan for balance amount'],
      documents: ['Aadhaar Card', 'Educational certificates', 'Community certificate', 'Project Report', 'Bank details'],
      ministry: 'KVIC, Ministry of MSME, Govt. of India',
      applyLink: 'https://www.kviconline.gov.in/pmegpwebportal/',
      officialLink: 'https://www.kviconline.gov.in/pmegpwebportal/',
      status: 'Active',
      launched: 'Aug 2008',
    },
    {
      id: 'ts-c3',
      type: 'central',
      name: 'Stand Up India — SC/ST & Women Entrepreneur Loans',
      category: 'Finance',
      badge: '🤝',
      description: 'Composite bank loans ₹10 lakh–₹1 crore per branch for greenfield enterprises by SC/ST and women entrepreneurs with CGFSIL credit guarantee cover.',
      eligibility: ['SC/ST entrepreneurs', 'Women entrepreneurs', 'Greenfield (new) enterprise only', 'Age 18+ years'],
      benefits: ['Loan ₹10 lakh–₹1 crore', 'Composite (term + working capital)', 'Repayment up to 7 years', 'Moratorium up to 18 months', 'CGFSIL guarantee cover'],
      documents: ['Aadhaar & PAN', 'Caste certificate (if SC/ST)', 'Business plan', 'Bank account', 'Asset quotations'],
      ministry: 'Dept. of Financial Services, Govt. of India',
      applyLink: 'https://www.standupmitra.in/',
      officialLink: 'https://www.standupmitra.in/',
      status: 'Active',
      launched: 'Apr 2016',
    },
    {
      id: 'ts-c4',
      type: 'central',
      name: 'PM Vishwakarma — Artisan Support Scheme',
      category: 'Skill & Craft',
      badge: '🔨',
      description: 'Recognition, free skill training with ₹500/day stipend, toolkit grant up to ₹15,000, and credit up to ₹3 lakh at 5% for 18 traditional artisan and craftsperson trades.',
      eligibility: ['18 traditional trades (carpenter, weaver, goldsmith, blacksmith etc.)', 'Self-employed artisan', 'Age 18+ years', 'Not in similar central scheme'],
      benefits: ['Certificate & ID as PM Vishwakarma', 'Skill upgrade training + ₹500/day', 'Toolkit grant ₹15,000', 'Credit ₹1 lakh → ₹3 lakh at 5% interest', 'Digital payment incentive', 'Market linkage support'],
      documents: ['Aadhaar Card', 'Mobile linked to Aadhaar', 'Bank account', 'Self-declaration of trade'],
      ministry: 'Ministry of MSME, Govt. of India',
      applyLink: 'https://pmvishwakarma.gov.in/',
      officialLink: 'https://pmvishwakarma.gov.in/',
      status: 'Active',
      launched: 'Sep 2023',
    },
    {
      id: 'ts-c5',
      type: 'central',
      name: 'Startup India — DPIIT Recognition',
      category: 'Startup',
      badge: '🚀',
      description: 'DPIIT recognition for startups unlocking 3-year income tax holiday, angel tax exemption, 80% IP fee rebate, labour law self-certification, and Fund of Funds access.',
      eligibility: ['Pvt Ltd / LLP / Partnership firm', 'Turnover < ₹100 crore', 'Age ≤ 10 years from incorporation', 'Innovation-led & scalable'],
      benefits: ['3-year income tax exemption (Sec 80-IAC)', 'Angel tax relief (Sec 56)', '80% patent fee rebate', 'Self-certification for 9 labour laws', 'Fast-track patent examination', '₹10,000 crore Fund of Funds access'],
      documents: ['Certificate of Incorporation', 'Business description', 'Founder KYC', 'Company PAN'],
      ministry: 'DPIIT, Ministry of Commerce, Govt. of India',
      applyLink: 'https://www.startupindia.gov.in/',
      officialLink: 'https://www.startupindia.gov.in/',
      status: 'Active',
      launched: 'Jan 2016',
    },
    {
      id: 'ts-c6',
      type: 'central',
      name: 'Udyam Registration — MSME Portal',
      category: 'Registration',
      badge: '📋',
      description: 'Mandatory free online MSME registration on Udyam portal — prerequisite for all central and state MSME benefits, subsidies, priority lending, and procurement preferences.',
      eligibility: ['Micro: investment ≤ ₹1 Cr & turnover ≤ ₹5 Cr', 'Small: investment ≤ ₹10 Cr & turnover ≤ ₹50 Cr', 'Medium: investment ≤ ₹50 Cr & turnover ≤ ₹250 Cr', 'Manufacturing & service enterprises'],
      benefits: ['Free, paperless self-declaration', 'Unlocks 50+ central MSME benefits', 'Priority sector lending access', 'Government procurement preference', 'MSME payment protection (45-day rule)', 'State scheme eligibility'],
      documents: ['Aadhaar of proprietor / director', 'PAN (auto-verified)', 'GSTIN (optional for micro)', 'Bank account & IFSC code'],
      ministry: 'Ministry of MSME, Govt. of India',
      applyLink: 'https://udyamregistration.gov.in/',
      officialLink: 'https://udyamregistration.gov.in/',
      status: 'Active',
      launched: 'Jul 2020',
    },
    {
      id: 'ts-c7',
      type: 'central',
      name: 'CGTMSE — Credit Guarantee for MSMEs',
      category: 'Finance',
      badge: '🛡️',
      description: 'Collateral-free loans up to ₹5 crore with CGTMSE guarantee cover of 75%–85%, enabling MSMEs to borrow from member lending institutions without pledging property.',
      eligibility: ['Micro & Small Enterprises (Udyam registered)', 'New & existing businesses', 'Manufacturing & service sectors', 'Loan from CGTMSE member institution'],
      benefits: ['Collateral-free up to ₹5 crore', 'Guarantee cover 75%–85%', 'No guarantee premium charged to borrower', 'Available at 130+ banks & institutions', 'Term loans & working capital covered'],
      documents: ['Udyam Registration Certificate', 'Loan application to bank', 'Project Report', 'KYC documents', 'Financial statements'],
      ministry: 'Ministry of MSME & SIDBI, Govt. of India',
      applyLink: 'https://www.cgtmse.in/',
      officialLink: 'https://www.cgtmse.in/',
      status: 'Active',
      launched: 'Aug 2000',
    },
    {
      id: 'ts-c8',
      type: 'central',
      name: 'GeM — Government e-Marketplace Seller',
      category: 'Market Access',
      badge: '🛒',
      description: 'Register as a seller on GeM to access ₹4 lakh+ crore government procurement market — sell to 60,000+ govt buyers with guaranteed payment and no physical tenders.',
      eligibility: ['Any registered business entity', 'GST + Udyam / company registration', 'Product or service sold to government', 'Pan India eligibility'],
      benefits: ['Access to ₹4 lakh+ crore govt. market', 'No physical tender hassle', 'Timely payment within 10 days', 'MSME preference policy on GeM', 'Digital onboarding in < 30 minutes', 'Transparent bid / reverse auction'],
      documents: ['Aadhaar / PAN', 'GSTIN', 'Bank account', 'Business registration', 'Product / service catalogue'],
      ministry: 'Ministry of Commerce, Govt. of India',
      applyLink: 'https://gem.gov.in/',
      officialLink: 'https://gem.gov.in/',
      status: 'Active',
      launched: 'Aug 2016',
    },
  ],
}

export default function GovernmentSchemes() {
  const { user } = useAuth()
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [filterType, setFilterType] = useState('all') // 'all' | 'state' | 'central'
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
    setFilterType('all')
    setTimeout(() => schemeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const allSchemes = selectedState ? SCHEMES[selectedState.code] || [] : []
  const schemes = filterType === 'all' ? allSchemes : allSchemes.filter(s => s.type === filterType)

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
          All active government-approved funding schemes, policies, and programs for entrepreneurs — state-specific and central government schemes with direct application links.
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
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block" /> Green dot = schemes available
          </span>
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
                      <span className="text-sm font-bold text-brand-800">
                        {SCHEMES[state.code]?.length || 0} Schemes Available
                      </span>
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
                We're actively adding government schemes and policies for {selectedCountry.name}. Be the first to know when we go live.
              </p>
              <a
                href={`https://wa.me/+916300000000?text=Notify me when schemes for ${selectedCountry.name} are added on LaunchingLaps`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                🔔 Notify Me When Available
              </a>
            </div>
          )}
        </div>
      )}

      {/* STEP 3 — SCHEMES GRID */}
      {selectedState && allSchemes.length > 0 && (
        <div ref={schemeRef} className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-brand-800 text-white text-xs font-black flex items-center justify-center">3</div>
              <h2 className="text-lg font-black text-brand-800">
                {selectedState.name} — Active Government Schemes
              </h2>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">
                {schemes.length} of {allSchemes.length}
              </span>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: `All (${allSchemes.length})` },
                { key: 'state', label: `🏛️ State (${allSchemes.filter(s => s.type === 'state').length})` },
                { key: 'central', label: `🇮🇳 Central (${allSchemes.filter(s => s.type === 'central').length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setFilterType(tab.key); setSelectedScheme(null) }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterType === tab.key
                      ? 'bg-brand-800 text-white shadow'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
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
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-green-100 text-green-700 border border-green-200">
                          {scheme.status}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                          scheme.type === 'state'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-orange-100 text-orange-700 border border-orange-200'
                        }`}>
                          {scheme.type === 'state' ? '🏛️ State' : '🇮🇳 Central'}
                        </span>
                      </div>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-brand-200 text-xs font-bold uppercase tracking-widest">{selectedScheme.category} · {selectedScheme.ministry}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        selectedScheme.type === 'state'
                          ? 'bg-blue-500/30 text-blue-200 border border-blue-400/40'
                          : 'bg-orange-500/30 text-orange-200 border border-orange-400/40'
                      }`}>
                        {selectedScheme.type === 'state' ? '🏛️ State Government Scheme' : '🇮🇳 Central Government Scheme'}
                      </span>
                    </div>
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
              {selectedScheme.officialLink && selectedScheme.officialLink !== selectedScheme.applyLink && (
                <a
                  href={selectedScheme.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 px-6 rounded-xl transition-colors text-sm"
                >
                  🌐 Official Portal
                </a>
              )}
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
                <strong>Disclaimer:</strong> Scheme information is sourced from official government portals and updated periodically. Eligibility criteria, benefit amounts, and deadlines are subject to change. Always verify the latest terms on the official government website before applying. LaunchingLaps is not affiliated with any government body.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
