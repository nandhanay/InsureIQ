from sqlalchemy import Column, Integer, String, Float, JSON
from core.database import Base


class Plan(Base):
    __tablename__ = "plans"

    id = Column(String, primary_key=True, index=True)  # e.g. "plan-001"
    name = Column(String, nullable=False)
    insurer = Column(String, nullable=False)
    plan_type = Column(String, nullable=False)  # Individual, Family Floater, Top-Up, Condition-Specific
    premium_min = Column(Float, nullable=False)
    premium_max = Column(Float, nullable=False)
    coverage = Column(String, nullable=False)  # e.g. "₹5 Lakh"
    coverage_amount = Column(Float, nullable=False)  # e.g. 500000
    csr = Column(Float, nullable=False)  # Claim Settlement Ratio
    waiting_period_days = Column(Integer, nullable=False)
    room_rent = Column(String, nullable=False)
    co_pay = Column(String, nullable=False)
    day1_conditions = Column(JSON, default=[])
    exclusions = Column(JSON, default=[])
    pros = Column(JSON, default=[])
    cons = Column(JSON, default=[])
    features = Column(JSON, default=[])
