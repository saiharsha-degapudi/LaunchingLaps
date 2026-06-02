"""
Seed the LaunchingLaps database with comprehensive sample data.
Run: py seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from auth import get_password_hash
import models
from datetime import datetime, timezone, timedelta

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def seed():
    if db.query(models.User).count() > 0:
        print("Database already seeded. Skipping.")
        return

    print("Seeding database with comprehensive data...")

    # ── USERS ────────────────────────────────────────────────────────────────
    # Entrepreneurs
    e1 = models.User(email="maya@ecodeliver.com", full_name="Maya Chen",
        hashed_password=get_password_hash("password123"), role=models.UserRole.entrepreneur,
        bio="Founder of EcoDeliver — sustainable last-mile delivery with 80% lower carbon emissions. Ex-Amazon Logistics, Stanford MBA.")
    e2 = models.User(email="james@medbridge.io", full_name="James Okafor",
        hashed_password=get_password_hash("password123"), role=models.UserRole.entrepreneur,
        bio="CEO of MedBridge — bringing telemedicine to 60M+ rural Americans. Former physician turned tech founder.")
    e3 = models.User(email="priya@agrisense.in", full_name="Priya Sharma",
        hashed_password=get_password_hash("password123"), role=models.UserRole.entrepreneur,
        bio="Co-founder of AgriSense — AI-powered crop intelligence for smallholder farmers across India and SE Asia. IIT Hyderabad alumna.")
    e4 = models.User(email="chidi@edubridge.ng", full_name="Chidi Nwosu",
        hashed_password=get_password_hash("password123"), role=models.UserRole.entrepreneur,
        bio="Founder of EduBridge — adaptive e-learning platform serving 200K+ students across Sub-Saharan Africa. University of Lagos, CS.")
    e5 = models.User(email="isabella@paylite.com.br", full_name="Isabella Santos",
        hashed_password=get_password_hash("password123"), role=models.UserRole.entrepreneur,
        bio="CEO of PayLite — cross-border payment rails for Latin America. 10x cheaper than SWIFT. Ex-Nubank product lead.")
    e6 = models.User(email="ravi@cloudsecure.io", full_name="Ravi Patel",
        hashed_password=get_password_hash("password123"), role=models.UserRole.entrepreneur,
        bio="CTO & Co-founder of CloudSecure — zero-trust cybersecurity for SMEs. 8 years at Palo Alto Networks before founding.")

    # Investors
    i1 = models.User(email="sarah@greencap.vc", full_name="Sarah Williams",
        hashed_password=get_password_hash("password123"), role=models.UserRole.investor,
        bio="Partner at GreenCap Ventures. 12 years in climate tech investing. Board member at 6 portfolio companies. Former Tesla policy director.")
    i2 = models.User(email="david@fintechrising.com", full_name="David Park",
        hashed_password=get_password_hash("password123"), role=models.UserRole.investor,
        bio="Angel investor with 15+ exits in fintech and digital health across the US and Asia. MIT Sloan MBA.")
    i3 = models.User(email="jennifer@sequoiascout.com", full_name="Jennifer Walsh",
        hashed_password=get_password_hash("password123"), role=models.UserRole.investor,
        bio="Sequoia Scout and early-stage angel. Focuses on AI/ML, B2B SaaS, and consumer tech. Former Google product manager.")
    i4 = models.User(email="michael@ventures500.com", full_name="Michael Torres",
        hashed_password=get_password_hash("password123"), role=models.UserRole.investor,
        bio="500 Global partner investing in emerging markets — SE Asia, LATAM, Africa, India. Led 40+ deals across 18 countries.")

    db.add_all([e1, e2, e3, e4, e5, e6, i1, i2, i3, i4])
    db.commit()
    for u in [e1, e2, e3, e4, e5, e6, i1, i2, i3, i4]:
        db.refresh(u)

    # ── PITCHES ──────────────────────────────────────────────────────────────
    p1 = models.Pitch(
        title="EcoDeliver — Green Last-Mile Delivery",
        description=(
            "EcoDeliver is revolutionizing urban logistics with an all-electric fleet and AI-powered "
            "route optimization. We reduce carbon emissions by 80% vs traditional delivery while cutting "
            "costs by 30%.\n\n"
            "📍 Traction: LOIs with 3 Fortune 500 retailers. Operating in Seattle & Portland with $180K MRR.\n"
            "🎯 Ask: $500K seed to expand to 5 new cities by Q4 2025.\n"
            "📊 Unit Economics: CAC $420, LTV $8,400, 12-month payback.\n\n"
            "The global last-mile delivery market is $130B and growing at 15% CAGR. Our differentiation is "
            "a proprietary charging-depot network and dynamic route AI that learns from every delivery."
        ),
        industry="Green Energy / Logistics", funding_goal=500000.0,
        stage=models.PitchStage.seed, owner_id=e1.id,
    )
    p2 = models.Pitch(
        title="MedBridge — Telemedicine for Rural Communities",
        description=(
            "MedBridge connects rural patients with board-certified physicians via HIPAA-compliant "
            "telehealth optimized for low-bandwidth (2G) connections.\n\n"
            "📍 Traction: 3,200 patients across Montana, Wyoming, Idaho — 94% satisfaction.\n"
            "🎯 Ask: $750K seed for specialist network and CMS certification.\n"
            "📊 ARPU $89/month, churn under 4%, 60M+ Americans without adequate healthcare access.\n\n"
            "We partner directly with rural hospitals and county health departments. Our offline-first "
            "app works even when connectivity drops, syncing records when connection returns."
        ),
        industry="Health Tech / Telemedicine", funding_goal=750000.0,
        stage=models.PitchStage.seed, owner_id=e2.id,
    )
    p3 = models.Pitch(
        title="AgriSense — AI Crop Intelligence for Smallholder Farmers",
        description=(
            "AgriSense uses satellite imagery, IoT soil sensors, and AI to give smallholder farmers "
            "actionable crop advice — increasing yield by 35% and reducing water usage by 25%.\n\n"
            "📍 Traction: 12,000 farmers across Andhra Pradesh & Telangana. Government of India pilot partner.\n"
            "🎯 Ask: $250K pre-seed to expand to Tamil Nadu and launch in Indonesia.\n"
            "📊 $8/farmer/season subscription, 89% retention after first crop cycle.\n\n"
            "India has 120M smallholder farms. We're partnering with SBI and regional cooperative banks "
            "for bundled financing. UN FAO innovation grant recipient 2024."
        ),
        industry="AgriTech / AI", funding_goal=250000.0,
        stage=models.PitchStage.idea, owner_id=e3.id,
    )
    p4 = models.Pitch(
        title="EduBridge Africa — Adaptive Learning for Emerging Markets",
        description=(
            "EduBridge delivers personalized, curriculum-aligned education across Sub-Saharan Africa "
            "via mobile-first adaptive learning — working on 2G and offline.\n\n"
            "📍 Traction: 200,000 students across Nigeria, Ghana, Kenya. 74% improvement in test scores.\n"
            "🎯 Ask: $1M seed to expand to 10 more African countries and launch B2B school licensing.\n"
            "📊 B2C $5/month, B2B $2/student/year. 60% gross margin.\n\n"
            "Africa's education technology market is underpenetrated — 600M+ school-age children, "
            "less than 15% digital learning penetration. We've partnered with UNESCO and 3 African governments."
        ),
        industry="EdTech / Mobile", funding_goal=1000000.0,
        stage=models.PitchStage.seed, owner_id=e4.id,
    )
    p5 = models.Pitch(
        title="PayLite — Cross-Border Payments for Latin America",
        description=(
            "PayLite offers real-time cross-border payment rails across LATAM — 10x cheaper than SWIFT, "
            "settling in under 30 seconds using blockchain-backed infrastructure.\n\n"
            "📍 Traction: $8M monthly volume across Brazil, Mexico, Colombia. 1,200 business customers.\n"
            "🎯 Ask: $1.5M seed for US money transmitter license and expansion to Argentina & Chile.\n"
            "📊 0.4% take rate, $32K MRR, growing 40% MoM.\n\n"
            "LATAM remittance market is $150B/year. We've secured banking partnerships in 4 countries "
            "and are processing B2B payments for 6 e-commerce platforms including Mercado Libre sellers."
        ),
        industry="FinTech / Payments", funding_goal=1500000.0,
        stage=models.PitchStage.seed, owner_id=e5.id,
    )
    p6 = models.Pitch(
        title="CloudSecure — Zero-Trust Cybersecurity for SMEs",
        description=(
            "CloudSecure delivers enterprise-grade zero-trust security at SME prices — protecting "
            "businesses from ransomware, data breaches, and supply chain attacks.\n\n"
            "📍 Traction: 380 paying customers, $45K MRR, 2% monthly churn.\n"
            "🎯 Ask: $2M Series A to hire 10 engineers and launch managed SOC service.\n"
            "📊 ACV $1,440, CAC $800, LTV $14,400. NPS score 72.\n\n"
            "60% of SMEs have no cybersecurity plan. After 3 high-profile SME breaches in 2024, "
            "demand is surging. We offer a 15-minute onboarding vs 6-week enterprise implementation."
        ),
        industry="Cybersecurity / SaaS", funding_goal=2000000.0,
        stage=models.PitchStage.growth, owner_id=e6.id,
    )

    db.add_all([p1, p2, p3, p4, p5, p6])
    db.commit()
    for p in [p1, p2, p3, p4, p5, p6]:
        db.refresh(p)

    # ── INVESTOR PROFILES ─────────────────────────────────────────────────────
    ip1 = models.InvestorProfile(user_id=i1.id, firm_name="GreenCap Ventures",
        industry_focus="Green Energy, Sustainability, Climate Tech, Clean Logistics",
        investment_min=100000.0, investment_max=1000000.0, preferred_stages="seed,growth",
        location="San Francisco, CA", website="https://greencap.vc",
        linkedin="https://linkedin.com/in/sarahwilliams-vc")
    ip2 = models.InvestorProfile(user_id=i2.id, firm_name="FintechRising Capital",
        industry_focus="Fintech, Digital Health, SaaS, Health Tech, Payments",
        investment_min=50000.0, investment_max=500000.0, preferred_stages="idea,seed",
        location="New York, NY", website="https://fintechrising.com",
        linkedin="https://linkedin.com/in/davidpark-angel")
    ip3 = models.InvestorProfile(user_id=i3.id, firm_name="Sequoia Scout Network",
        industry_focus="AI/ML, B2B SaaS, Consumer Tech, Developer Tools",
        investment_min=25000.0, investment_max=250000.0, preferred_stages="idea,seed",
        location="Palo Alto, CA", website="https://sequoiacap.com",
        linkedin="https://linkedin.com/in/jenniferwalsh-investor")
    ip4 = models.InvestorProfile(user_id=i4.id, firm_name="500 Global",
        industry_focus="Emerging Markets, EdTech, AgriTech, FinTech, Mobile, SE Asia, Africa, LATAM",
        investment_min=100000.0, investment_max=2000000.0, preferred_stages="seed,growth",
        location="San Francisco, CA / Global", website="https://500.co",
        linkedin="https://linkedin.com/in/michaeltorres-500global")

    db.add_all([ip1, ip2, ip3, ip4])
    db.commit()

    # ── COURSES ───────────────────────────────────────────────────────────────
    c1 = models.Course(title="How to Pitch to US Investors",
        description="Master the art of pitching to American VCs and angel investors. Craft a compelling story, build a winning deck, and navigate due diligence. Taught by investors who have funded 50+ startups.",
        instructor_name="Sarah Williams — Partner, GreenCap Ventures",
        duration_hours=3.5, level="Beginner", is_published=True,
        thumbnail_url="https://images.unsplash.com/photo-1560472355-536de3962603?w=800")
    c2 = models.Course(title="US Business Registration & Legal Basics",
        description="Everything international entrepreneurs need to know about starting a US company — LLC vs C-Corp, visas, taxes, EINs, and banking. Practical guidance from US-licensed attorneys.",
        instructor_name="Prof. Robert Klein, JD — Stanford Law",
        duration_hours=4.0, level="Beginner", is_published=True,
        thumbnail_url="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800")
    c3 = models.Course(title="Financial Modeling for Startups",
        description="Build investor-ready financial models from scratch. Revenue projections, unit economics, cash flow, and the three financial statements. Excel and Google Sheets templates included.",
        instructor_name="Marcus Reid — Former CFO, 3 VC-backed exits",
        duration_hours=5.0, level="Intermediate", is_published=True,
        thumbnail_url="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800")
    c4 = models.Course(title="Building & Managing Your Cap Table",
        description="Understand equity, dilution, SAFEs, convertible notes, and option pools. Use tools like Carta and Pulley. Avoid the most expensive cap table mistakes founders make.",
        instructor_name="Jennifer Walsh — Sequoia Scout",
        duration_hours=3.0, level="Intermediate", is_published=True,
        thumbnail_url="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800")
    c5 = models.Course(title="Startup Due Diligence: The Investor's Playbook",
        description="Learn how top investors evaluate startups — from team assessment to market sizing, financial scrutiny, and legal red flags. Essential for founders and investors alike.",
        instructor_name="David Park — Angel Investor, 15+ exits",
        duration_hours=6.0, level="Advanced", is_published=True,
        thumbnail_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800")
    c6 = models.Course(title="Raising a Series A: Advanced Fundraising",
        description="From seed graduation to Series A — how to build institutional relationships, run a process, set valuation, and negotiate term sheets with top-tier VC firms.",
        instructor_name="Michael Torres — Partner, 500 Global",
        duration_hours=4.5, level="Advanced", is_published=True,
        thumbnail_url="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800")

    db.add_all([c1, c2, c3, c4, c5, c6])
    db.commit()
    for c in [c1, c2, c3, c4, c5, c6]:
        db.refresh(c)

    # ── LESSONS — Course 1 ────────────────────────────────────────────────────
    db.add_all([
        models.Lesson(course_id=c1.id, title="Understanding the US Investor Landscape", order_index=0, duration_minutes=25,
            content="The US has the world's most developed VC ecosystem. Key players:\n\n• Angels: $25K–$500K, personal funds, idea/pre-seed stage\n• Seed Funds: $250K–$2M, want traction metrics\n• Series A VCs: expect $1M+ ARR, proven unit economics\n• Corporate Strategics: strategic fit + financial return\n\nAction: Research 10 investors active in your industry using Crunchbase or AngelList."),
        models.Lesson(course_id=c1.id, title="Crafting a Winning Pitch Deck", order_index=1, duration_minutes=40,
            content="US investors see 500+ decks/year. Yours must be clear and compelling.\n\n12-Slide Framework:\n1. Cover — Name, tagline, your name\n2. Problem — Vivid pain point\n3. Solution — Why it works\n4. Market Size — TAM/SAM/SOM\n5. Product — Screenshots/demo\n6. Traction — Revenue, users, growth\n7. Business Model — How you earn\n8. GTM — Customer acquisition\n9. Competition — Honest landscape\n10. Team — Why you win\n11. Financials — 3-year projections\n12. The Ask — Amount, use of funds\n\nPro Tip: Investors decide in the first 60 seconds."),
        models.Lesson(course_id=c1.id, title="The Pitch Meeting: Delivery & Negotiation", order_index=2, duration_minutes=35,
            content="Getting the meeting is half the battle.\n\nBefore: Research portfolio + thesis. Know CAC, LTV, burn, runway cold.\n\nDuring: 30-sec elevator pitch. Let them interrupt — engagement is good. Ask: 'What would need to be true for you to invest?'\n\nTerm Sheet Basics:\n• Pre-money valuation = your dilution\n• Pro-rata, information rights, board seats\n• Always use a startup attorney\n\nCommon Mistakes: Over-valuing, ignoring investor references, no follow-up within 24h."),
    ])

    # ── LESSONS — Course 2 ────────────────────────────────────────────────────
    db.add_all([
        models.Lesson(course_id=c2.id, title="LLC vs C-Corp: Which Entity to Choose", order_index=0, duration_minutes=30,
            content="The most important early legal decision.\n\nLLC: Pass-through taxation, flexible management. Great for small businesses. NOT ideal for VC funding.\n\nC-Corporation: Gold standard for VC-backed startups. Multiple share classes, QSBS tax exclusion (up to $10M tax-free gain). Delaware C-Corp: 90%+ of US startups.\n\nRecommendation: Plan to raise VC? Incorporate as Delaware C-Corp from day one."),
        models.Lesson(course_id=c2.id, title="EIN, Banking & Compliance Essentials", order_index=1, duration_minutes=25,
            content="EIN: Apply free at IRS.gov (15 min). Required for bank account, employees, taxes.\n\nBanking: Open dedicated business account immediately. Mercury, Relay, Brex popular with startups. Never mix personal + business funds.\n\nCompliance: Delaware franchise tax due March 1 (~$400 min). File annual report. Use registered agent ($50–$150/yr).\n\nAccounting: QuickBooks or Bench from day one. Clean books are essential for due diligence."),
        models.Lesson(course_id=c2.id, title="Visas, Work Authorization & Founder Equity", order_index=2, duration_minutes=35,
            content="Visa Options for Founders:\n• O-1A: Extraordinary ability — publications, awards, critical role\n• EB-1A Green Card: Permanent residence, no sponsor needed\n• EB-2 NIW: National Interest Waiver — benefits US economy\n• L-1A: Existing company abroad, transfer as executive\n\nFounder Equity Basics:\n• 83(b) election within 30 days of restricted stock\n• Standard vesting: 4 years, 1-year cliff\n• Issue shares at par value immediately after incorporation\n• Use Carta cap table from day one\n\nWarning: Never accept equity without a lawyer reviewing docs."),
    ])

    # ── LESSONS — Course 3 ────────────────────────────────────────────────────
    db.add_all([
        models.Lesson(course_id=c3.id, title="Revenue Modeling: Subscriptions, Usage & Marketplace", order_index=0, duration_minutes=45,
            content="Three major revenue model types:\n\n1. Subscription (SaaS): Monthly/annual ARR, churn, expansion revenue\n   Key metrics: MRR, ARR, churn rate, NRR (Net Revenue Retention)\n\n2. Usage-Based: API calls, transactions, data processed\n   Model: unit price × volume × retention curve\n\n3. Marketplace: GMV × take rate\n   Key: liquidity (supply/demand balance), rake defensibility\n\nBuild a monthly model for Year 1 (month-by-month), then annual for Years 2-3."),
        models.Lesson(course_id=c3.id, title="Unit Economics: CAC, LTV & Payback Period", order_index=1, duration_minutes=40,
            content="The three numbers every investor will ask:\n\n• CAC (Customer Acquisition Cost) = Total Sales & Marketing Spend ÷ New Customers Acquired\n• LTV (Lifetime Value) = ARPU × Gross Margin % ÷ Churn Rate\n• LTV:CAC Ratio: Good >3x, Great >5x. If <1x, you're burning money to grow.\n• Payback Period = CAC ÷ (ARPU × Gross Margin %)\n\nBenchmarks by stage:\n- Pre-seed: LTV:CAC >2x acceptable\n- Seed: target >3x\n- Series A: must show >4x with clear path to 5x+"),
        models.Lesson(course_id=c3.id, title="Building Your 3-Statement Model", order_index=2, duration_minutes=50,
            content="The three financial statements investors require:\n\n1. Income Statement (P&L): Revenue - COGS = Gross Profit. Then operating expenses → EBITDA → Net Income\n\n2. Balance Sheet: Assets = Liabilities + Equity. Snapshot of financial position at a point in time.\n\n3. Cash Flow Statement: Operating + Investing + Financing activities. Most important for startups — cash is oxygen.\n\nKey: Model your runway. Investors want to see 18-24 months post-raise before next fundraise needed.\n\nTemplate available in course resources."),
    ])

    # ── LESSONS — Course 4 ────────────────────────────────────────────────────
    db.add_all([
        models.Lesson(course_id=c4.id, title="Cap Table Basics: Shares, Dilution & Option Pools", order_index=0, duration_minutes=35,
            content="Your cap table is the official record of who owns what.\n\nKey Terms:\n• Authorized Shares: Total shares your company can issue\n• Issued Shares: Shares actually given to founders/investors\n• Option Pool: Reserved for employees (typically 10-20%)\n• Fully Diluted: All shares including options and convertibles\n\nDilution example:\n- You own 1,000,000 shares of 1,000,000 total = 100%\n- Investor buys 250,000 new shares\n- Now: 1,000,000 / 1,250,000 = 80% — you're diluted 20%\n\nRule: Create the option pool BEFORE closing an investment round — it dilutes existing shareholders, not just you."),
        models.Lesson(course_id=c4.id, title="SAFEs, Convertible Notes & Priced Rounds", order_index=1, duration_minutes=40,
            content="Three ways investors put money in:\n\n1. SAFE (Simple Agreement for Future Equity)\n   - No interest, no maturity date\n   - Converts at next priced round\n   - Y Combinator standard — simple and cheap ($500 legal)\n   - Post-Money SAFE: investor knows their % at signing\n\n2. Convertible Note\n   - Debt that converts to equity\n   - Has interest rate (6-8%) and maturity date\n   - More complex and expensive than SAFE\n\n3. Priced Equity Round (Series A+)\n   - Sets valuation explicitly\n   - Creates preferred stock with rights (liquidation preference, anti-dilution)\n   - Requires full legal process ($20-50K in legal fees)\n\nFor pre-seed: use YC SAFE. For seed: SAFE or priced depending on lead investor preference."),
    ])

    # ── LESSONS — Course 5 ────────────────────────────────────────────────────
    db.add_all([
        models.Lesson(course_id=c5.id, title="Team Assessment: The #1 Factor in Early-Stage Investing", order_index=0, duration_minutes=45,
            content="'We invest in people, not companies' — every top investor says this. Here's what they actually evaluate:\n\n• Domain Expertise: Has the founder spent 5+ years in this problem space?\n• Coachability: Do they update their thinking when presented with new data?\n• Execution History: What have they shipped? What have they sold?\n• Team Completeness: Is there a technical + business + domain co-founder?\n• Network & Unfair Advantages: Access to customers, talent, distribution?\n\nRed Flags:\n- Solo founder with no co-founder search\n- All friends/family on the team (no external hires)\n- Founders who haven't done customer discovery\n- Defensive when challenged on assumptions"),
        models.Lesson(course_id=c5.id, title="Market Sizing: TAM, SAM & SOM Analysis", order_index=1, duration_minutes=40,
            content="Market sizing is one of the most misunderstood parts of investor diligence.\n\n• TAM (Total Addressable Market): If you captured 100% globally\n• SAM (Serviceable Addressable Market): The portion you can realistically target\n• SOM (Serviceable Obtainable Market): What you can capture in 3-5 years\n\nTwo methods:\n1. Top-Down: Industry report size × market share %\n2. Bottom-Up: Price per unit × number of potential customers (more credible)\n\nInvestor expectations:\n- Seed: SAM $500M+ (TAM $5B+)\n- Series A: SAM $2B+ (TAM $20B+)\n\nWarning: Inflated TAMs destroy credibility. Show your math. Use bottom-up."),
        models.Lesson(course_id=c5.id, title="Financial Due Diligence: What Investors Actually Check", order_index=2, duration_minutes=55,
            content="When an investor says they're 'doing diligence,' here's exactly what they're reviewing:\n\nRevenue Quality:\n□ Is MRR real? (Check contract terms, cancellation clauses)\n□ Revenue concentration risk? (No customer >20% of revenue)\n□ Deferred revenue vs recognized revenue?\n\nUnit Economics:\n□ Cohort analysis — does LTV hold up over time?\n□ Payback period trending better or worse?\n□ Gross margin by customer segment?\n\nBurn & Runway:\n□ Gross burn vs net burn\n□ Months of runway remaining\n□ Key person risks (what if CTO leaves?)\n\nLegal:\n□ Clean cap table with no disputes\n□ IP assigned to company (not founders personally)\n□ No pending litigation or regulatory issues"),
    ])

    # ── LESSONS — Course 6 ────────────────────────────────────────────────────
    db.add_all([
        models.Lesson(course_id=c6.id, title="When Are You Ready for Series A?", order_index=0, duration_minutes=40,
            content="The question every founder asks. Here are the real signals:\n\nBy the Numbers (2024 benchmarks):\n• SaaS: $1-2M ARR, growing 100%+ YoY, NRR >110%\n• Marketplace: $10-30M GMV, 15%+ take rate, strong supply/demand\n• Consumer: 500K-2M MAUs, strong retention cohorts\n• Fintech: $50M+ transaction volume, regulatory clarity\n\nQualitative Signals:\n• Repeatable sales motion (not founder-led for every deal)\n• Clear ICP (Ideal Customer Profile) with 5+ reference customers\n• Product-market fit proven (users would be 'very disappointed' if gone)\n• Team that can scale: VP Sales, VP Eng hired or committed\n\nTimeline: Series A raise takes 3-6 months. Start conversations 9 months before you need money."),
        models.Lesson(course_id=c6.id, title="Building Institutional Investor Relationships", order_index=1, duration_minutes=45,
            content="The best Series A fundraises are done before you need money.\n\n12-Month Relationship Strategy:\n• Month 1-3: Identify 30 target funds by thesis fit + portfolio fit\n• Month 4-6: Get warm intros. Attend their events. Engage on Twitter/LinkedIn.\n• Month 6-9: Share updates quarterly. Show momentum without asking.\n• Month 10-12: Flip to 'fundraising mode' with full data room ready\n\nWarm Intro Sources:\n• Your seed investors (best signal)\n• Portfolio founders of target VCs\n• Accelerator networks (YC, Techstars, Pioneer)\n• LinkedIn connections of VC partners\n\nCold outreach works 2% of the time. Warm intros work 40% of the time.\n\nAim for 15+ first meetings to run a real process."),
    ])

    db.commit()

    # ── COMMUNITY POSTS ────────────────────────────────────────────────────────
    posts = [
        models.CommunityPost(author_id=e1.id, category="Fundraising", upvotes=24,
            title="Tips for pitching to US investors as an international founder?",
            body="I've been getting meetings with investors but feel like there's a cultural gap in how I pitch. Any advice from founders who've successfully raised from American VCs? Specifically around storytelling style and how direct to be about financials. My background is in logistics tech and I'm finding US investors want a very different narrative structure than what I pitched to investors back home."),
        models.CommunityPost(author_id=e2.id, category="Legal", upvotes=15,
            title="Best banks for startup founders — Mercury vs Brex vs Relay?",
            body="Looking for recommendations on business banking. I've heard good things about Mercury and Brex. Anyone have hands-on experience with both? Mainly need: no monthly fees, great ACH, solid API for accounting integrations, and good support for international wire transfers. Delaware C-Corp structure. Would love to hear from founders who've used multiple options."),
        models.CommunityPost(author_id=i1.id, category="General", upvotes=52,
            title="What we look for in early-stage climate tech pitches — investor perspective",
            body="As a partner at a climate-focused fund, I see hundreds of pitches per year. Here's what makes us excited:\n\n1. Team with domain expertise (ex-utility, ex-Tesla, PhD in relevant field)\n2. Clear path to 10x cost reduction or efficiency gain over incumbents\n3. Hardware startups: show us a working prototype before asking for Series A\n4. Software/marketplace: GMV growth matters more than user count\n5. Regulatory clarity — climate tech lives and dies by policy\n\nHappy to answer questions below!"),
        models.CommunityPost(author_id=e3.id, category="Legal", upvotes=18,
            title="How to structure equity splits with co-founders — lessons learned the hard way",
            body="We almost broke up our founding team over equity in month 3. Here's what I wish I knew:\n\n1. Never do equal splits 'to be fair' — someone always contributes more\n2. Use a vesting schedule from day 1, even between friends\n3. Have the hard conversations early about roles: who is CEO, who is CTO?\n4. Get a co-founder agreement BEFORE writing a line of code\n5. Define what happens if someone leaves in year 1, year 2, year 3\n\nWe used a contribution-weighted split: 40/35/25 based on initial capital, prior work, and domain expertise. It was awkward for a week and saved our company."),
        models.CommunityPost(author_id=i2.id, category="Fundraising", upvotes=33,
            title="The one metric that tells me if a founder truly understands their business",
            body="After 15+ investments across fintech and health tech, there's one question I always ask founders:\n\n'What's your payback period on CAC, and what's driving it up or down?'\n\nMost founders know their CAC and LTV numbers in isolation. But the founders who really understand their business can tell me:\n- Why their payback period is what it is\n- What one change would improve it the most\n- What they're specifically doing to shorten it\n\nThis single question reveals whether you're a metrics-driven operator or someone who has memorized numbers to impress investors. Which are you?"),
        models.CommunityPost(author_id=e4.id, category="Marketing", upvotes=11,
            title="How did you build your first 1,000 US customers from outside the US?",
            body="We're an EdTech startup based in Lagos, Nigeria targeting US school districts. We have incredible product traction in Africa but breaking into the US market feels like starting from zero. We don't have US references, we can't easily fly to conferences, and cold emails get no response.\n\nWhat actually worked for other international founders targeting US customers? Partnerships? LinkedIn? Content marketing? Paying for intros? Would love to hear specific tactics, not general advice."),
        models.CommunityPost(author_id=e5.id, category="Networking", upvotes=9,
            title="Looking to connect with founders who've raised from 500 Global or Sequoia Scout",
            body="We're preparing for our seed round and 500 Global and Sequoia Scout are top of our target list based on our LATAM focus. We've done the research but nothing beats hearing from founders who've actually gone through the process.\n\nWhat's the diligence process like? How long did it take from first meeting to term sheet? What matters most to them beyond the deck? Any tips on getting warm intros?\n\nHappy to reciprocate with introductions to LATAM investor networks."),
        models.CommunityPost(author_id=e6.id, category="Tech", upvotes=27,
            title="Zero-trust vs VPN — explaining security architecture to non-technical investors",
            body="I build cybersecurity tools but half my investor meetings are with people who don't know the difference between a firewall and a VPN. Here's the analogy I've found works best:\n\nOld security (castle-and-moat): Everything inside the network is trusted. VPN punches a hole in the wall for remote workers.\n\nZero-trust: No one is trusted by default — not even internal users. Every request is verified. Think of it as airport security for every door in the building, not just the entrance.\n\nIf you're a non-technical investor, ask founders: 'What happens when an insider goes rogue?' That answer tells you everything about their security philosophy."),
        models.CommunityPost(author_id=i3.id, category="Product", upvotes=41,
            title="Product-market fit: the 40% rule and how to measure it honestly",
            body="The most cited PMF metric is the 'very disappointed test' from Sean Ellis:\nSurvey users: 'How would you feel if you could no longer use this product?'\n40%+ saying 'very disappointed' = strong PMF signal.\n\nBut here's what most people get wrong:\n\n1. Survey your BEST users, not all users\n2. Look at cohort retention curves flattening (they always start declining — the key is where they level off)\n3. Track NPS by cohort, not overall\n4. The real test: would you be worried if a competitor launched? If yes, you probably have PMF.\n\nPMF isn't binary. It's a spectrum. Most founders have PMF in a narrow segment and mistakenly try to scale before confirming breadth."),
        models.CommunityPost(author_id=e1.id, category="Fundraising", upvotes=19,
            title="Just closed our $500K seed round — here's what actually worked",
            body="After 6 months, 78 investor conversations, and 12 term sheets, we closed our seed. Here's the honest breakdown of what worked:\n\n✅ What worked:\n• Warm intros from other founders (70% of our meetings came this way)\n• Leading with our pilot LOIs from big-name customers\n• Having David Park as an angel first — his name opened doors\n• A 15-second demo video embedded in our cold email\n\n❌ What didn't:\n• Cold LinkedIn messages (0% response rate)\n• Accelerator applications during fundraising (distraction)\n• Pitching based on market size before establishing problem credibility\n\nHappy to share our pitch deck structure with anyone in DMs."),
    ]
    db.add_all(posts)
    db.commit()

    # ── MESSAGES ──────────────────────────────────────────────────────────────
    now = datetime.now(timezone.utc)
    msgs = [
        # Sarah → Maya
        models.Message(sender_id=i1.id, receiver_id=e1.id, is_read=True,
            created_at=now - timedelta(days=5),
            body="Hi Maya, I came across your EcoDeliver pitch on LaunchingLaps and I'm genuinely excited. The route optimization data you shared is impressive — 80% carbon reduction at 30% cost savings is a compelling double bottom line. Would you be open to a 30-minute call this week to learn more?"),
        # Maya → Sarah
        models.Message(sender_id=e1.id, receiver_id=i1.id, is_read=True,
            created_at=now - timedelta(days=4, hours=22),
            body="Sarah! Thank you so much — that means a lot coming from GreenCap. I'd love to connect. I'm free Tuesday 10am PT or Thursday 2pm PT. I can also share our data room beforehand if that helps. Which works better for you?"),
        # Sarah → Maya
        models.Message(sender_id=i1.id, receiver_id=e1.id, is_read=True,
            created_at=now - timedelta(days=4, hours=20),
            body="Tuesday 10am PT works perfectly. I'll send a calendar invite. Please do share the data room — I'd love to review your unit economics before the call. Looking forward to it!"),
        # David → James
        models.Message(sender_id=i2.id, receiver_id=e2.id, is_read=True,
            created_at=now - timedelta(days=3),
            body="James, MedBridge caught my attention — especially the 94% patient satisfaction in low-bandwidth environments. That's a hard technical problem and I can see you've solved it well. I've been looking for a rural health investment and the timing feels right. Can we jump on a call?"),
        # James → David
        models.Message(sender_id=e2.id, receiver_id=i2.id, is_read=False,
            created_at=now - timedelta(days=2, hours=18),
            body="David! Yes, absolutely. I've been following FintechRising Capital's digital health investments — your portfolio company PrimaryCare.ai is doing excellent work. I'd love to explore alignment. I'm available this week Thursday or Friday. Also happy to do a product demo — I think seeing the offline-sync in action speaks for itself."),
        # Jennifer → Ravi
        models.Message(sender_id=i3.id, receiver_id=e6.id, is_read=True,
            created_at=now - timedelta(days=1),
            body="Ravi, your CloudSecure pitch is exactly what we've been looking for in the Sequoia Scout network. Zero-trust for SMEs is massively underserved — every enterprise has it, almost no SME does. Your 380 paying customers at $1,440 ACV shows real validation. Quick question before I dig deeper: what's your gross margin after infrastructure costs?"),
        # Ravi → Jennifer
        models.Message(sender_id=e6.id, receiver_id=i3.id, is_read=False,
            created_at=now - timedelta(hours=8),
            body="Jennifer, great question! Our gross margin is 74% at current scale, and we model 82% at 1,000 customers as infrastructure costs amortize. The key driver is our multi-tenant architecture — adding a customer costs us roughly $12/month in infra. Happy to walk through the full unit economics model. When works for a call?"),
    ]
    db.add_all(msgs)
    db.commit()

    # ── SYNDICATES ────────────────────────────────────────────────────────────
    s1 = models.SPV(pitch_id=p1.id, lead_investor_id=i1.id,
        title="EcoDeliver Syndicate I",
        description="Co-investing in EcoDeliver's $500K seed round alongside GreenCap Ventures. Accelerating city expansion and EV fleet buildout across the US Pacific Northwest and Southwest.",
        target_amount=500000.0, committed_amount=185000.0,
        carry_pct=20.0, mgmt_fee_pct=2.0, min_check=10000.0,
        deadline=now + timedelta(days=60), status=models.SPVStatus.forming)
    s2 = models.SPV(pitch_id=p2.id, lead_investor_id=i2.id,
        title="MedBridge Syndicate I",
        description="Co-investing in MedBridge's $750K seed round. David Park leads with focus on the digital health go-to-market and CMS certification milestone.",
        target_amount=750000.0, committed_amount=320000.0,
        carry_pct=20.0, mgmt_fee_pct=2.0, min_check=5000.0,
        deadline=now + timedelta(days=45), status=models.SPVStatus.forming)
    s3 = models.SPV(pitch_id=p1.id, lead_investor_id=i1.id,
        title="GreenTech Opportunities Syndicate",
        description="Fully funded and active. Co-invested in EcoDeliver's pre-seed. This vehicle is closed to new commitments.",
        target_amount=250000.0, committed_amount=250000.0,
        carry_pct=20.0, mgmt_fee_pct=2.0, min_check=5000.0,
        deadline=None, status=models.SPVStatus.active)
    s4 = models.SPV(pitch_id=p5.id, lead_investor_id=i4.id,
        title="PayLite LATAM Syndicate",
        description="Led by Michael Torres (500 Global). Co-investing in PayLite's $1.5M seed to capture the massive LATAM cross-border payments opportunity.",
        target_amount=500000.0, committed_amount=120000.0,
        carry_pct=20.0, mgmt_fee_pct=2.0, min_check=10000.0,
        deadline=now + timedelta(days=75), status=models.SPVStatus.forming)

    db.add_all([s1, s2, s3, s4])
    db.commit()
    for s in [s1, s2, s3, s4]:
        db.refresh(s)

    # ── COMMITMENTS ───────────────────────────────────────────────────────────
    db.add_all([
        models.SPVCommitment(spv_id=s1.id, investor_id=i2.id, amount=100000.0, status="committed"),
        models.SPVCommitment(spv_id=s1.id, investor_id=i1.id, amount=85000.0, status="funded"),
        models.SPVCommitment(spv_id=s2.id, investor_id=i1.id, amount=150000.0, status="committed"),
        models.SPVCommitment(spv_id=s2.id, investor_id=i2.id, amount=170000.0, status="funded"),
        models.SPVCommitment(spv_id=s3.id, investor_id=i1.id, amount=150000.0, status="funded"),
        models.SPVCommitment(spv_id=s3.id, investor_id=i2.id, amount=100000.0, status="funded"),
        models.SPVCommitment(spv_id=s4.id, investor_id=i3.id, amount=75000.0, status="committed"),
        models.SPVCommitment(spv_id=s4.id, investor_id=i4.id, amount=45000.0, status="funded"),
    ])
    db.commit()

    print("\n✅ Database seeded successfully!\n")
    print("─" * 50)
    print("ENTREPRENEUR ACCOUNTS:")
    print("  maya@ecodeliver.com / password123  (EcoDeliver — Green Logistics)")
    print("  james@medbridge.io / password123   (MedBridge — Rural Telemedicine)")
    print("  priya@agrisense.in / password123   (AgriSense — AI for Farmers, India)")
    print("  chidi@edubridge.ng / password123   (EduBridge Africa — EdTech)")
    print("  isabella@paylite.com.br / password123  (PayLite — LATAM Payments)")
    print("  ravi@cloudsecure.io / password123  (CloudSecure — Cybersecurity)")
    print("\nINVESTOR ACCOUNTS:")
    print("  sarah@greencap.vc / password123    (GreenCap Ventures)")
    print("  david@fintechrising.com / password123  (FintechRising Capital)")
    print("  jennifer@sequoiascout.com / password123  (Sequoia Scout)")
    print("  michael@ventures500.com / password123  (500 Global)")
    print("─" * 50)
    print("\nData seeded:")
    print("  • 10 users (6 entrepreneurs + 4 investors)")
    print("  • 6 pitches from 5 countries, 6 industries")
    print("  • 4 investor profiles")
    print("  • 6 courses (Beginner + Intermediate + Advanced)")
    print("  • 10 community posts across all categories")
    print("  • 7 messages (3 active conversations)")
    print("  • 4 syndicates (3 forming, 1 active)")


if __name__ == "__main__":
    seed()
    db.close()
