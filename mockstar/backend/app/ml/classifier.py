import os
import joblib
import re

# Resolve paths for the trained model files
MODEL_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(MODEL_DIR, "domain_classifier.pkl")
VECTORIZER_PATH = os.path.join(MODEL_DIR, "vectorizer.pkl")

class DomainClassifier:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.load_model()

    def load_model(self):
        """Attempts to load the serialized ML model and TF-IDF Vectorizer."""
        try:
            if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
                self.model = joblib.load(MODEL_PATH)
                self.vectorizer = joblib.load(VECTORIZER_PATH)
                print("ML Domain Classifier: Model and Vectorizer loaded successfully.")
            else:
                print("ML Domain Classifier: Serialized model files not found. Fallback heuristic will be used.")
        except Exception as e:
            print(f"ML Domain Classifier: Error loading model files ({e}). Using heuristic fallback.")

    def _fallback_heuristic(self, text: str) -> str:
        """A keyword-based heuristic fallback if the model is not yet trained."""
        text_lower = text.lower()
        
        # Word counts/occurrences
        frontend_score = len(re.findall(r"\b(react|vue|angular|css|html|frontend|tailwind|ui|ux|javascript|typescript|nextjs|vite)\b", text_lower))
        backend_score = len(re.findall(r"\b(node|express|django|fastapi|flask|spring|backend|sql|postgresql|mongodb|docker|kubernetes|aws|api|rest)\b", text_lower))
        datascience_score = len(re.findall(r"\b(python|machine learning|tensorflow|pytorch|data science|nlp|pandas|numpy|scikit|ai|deep learning|statistics)\b", text_lower))
        mobile_score = len(re.findall(r"\b(flutter|react native|swift|kotlin|ios|android|mobile)\b", text_lower))
        
        scores = {
            "Frontend Development": frontend_score,
            "Backend Development": backend_score,
            "Data Science & AI": datascience_score,
            "Mobile Development": mobile_score
        }
        
        # Get domain with highest score, default to general if no keywords found
        max_domain = max(scores, key=scores.get)
        if scores[max_domain] > 0:
            return max_domain
        return "General Software Engineering"

    def predict(self, text: str) -> str:
        """
        Predicts the professional domain of a candidate based on resume text content.
        Uses the ML model if available, otherwise falls back to keyword heuristic.
        """
        if not text or not text.strip():
            return "General Software Engineering"
            
        if self.model and self.vectorizer:
            try:
                # Transform input text
                features = self.vectorizer.transform([text])
                prediction = self.model.predict(features)[0]
                return prediction
            except Exception as e:
                print(f"ML Domain Classifier: Prediction error ({e}). Using heuristic fallback.")
                return self._fallback_heuristic(text)
        else:
            return self._fallback_heuristic(text)

# Singleton instance
classifier = DomainClassifier()
