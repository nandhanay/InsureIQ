"""
Offline ML Training Script for Premium Growth Forecasting
Trains a Gradient Boosting Regressor model to project health insurance premium escalation curves.
Saves model to backend/ml/models/premium_gbm.pkl.
"""
import os
import pickle
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor

# Ensure output directory exists
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODELS_DIR, "premium_gbm.pkl")

def generate_synthetic_data(num_samples: int = 3000) -> tuple:
    """Generate mock features and premium compound growth rates for year 5."""
    np.random.seed(101)
    
    # Features: age, bmi, smoking, alcohol, base_premium, risk_score
    age = np.random.randint(18, 75, size=num_samples)
    bmi = np.random.normal(26, 6, size=num_samples)
    bmi = np.clip(bmi, 15, 45)
    smoking = np.random.choice([0, 1], p=[0.8, 0.2], size=num_samples)
    alcohol = np.random.choice([0, 1], p=[0.6, 0.4], size=num_samples)
    base_premium = np.random.randint(5000, 30000, size=num_samples)
    risk_score = np.clip((age - 18) * 0.5 + (bmi - 20) * 1.2 + smoking * 15 + alcohol * 5, 0, 100)
    
    X = np.stack([age, bmi, smoking, alcohol, base_premium, risk_score], axis=1)
    
    # Target: Compound growth rate at year 5 (e.g. 1.20 to 1.70 multiplier)
    # Higher risk score and age leads to steeper premium escalations
    y_growth = 1.20 + (risk_score / 100.0) * 0.35 + (age / 75.0) * 0.15
    y_growth = np.clip(y_growth, 1.10, 1.80)
    
    return X, y_growth

def train_and_save():
    print("Generating premium forecasting datasets...")
    X, y = generate_synthetic_data(3000)
    
    print("Training Gradient Boosting Regressor for compound premium escalation curves...")
    reg = GradientBoostingRegressor(
        n_estimators=80,
        learning_rate=0.1,
        max_depth=3,
        random_state=42
    )
    reg.fit(X, y)
    
    score = reg.score(X, y)
    print(f"Model trained successfully. R2 Score: {score:.4f}")
    
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(reg, f)
    print(f"✅ Serialized premium growth model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_and_save()
