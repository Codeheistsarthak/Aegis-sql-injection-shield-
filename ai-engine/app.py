from flask import Flask, request, jsonify
import pickle
import pandas as pd
from features import extract_features

app = Flask(__name__)

# 1. Load the Smart Brain
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("✅ Brain Loaded Successfully!")
except FileNotFoundError:
    print("❌ Error: model.pkl not found. Run train.py first!")
    model = None

@app.route('/')
def home():
    return "Aegis AI Brain is Running!"

# 2. The Prediction Route (This was missing!)
@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500
    
    data = request.json
    payload = data.get('payload', '')
    
    # 3. Analyze the Payload
    features = extract_features(payload)
    prediction = model.predict([features])[0]
    
    return jsonify({
        'is_threat': bool(prediction == 1),
        'confidence': 100 if prediction == 1 else 99
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)