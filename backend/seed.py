"""
Seed the LaunchingLaps database with sample data.
Run: python seed.py
"""
import sys
import os

# Make sure we can import project modules
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from auth import get_password_hash
import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def seed():
    # ── Check if already seeded ──────────────────────────────────────────────
    if db.query(models.User).count() > 0:
        print("Database already seeded. Skipping.")
        return

    print("Seeding database...")

    # ── Users ────────────────────────────────────────────────────────────────
    entrepreneur1 = models.User(
        email="maya@ecodeliver.com",
        full_name="Maya Chen",
        hashed_password=get_password_hash("password123"),
        role=models.UserRole.entrepreneur,
        bio="Founder of EcoDeliver — passionate about sustainable logistics and green tech.",
    )
    entrepreneur2 = models.User(
        email="james@medbridge.io",
        full_name="James Okafor",
        hashed_password=get_password_hash("password123"),
        role=models.UserRole.entrepreneur,
        bio="CEO of MedBridge — bringing telemedicine to underserved rural communities.",
    )
    investor1 = models.User(
        email="sarah@greencap.vc",
        full_name="Sarah Williams",
        hashed_password=get_password_hash("password123"),
        role=models.UserRole.investor,
        bio="Partner at GreenCap Ventures. Focus on climate tech and sustainable infrastructure.",
    )
    investor2 = models.User(
        email="david@fintechrising.com",
        full_name="David Park",
        hashed_password=get_password_hash("password123"),
        role=models.UserRole.investor,
        bio="Angel investor with 15+ exits in fintech and digital health across the US and Asia.",
    )

    db.add_all([entrepreneur1, entrepreneur2, investor1, investor2])
    db.commit()
    for u in [entrepreneur1, entrepreneur2, investor1, investor2]:
        db.refresh(u)

    # ── Pitches ──────────────────────────────────────────────────────────────
    pitch1 = models.Pitch(
        title="EcoDeliver — Green Last-Mile Delivery",
        description=(
            "EcoDeliver is revolutionizing urban logistics with an all-electric fleet and "
            "AI-powered route optimization. We reduce carbon emissions by 80% compared to "
            "traditional delivery services while cutting delivery costs by 30%.\n\n"
            "We have signed LOIs with three Fortune 500 retailers and are currently operating "
            "in Seattle and Portland. Seeking $500K seed round to expand to 5 new cities by Q4."
        ),
        industry="Green Energy / Logistics",
        funding_goal=500000.0,
        stage=models.PitchStage.seed,
        owner_id=entrepreneur1.id,
    )
    pitch2 = models.Pitch(
        title="MedBridge — Telemedicine for Rural US",
        description=(
            "MedBridge connects rural patients with board-certified physicians via a HIPAA-compliant "
            "telehealth platform optimized for low-bandwidth connections. Over 60 million Americans "
            "lack adequate access to healthcare — MedBridge bridges that gap.\n\n"
            "Currently serving 3,200 patients across Montana, Wyoming, and Idaho with a 94% patient "
            "satisfaction rate. Raising $750K to build out specialist network and achieve CMS certification."
        ),
        industry="Health Tech / Telemedicine",
        funding_goal=750000.0,
        stage=models.PitchStage.seed,
        owner_id=entrepreneur2.id,
    )

    db.add_all([pitch1, pitch2])
    db.commit()
    for p in [pitch1, pitch2]:
        db.refresh(p)

    # ── Investor Profiles ────────────────────────────────────────────────────
    inv_profile1 = models.InvestorProfile(
        user_id=investor1.id,
        firm_name="GreenCap Ventures",
        industry_focus="Green Energy, Sustainability, Climate Tech, Logistics",
        investment_min=100000.0,
        investment_max=1000000.0,
        preferred_stages="seed,growth",
        location="San Francisco, CA",
        website="https://greencap.vc",
        linkedin="https://linkedin.com/in/sarahwilliams-vc",
    )
    inv_profile2 = models.InvestorProfile(
        user_id=investor2.id,
        firm_name="FintechRising Capital",
        industry_focus="Fintech, Digital Health, SaaS, Health Tech",
        investment_min=50000.0,
        investment_max=500000.0,
        preferred_stages="idea,seed",
        location="New York, NY",
        website="https://fintechrising.com",
        linkedin="https://linkedin.com/in/davidpark-angel",
    )

    db.add_all([inv_profile1, inv_profile2])
    db.commit()

    # ── Courses ──────────────────────────────────────────────────────────────
    course1 = models.Course(
        title="How to Pitch to US Investors",
        description=(
            "Master the art of pitching your startup to American venture capitalists and angel investors. "
            "Learn how to craft a compelling story, build a winning deck, and navigate due diligence. "
            "Taught by seasoned investors who have funded 50+ startups."
        ),
        instructor_name="Sarah Williams",
        duration_hours=3.5,
        level="Beginner",
        thumbnail_url="https://images.unsplash.com/photo-1560472355-536de3962603?w=800",
        is_published=True,
    )
    course2 = models.Course(
        title="US Business Registration & Legal Basics",
        description=(
            "Everything international entrepreneurs need to know about starting a business in the United States — "
            "from choosing the right entity type (LLC vs C-Corp) to understanding visas, taxes, EINs, "
            "and banking requirements. Practical, actionable guidance from US-licensed attorneys."
        ),
        instructor_name="Prof. Robert Klein, JD",
        duration_hours=4.0,
        level="Beginner",
        thumbnail_url="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800",
        is_published=True,
    )

    db.add_all([course1, course2])
    db.commit()
    for c in [course1, course2]:
        db.refresh(c)

    # ── Lessons — Course 1 ───────────────────────────────────────────────────
    lessons_c1 = [
        models.Lesson(
            course_id=course1.id,
            title="Understanding the US Investor Landscape",
            content=(
                "The United States has the world's most developed venture capital ecosystem. "
                "In this lesson, we break down the key players: angel investors, seed funds, "
                "Series A VCs, and corporate strategics.\n\n"
                "**Key Takeaways:**\n"
                "- Angels invest $25K–$500K from personal funds, typically at idea/pre-seed\n"
                "- Seed funds write $250K–$2M checks and want traction\n"
                "- Series A VCs expect $1M+ ARR and proven unit economics\n"
                "- Know which type of investor matches your stage before pitching\n\n"
                "**Action Item:** Research 10 investors active in your industry and stage using Crunchbase or AngelList."
            ),
            order_index=0,
            duration_minutes=25,
        ),
        models.Lesson(
            course_id=course1.id,
            title="Crafting a Winning Pitch Deck",
            content=(
                "Your pitch deck is your first impression — make it count. US investors see hundreds "
                "of decks per month, so yours must be clear, concise, and compelling.\n\n"
                "**The 12-Slide Framework:**\n"
                "1. Cover — Company name, tagline, your name\n"
                "2. Problem — The pain point you're solving (make it vivid)\n"
                "3. Solution — Your product/service and why it works\n"
                "4. Market Size — TAM, SAM, SOM with credible sources\n"
                "5. Product — Screenshots, demo, key features\n"
                "6. Traction — Revenue, users, growth rate, partnerships\n"
                "7. Business Model — How you make money\n"
                "8. Go-To-Market — How you'll acquire customers at scale\n"
                "9. Competition — Honest competitive landscape\n"
                "10. Team — Why you are the right team to win\n"
                "11. Financials — 3-year projections (be realistic)\n"
                "12. The Ask — Amount raising, use of funds, timeline\n\n"
                "**Pro Tip:** Lead with the problem and solution — investors decide in the first 60 seconds."
            ),
            order_index=1,
            duration_minutes=40,
        ),
        models.Lesson(
            course_id=course1.id,
            title="The Pitch Meeting: Delivery & Negotiation",
            content=(
                "Getting the meeting is half the battle — now you need to nail the delivery and "
                "understand term sheet negotiations.\n\n"
                "**Before the Meeting:**\n"
                "- Research the investor's portfolio companies and investment thesis\n"
                "- Prepare for the top 20 questions investors always ask\n"
                "- Know your numbers cold: CAC, LTV, burn rate, runway\n\n"
                "**During the Meeting:**\n"
                "- Open with the 30-second elevator pitch\n"
                "- Let them interrupt — engagement is a good sign\n"
                "- Answer questions directly; don't bluff\n"
                "- Always ask: 'What would need to be true for you to invest?'\n\n"
                "**Term Sheet Basics:**\n"
                "- Pre-money valuation determines your dilution\n"
                "- Pro-rata rights, information rights, board seats — understand each\n"
                "- Use a startup-experienced attorney to review any term sheet\n\n"
                "**Common Mistakes:** Over-valuing too early, ignoring investor references, not following up within 24 hours."
            ),
            order_index=2,
            duration_minutes=35,
        ),
    ]

    # ── Lessons — Course 2 ───────────────────────────────────────────────────
    lessons_c2 = [
        models.Lesson(
            course_id=course2.id,
            title="Choosing Your Business Entity: LLC vs C-Corp",
            content=(
                "The most important early legal decision for any US startup is choosing the right "
                "business entity. This choice affects taxes, fundraising ability, and personal liability.\n\n"
                "**LLC (Limited Liability Company):**\n"
                "- Pass-through taxation (profits taxed at personal rate)\n"
                "- Flexible management structure\n"
                "- Great for small businesses and solopreneurs\n"
                "- NOT ideal for VC funding (VCs generally won't invest in LLCs)\n\n"
                "**C-Corporation:**\n"
                "- The gold standard for VC-backed startups\n"
                "- Can issue multiple classes of stock (common, preferred)\n"
                "- Qualify for QSBS tax exclusion (up to $10M tax-free gain for investors)\n"
                "- Delaware C-Corp is the preferred choice of 90%+ of US startups\n\n"
                "**Recommendation:** If you plan to raise venture capital, incorporate as a Delaware C-Corp from day one."
            ),
            order_index=0,
            duration_minutes=30,
        ),
        models.Lesson(
            course_id=course2.id,
            title="EIN, Banking & Compliance Essentials",
            content=(
                "Once incorporated, you need to set up your financial and compliance infrastructure.\n\n"
                "**Employer Identification Number (EIN):**\n"
                "- Apply free at IRS.gov (takes 15 minutes online)\n"
                "- Required to open a business bank account\n"
                "- Needed before hiring employees or filing taxes\n\n"
                "**Business Banking:**\n"
                "- Open a dedicated business checking account immediately\n"
                "- Mercury, Relay, or Brex are popular with startups\n"
                "- Never mix personal and business funds\n\n"
                "**Annual Compliance:**\n"
                "- Delaware franchise tax due March 1 each year (~$400 minimum)\n"
                "- File annual report with your state\n"
                "- Use a registered agent service ($50–$150/year)\n\n"
                "**Accounting:** Use QuickBooks or Bench from day one. Clean books are essential for due diligence."
            ),
            order_index=1,
            duration_minutes=25,
        ),
        models.Lesson(
            course_id=course2.id,
            title="Visas, Work Authorization & Founder Equity",
            content=(
                "International founders face unique challenges around visas and work authorization "
                "when building a US company.\n\n"
                "**Common Visa Options for Founders:**\n"
                "- **O-1A Visa** — For individuals with extraordinary ability. Requires demonstrated "
                "achievements (publications, awards, high salary, critical role)\n"
                "- **EB-1A Green Card** — Permanent residence for extraordinary ability (no sponsor needed)\n"
                "- **EB-2 NIW** — National Interest Waiver — for work benefiting the US economy\n"
                "- **L-1A Visa** — If you have an existing company abroad and transfer as an executive\n\n"
                "**Founder Equity Basics:**\n"
                "- Use an 83(b) election within 30 days of receiving restricted stock\n"
                "- Standard vesting: 4 years with 1-year cliff\n"
                "- Issue founder shares at par value immediately after incorporation\n"
                "- Use a cap table tool like Carta from day one\n\n"
                "**Warning:** Never accept equity without a lawyer reviewing the documents. "
                "Mistakes here can cost you millions later."
            ),
            order_index=2,
            duration_minutes=35,
        ),
    ]

    db.add_all(lessons_c1 + lessons_c2)

    # ── Community Posts ───────────────────────────────────────────────────────
    post1 = models.CommunityPost(
        author_id=entrepreneur1.id,
        title="Tips for pitching to US investors as an international founder?",
        body=(
            "Hi everyone! I'm based in the US now but originally from Taiwan. I've been getting "
            "meetings with investors but I feel like there's a cultural gap in how I pitch. "
            "Any advice from founders who've successfully raised from American VCs? "
            "Specifically around storytelling style and how direct to be about financials."
        ),
        category="Fundraising",
        upvotes=12,
    )
    post2 = models.CommunityPost(
        author_id=entrepreneur2.id,
        title="Best banks for startup founders in 2024?",
        body=(
            "Looking for recommendations on business banking. I've heard good things about Mercury "
            "and Brex. Anyone have experience with both? Mainly need: no monthly fees, good ACH, "
            "and solid API for accounting integrations. Based in the US, Delaware C-Corp."
        ),
        category="Legal & Finance",
        upvotes=8,
    )
    post3 = models.CommunityPost(
        author_id=investor1.id,
        title="What we look for in early-stage climate tech pitches",
        body=(
            "As a partner at a climate-focused fund, I see hundreds of pitches per year. "
            "Here's what makes us excited:\n\n"
            "1. Team with domain expertise (ex-utility, ex-Tesla, PhD in relevant field)\n"
            "2. Clear path to 10x cost reduction or efficiency gain\n"
            "3. Hardware startups: show us a working prototype before asking for Series A\n"
            "4. Software/marketplace: we want to see GMV growth, not just user counts\n\n"
            "Happy to answer questions!"
        ),
        category="Investor Insights",
        upvotes=31,
    )

    db.add_all([post1, post2, post3])
    db.commit()

    # ── SPVs ─────────────────────────────────────────────────────────────────
    from datetime import datetime, timezone, timedelta

    spv1 = models.SPV(
        pitch_id=pitch1.id,
        lead_investor_id=investor1.id,
        title="EcoDeliver SPV I",
        description=(
            "A special purpose vehicle co-investing in EcoDeliver's $500K seed round alongside "
            "GreenCap Ventures. Focus on accelerating the company's city expansion and EV fleet buildout."
        ),
        target_amount=500000.0,
        committed_amount=185000.0,
        carry_pct=20.0,
        mgmt_fee_pct=2.0,
        min_check=10000.0,
        deadline=datetime.now(timezone.utc) + timedelta(days=60),
        status=models.SPVStatus.forming,
    )
    spv2 = models.SPV(
        pitch_id=pitch2.id,
        lead_investor_id=investor2.id,
        title="MedBridge SPV I",
        description=(
            "SPV co-investing in MedBridge's $750K seed round. David Park leads with focus on "
            "the digital health go-to-market and CMS certification milestone."
        ),
        target_amount=750000.0,
        committed_amount=320000.0,
        carry_pct=20.0,
        mgmt_fee_pct=2.0,
        min_check=5000.0,
        deadline=datetime.now(timezone.utc) + timedelta(days=45),
        status=models.SPVStatus.forming,
    )
    spv3 = models.SPV(
        pitch_id=pitch1.id,
        lead_investor_id=investor1.id,
        title="GreenTech Opportunities SPV",
        description=(
            "A fully funded SPV focused on green technology opportunities. "
            "This vehicle is now active and closed to new commitments."
        ),
        target_amount=250000.0,
        committed_amount=250000.0,
        carry_pct=20.0,
        mgmt_fee_pct=2.0,
        min_check=5000.0,
        deadline=None,
        status=models.SPVStatus.active,
    )

    db.add_all([spv1, spv2, spv3])
    db.commit()
    for s in [spv1, spv2, spv3]:
        db.refresh(s)

    # ── SPV Commitments ───────────────────────────────────────────────────────
    # SPV 1 (EcoDeliver): David commits $100K and Sarah gets $85K from another backer
    # We have david commit $100K and investor1 (sarah) commits $85K as a co-backer
    commitment1 = models.SPVCommitment(
        spv_id=spv1.id,
        investor_id=investor2.id,   # david commits to sarah's SPV
        amount=100000.0,
        status="committed",
    )
    commitment2 = models.SPVCommitment(
        spv_id=spv1.id,
        investor_id=investor1.id,   # sarah's own lead commitment
        amount=85000.0,
        status="funded",
    )

    # SPV 2 (MedBridge): Sarah commits $150K, david's own lead piece $170K
    commitment3 = models.SPVCommitment(
        spv_id=spv2.id,
        investor_id=investor1.id,   # sarah commits to david's SPV
        amount=150000.0,
        status="committed",
    )
    commitment4 = models.SPVCommitment(
        spv_id=spv2.id,
        investor_id=investor2.id,   # david's lead commitment
        amount=170000.0,
        status="funded",
    )

    # SPV 3 (GreenTech, active): both investors committed and are fully funded
    commitment5 = models.SPVCommitment(
        spv_id=spv3.id,
        investor_id=investor1.id,
        amount=150000.0,
        status="funded",
    )
    commitment6 = models.SPVCommitment(
        spv_id=spv3.id,
        investor_id=investor2.id,
        amount=100000.0,
        status="funded",
    )

    db.add_all([commitment1, commitment2, commitment3, commitment4, commitment5, commitment6])
    db.commit()

    print("Database seeded successfully!")
    print("\nSample accounts:")
    print("  Entrepreneur: maya@ecodeliver.com / password123")
    print("  Entrepreneur: james@medbridge.io / password123")
    print("  Investor:     sarah@greencap.vc / password123")
    print("  Investor:     david@fintechrising.com / password123")
    print("\nSPVs seeded:")
    print("  SPV 1: EcoDeliver SPV I (forming) — led by Sarah, $185K / $500K")
    print("  SPV 2: MedBridge SPV I (forming) — led by David, $320K / $750K")
    print("  SPV 3: GreenTech Opportunities SPV (active) — $250K / $250K")


if __name__ == "__main__":
    seed()
    db.close()
