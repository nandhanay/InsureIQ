"""
Offline ML Training Script for Health Risk Prediction
Synthesizes a patient dataset and trains a Gradient Boosting Classifier.
Saves the serialized model to backend/ml/models/risk_clf.pkl.
"""
import os
import pickle
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

# Ensure output directory exists
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODELS_DIR, "risk_clf.pkl")

def generate_synthetic_data(num_samples: int = 5000) -> tuple:
    """Generate a realistic dataset for training."""
    np.random.seed(42)
    
    # 1. Age (18 to 75)
    age = np.random.randint(18, 76, size=num_samples)
    
    # 2. BMI (15 to 45)
    bmi = np.random.normal(26, 6, size=num_samples)
    bmi = np.clip(bmi, 15, 45)
    
    # 3. Smoking (0 or 1, 20% smokers)
    smoking = np.random.choice([0, 1], p=[0.8, 0.2], size=num_samples)
    
    # 4. Alcohol (0 or 1, 40% drinkers)
    alcohol = np.random.choice([0, 1], p=[0.6, 0.4], size=num_samples)
    
    # 5. Chronic condition indicators (0 or 1)
    has_diabetes = np.zeros(num_samples)
    has_hypertension = np.zeros(num_samples)
    has_cholesterol = np.zeros(num_samples)
    has_heart = np.zeros(num_samples)
    
    # Apply correlation logic: older age and high BMI increase condition risk
    for i in range(num_samples):
        # Diabetes probability
        p_diab = 0.02 + (0.15 if age[i] > 45 else 0) + (0.20 if bmi[i] > 30 else 0) + (0.05 if smoking[i] else 0)
        has_diabetes[i] = np.random.choice([0, 1], p=[max(0.0, 1.0 - p_diab), min(1.0, p_diab)])
        
        # Hypertension probability
        p_hyp = 0.05 + (0.20 if age[i] > 50 else 0) + (0.15 if bmi[i] > 28 else 0)
        has_hypertension[i] = np.random.choice([0, 1], p=[max(0.0, 1.0 - p_hyp), min(1.0, p_hyp)])
        
        # Cholesterol probability
        p_chol = 0.08 + (0.10 if age[i] > 40 else 0) + (0.15 if bmi[i] > 27 else 0)
        has_cholesterol[i] = np.random.choice([0, 1], p=[max(0.0, 1.0 - p_chol), min(1.0, p_chol)])
        
        # Heart disease probability
        p_heart = 0.01 + (0.10 if age[i] > 60 else 0) + (0.08 if has_hypertension[i] else 0) + (0.05 if smoking[i] else 0)
        has_heart[i] = np.random.choice([0, 1], p=[max(0.0, 1.0 - p_heart), min(1.0, p_heart)])
        
    num_conditions = has_diabetes + has_hypertension + has_cholesterol + has_heart
    
    # 6. Family history (0 to 3)
    num_family_history = np.random.choice([0, 1, 2, 3], p=[0.5, 0.35, 0.12, 0.03], size=num_samples)
    
    X = np.stack([
        age, bmi, smoking, alcohol, num_conditions,
        num_family_history, has_diabetes, has_hypertension,
        has_cholesterol, has_heart
    ], axis=1)
    
    # Calculate a continuous risk scoring mapping to ground truth target probability
    # Base risk is 10%
    y_prob = 0.10
    y_prob += (age - 18) / 120.0  # Age up to +47%
    y_prob += (bmi - 18) / 60.0   # BMI up to +45%
    y_prob += smoking * 0.15      # Smoking +15%
    y_prob += alcohol * 0.05      # Alcohol +5%
    y_prob += has_diabetes * 0.15 # Diabetes +15%
    y_prob += has_hypertension * 0.10 # Hypertension +10%
    y_prob += has_cholesterol * 0.08  # Cholesterol +8%
    y_prob += has_heart * 0.18        # Heart +18%
    y_prob += num_family_history * 0.05 # Family history +5% each
    
    # Clip and threshold
    y_prob = np.clip(y_prob, 0.0, 1.0)
    y = np.array([np.random.choice([0, 1], p=[1 - p, p]) for p in y_prob])
    
    return X, y

def train_and_save():
    print("Synthesizing patient risk cohort data...")
    X, y = generate_synthetic_data(5000)
    
    print(f"Training Gradient Boosting Classifier on {X.shape[0]} profiles...")
    clf = GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.08,
        max_depth=4,
        random_state=42
    )
    clf.fit(X, y)
    
    accuracy = clf.score(X, y)
    print(f"Model trained successfully. Train Accuracy: {accuracy:.4f}")
    
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(clf, f)
    print(f"✅ Serialized model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_and_save()
