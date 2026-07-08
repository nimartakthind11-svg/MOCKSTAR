import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Define some basic training samples representing different domains
TRAINING_DATA = [
    # Frontend Development
    ("React, HTML, CSS, JavaScript developer, styled-components, responsive design, Redux, frontend engineer, Vue, Angular, frontend web apps, TypeScript", "Frontend Development"),
    ("Senior UI developer specialized in React, Next.js, tailwindcss, CSS grids, frontend performance optimization, single page applications", "Frontend Development"),
    ("Frontend dev building user interfaces with HTML5, CSS3, ES6 JavaScript, Sass, webpack, component-based architectures, and cross-browser layouts", "Frontend Development"),
    
    # Backend Development
    ("Backend software engineer with experience in Node.js, Express, Postgres, MongoDB, Docker, REST APIs, Microservices, and Redis", "Backend Development"),
    ("Python developer building backend systems with FastAPI, Django, PostgreSQL, relational databases, migrations, AWS, and server deployment", "Backend Development"),
    ("Java developer building high-throughput backends, Spring Boot, Spring Cloud, Hibernate, SQL queries, database indexing, message queues, RabbitMQ", "Backend Development"),
    
    # Data Science & AI
    ("Data scientist with strong skills in Python, Machine Learning, Scikit-Learn, Pandas, NumPy, regression models, classification, Deep Learning, PyTorch", "Data Science & AI"),
    ("AI research engineer working on NLP, LLMs, computer vision, TensorFlow, PyTorch, Jupyter notebooks, model training, and data visualization", "Data Science & AI"),
    ("Data analyst writing Python scripts, matplotlib, seaborn, SQL queries, data warehousing, statistical analysis, scikit-learn classifiers", "Data Science & AI"),

    # Mobile Development
    ("Mobile application engineer building iOS and Android applications with Flutter, Dart, state management, Provider, BLoC, and mobile UI design", "Mobile Development"),
    ("React Native developer building cross-platform mobile apps, Xcode, Android Studio, push notifications, native modules, mobile builds", "Mobile Development"),
    ("Swift iOS developer, UIKit, SwiftUI, core data, custom mobile transitions, publishing to Apple App Store", "Mobile Development")
]

def train_model():
    print("Training ML Domain Classifier...")
    
    texts = [item[0] for item in TRAINING_DATA]
    labels = [item[1] for item in TRAINING_DATA]
    
    # Create and fit TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(stop_words='english', min_df=1)
    x_train = vectorizer.fit_transform(texts)
    
    # Train Logistic Regression model
    model = LogisticRegression(C=1.0, max_iter=200)
    model.fit(x_train, labels)
    
    # Define save paths
    current_dir = os.path.dirname(__file__)
    model_path = os.path.join(current_dir, "domain_classifier.pkl")
    vectorizer_path = os.path.join(current_dir, "vectorizer.pkl")
    
    # Save serialize objects
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    
    print(f"Success! Saved vectorizer to {vectorizer_path}")
    print(f"Success! Saved model to {model_path}")

if __name__ == "__main__":
    train_model()
