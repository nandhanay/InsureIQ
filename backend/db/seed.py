"""
Plan Seed Data
Auto-seeds the plans table with Indian insurance policies on startup.
Matches frontend mockPlans.ts exactly.
"""
from sqlalchemy.orm import Session
from models.plan import Plan


SEED_PLANS = [
    {
        "id": "plan-001",
        "name": "Star Comprehensive",
        "insurer": "Star Health Insurance",
        "plan_type": "Individual",
        "premium_min": 8500,
        "premium_max": 12400,
        "coverage": "₹5 Lakh",
        "coverage_amount": 500000,
        "csr": 72,
        "waiting_period_days": 730,
        "room_rent": "No cap (single private AC room)",
        "co_pay": "No co-pay",
        "day1_conditions": ["Accident", "Appendicitis", "Hernia (after 1 year)"],
        "exclusions": ["Cosmetic surgery", "Dental unless from accident", "Obesity treatment", "Congenital diseases"],
        "pros": ["No room rent cap", "High CSR", "Good network hospitals", "No co-pay clause"],
        "cons": ["2 year PED waiting", "Limited coverage amount", "No maternity in base plan"],
        "features": ["Cashless at 10,000+ hospitals", "Annual health check-up", "AYUSH treatment covered", "Day care procedures included"],
    },
    {
        "id": "plan-002",
        "name": "Optima Secure",
        "insurer": "HDFC Ergo",
        "plan_type": "Individual",
        "premium_min": 6800,
        "premium_max": 9200,
        "coverage": "₹10 Lakh",
        "coverage_amount": 1000000,
        "csr": 68,
        "waiting_period_days": 1095,
        "room_rent": "1% of sum insured per day",
        "co_pay": "20% co-pay above age 60",
        "day1_conditions": ["Road accident", "Animal bite", "Acute appendicitis"],
        "exclusions": ["Pre-existing diseases (3 yr wait)", "Self-inflicted injuries", "Sterility treatment", "Diabetes complications (partial)"],
        "pros": ["High sum insured", "Affordable premium", "Restore benefit", "Wide network"],
        "cons": ["Room rent cap", "Co-pay for seniors", "3 year PED wait", "Partial diabetes exclusions"],
        "features": ["Super no-claim bonus", "Restore benefit", "In-patient hospitalization", "Organ donor cover"],
    },
    {
        "id": "plan-003",
        "name": "Health Protector Plus",
        "insurer": "ICICI Lombard",
        "plan_type": "Family Floater",
        "premium_min": 12000,
        "premium_max": 18500,
        "coverage": "₹15 Lakh",
        "coverage_amount": 1500000,
        "csr": 65,
        "waiting_period_days": 1095,
        "room_rent": "Single private room",
        "co_pay": "No co-pay",
        "day1_conditions": ["Emergency hospitalization", "Fractures", "Acute infection"],
        "exclusions": ["Dental treatment", "Spectacles", "Vaccination", "Pre-existing (3 yr)", "Hypertension complications (Year 1)"],
        "pros": ["Family coverage", "High sum insured", "Good restoration", "Maternity included"],
        "cons": ["Higher premium", "3 year PED wait", "Some hypertension exclusions Year 1", "CSR below average"],
        "features": ["Maternity cover", "Newborn baby cover", "Ambulance charges", "Domiciliary treatment"],
    },
    {
        "id": "plan-004",
        "name": "Arogya Sanjeevani",
        "insurer": "National Insurance",
        "plan_type": "Individual",
        "premium_min": 4200,
        "premium_max": 5800,
        "coverage": "₹5 Lakh",
        "coverage_amount": 500000,
        "csr": 82,
        "waiting_period_days": 1460,
        "room_rent": "2% of sum insured per day",
        "co_pay": "5% co-pay on all claims",
        "day1_conditions": ["Accident hospitalization"],
        "exclusions": ["Pre-existing (4 yr wait)", "Mental illness", "Infertility", "External prosthetics"],
        "pros": ["Lowest premium", "Highest CSR", "Government-backed", "Standardized plan"],
        "cons": ["Room rent cap", "Mandatory 5% co-pay", "4 year PED wait", "Basic coverage"],
        "features": ["IRDAI standardized", "Cataract cover", "AYUSH treatment", "Day care procedures"],
    },
    {
        "id": "plan-005",
        "name": "Activ Health Platinum",
        "insurer": "Aditya Birla Health",
        "plan_type": "Individual",
        "premium_min": 15000,
        "premium_max": 22000,
        "coverage": "₹1 Crore",
        "coverage_amount": 10000000,
        "csr": 58,
        "waiting_period_days": 730,
        "room_rent": "No cap",
        "co_pay": "No co-pay",
        "day1_conditions": ["All accidents", "Acute conditions", "Vector-borne diseases"],
        "exclusions": ["Cosmetic procedures", "War-related injuries", "Adventure sports injuries"],
        "pros": ["Very high coverage", "No room rent cap", "Chronic management", "Wellness rewards"],
        "cons": ["Expensive premium", "Lower CSR", "Complex claim process", "Premium high for young users"],
        "features": ["Chronic disease management", "Health returns program", "Global coverage", "Mental health consultation", "Wellness coaches"],
    },
    {
        "id": "plan-006",
        "name": "iHealth Plus",
        "insurer": "Bajaj Allianz",
        "plan_type": "Individual",
        "premium_min": 7500,
        "premium_max": 11000,
        "coverage": "₹10 Lakh",
        "coverage_amount": 1000000,
        "csr": 70,
        "waiting_period_days": 1095,
        "room_rent": "No cap (up to ₹10L SI)",
        "co_pay": "No co-pay up to age 55",
        "day1_conditions": ["Accident", "Dengue", "Malaria", "Appendicitis"],
        "exclusions": ["Pre-existing (3 yr)", "Weight management", "Dental unless accidental", "Congenital anomalies"],
        "pros": ["No room cap up to ₹10L", "Good CSR", "Cashless network", "Competitive pricing"],
        "cons": ["Co-pay after 55", "3 yr PED wait", "Limited mental health", "No maternity"],
        "features": ["E-consultation", "Second opinion", "Annual health check", "Ambulance cover"],
    },
    {
        "id": "plan-007",
        "name": "Care Supreme",
        "insurer": "Care Health Insurance",
        "plan_type": "Individual",
        "premium_min": 9200,
        "premium_max": 13500,
        "coverage": "₹25 Lakh",
        "coverage_amount": 2500000,
        "csr": 61,
        "waiting_period_days": 1095,
        "room_rent": "No cap",
        "co_pay": "No co-pay",
        "day1_conditions": ["All emergencies", "Cardiac emergencies", "Stroke"],
        "exclusions": ["Pre-existing (3 yr)", "Cosmetic", "Obesity", "Self-harm"],
        "pros": ["High coverage", "No room rent cap", "No co-pay", "Cardiac day-1"],
        "cons": ["Lower CSR", "3 yr PED", "Network still growing", "Claim TAT variable"],
        "features": ["Unlimited restoration", "Air ambulance", "No-claim bonus 50%", "Domiciliary treatment"],
    },
    {
        "id": "plan-008",
        "name": "ManipalCigna ProHealth Plus",
        "insurer": "ManipalCigna",
        "plan_type": "Family Floater",
        "premium_min": 14000,
        "premium_max": 21000,
        "coverage": "₹15 Lakh",
        "coverage_amount": 1500000,
        "csr": 64,
        "waiting_period_days": 730,
        "room_rent": "Single private AC room",
        "co_pay": "No co-pay",
        "day1_conditions": ["Accidents", "Acute gastroenteritis", "Dengue"],
        "exclusions": ["Pre-existing (2 yr)", "Cosmetic", "Dental general", "Substance abuse treatment"],
        "pros": ["Only 2 yr PED wait", "Family coverage", "Maternity benefit", "Wellness benefits"],
        "cons": ["Higher premium", "CSR below average", "Smaller network", "Claims process complex"],
        "features": ["Maternity cover", "OPD cover", "International second opinion", "Preventive health check"],
    },
    {
        "id": "plan-009",
        "name": "Super Top Up",
        "insurer": "Niva Bupa",
        "plan_type": "Top-Up",
        "premium_min": 3200,
        "premium_max": 4800,
        "coverage": "₹50 Lakh (deductible ₹5L)",
        "coverage_amount": 5000000,
        "csr": 55,
        "waiting_period_days": 1095,
        "room_rent": "No cap",
        "co_pay": "No co-pay",
        "day1_conditions": ["Accidents", "Emergency surgery"],
        "exclusions": ["Pre-existing (3 yr)", "Claims below deductible", "Non-allopathic treatment"],
        "pros": ["Very low premium", "High coverage ceiling", "No room cap", "Good for supplement"],
        "cons": ["₹5L deductible", "Low CSR", "Not standalone", "Limited day-1 coverage"],
        "features": ["Super no-claim bonus", "Deductible can be base policy", "Cashless network"],
    },
    {
        "id": "plan-010",
        "name": "Diabetes Safe",
        "insurer": "Star Health Insurance",
        "plan_type": "Condition-Specific",
        "premium_min": 11000,
        "premium_max": 16500,
        "coverage": "₹10 Lakh",
        "coverage_amount": 1000000,
        "csr": 72,
        "waiting_period_days": 365,
        "room_rent": "No cap",
        "co_pay": "10% co-pay on diabetes-related claims",
        "day1_conditions": ["Diabetic emergencies", "Accidents", "Acute infections"],
        "exclusions": ["Insulin pump (Year 1)", "Cosmetic", "Weight loss surgery"],
        "pros": ["Diabetes-friendly", "Only 1 yr wait", "Covers diabetes complications", "Good CSR"],
        "cons": ["10% co-pay on diabetes claims", "Higher premium", "Condition-specific", "Limited to diabetics"],
        "features": ["Diabetes management program", "HbA1c monitoring", "Nutritionist consultation", "Foot care cover", "Eye screening"],
    },
]


