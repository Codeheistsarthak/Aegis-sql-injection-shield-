import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction import DictVectorizer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
# This imports the math logic you already have in features.py
from features import extract_features

print("Loading Dataset from CSV...")

# 1. Load the generated dataset
try:
    df = pd.read_csv('dataset.csv')
    print(f"✅ Loaded {len(df)} examples from dataset.csv")
except FileNotFoundError:
    print("❌ Error: dataset.csv not found. Run 'python generate_data.py' first!")
    exit()

# 2. Prepare Features (The "Math" part)
print("Extracting features... (This may take a moment)")
# We apply the extract_features function to every single payload in the CSV
features = [extract_features(str(row)) for row in df['payload']]
labels = df['label']

# 3. Split Data: 80% for Training, 20% for Testing
# This allows us to prove the accuracy to the interviewer
X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

# 4. Build the Brain (Random Forest)
pipeline = Pipeline([
    ('vectorizer', DictVectorizer(sparse=False)),
    ('classifier', RandomForestClassifier(n_estimators=100))
])

# 5. Train the Model
print("Training the Brain...")
pipeline.fit(X_train, y_train)

# 6. Test and Report Accuracy
print("Testing accuracy...")
predictions = pipeline.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"✅ Success! Model Accuracy: {accuracy * 100:.2f}%")

# 7. Save the new brain
with open('model.pkl', 'wb') as f:
    pickle.dump(pipeline, f)
print("💾 Model saved to model.pkl")