def seed_plans(db: Session):
    """Seed the plans table if empty."""
    existing_count = db.query(Plan).count()
    if existing_count > 0:
        return  # Already seeded

    for plan_data in SEED_PLANS:
        plan = Plan(**plan_data)
        db.add(plan)

    db.commit()
    print(f"✅ Seeded {len(SEED_PLANS)} insurance plans")


def seed_judge_user(db: Session):
    """Seed the judge user and user profile if not present."""
    from models.user import User
    from models.profile import UserProfile
    from core.security import get_password_hash

    # Check if judge user exists
    judge_email = "judge@insureiq.ai"
    judge = db.query(User).filter(User.email == judge_email).first()
    if not judge:
        hashed = get_password_hash("InsurIQ2026!")
        judge = User(
            full_name="Judge Demo User",
            email=judge_email,
            hashed_password=hashed
        )
        db.add(judge)
        db.commit()
        db.refresh(judge)
        print("✅ Seeded judge demo user")

    # Check if judge profile exists
    profile = db.query(UserProfile).filter(UserProfile.user_id == judge.id).first()
    if not profile:
        profile = UserProfile(
            user_id=judge.id,
            age=36,
            gender="Male",
            city="Bangalore",
            state="Karnataka",
            marital_status="Married",
            dependants=2,
            income_bracket="10-20",
            existing_coverage="None",
            monthly_budget=2500,
            height=175.0,
            weight=78.0,
            bmi=25.5,
            smoking=False,
            alcohol=True,
            chronic_conditions=["Type 2 Diabetes"],
            family_history=["Diabetes", "Hypertension"],
            past_surgeries="Appendectomy in 2018",
            documents_uploaded=True,
            risk_score=48.5,
            risk_tier="Moderate",
            risk_factors=[
                {"label": "Chronic: Diabetes", "value": 0.25},
                {"label": "Age (36)", "value": 0.12},
                {"label": "Family History: Diabetes", "value": 0.10},
                {"label": "BMI (25.5)", "value": 0.08},
                {"label": "Alcohol use", "value": 0.05}
            ]
        )
        db.add(profile)
        db.commit()
        print("✅ Seeded judge demo profile")

