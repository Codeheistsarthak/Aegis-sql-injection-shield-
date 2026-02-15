import re
import math

def get_entropy(text):
    if not text: return 0
    entropy = 0
    for x in range(256):
        p_x = float(text.count(chr(x))) / len(text)
        if p_x > 0:
            entropy += - p_x * math.log(p_x, 2)
    return entropy

def extract_features(payload):
    p_lower = payload.lower()
    return {
        'length': len(payload),
        'sql_keywords': len(re.findall(r'\b(select|union|insert|drop|update|from)\b', p_lower)),
        'suspicious_logic': len(re.findall(r'\b(or|and)\s+[\'\"\d]', p_lower)),
        'special_char_ratio': len(re.findall(r'[\'\";\-\-#\*]', payload)) / (len(payload) + 1),
        'entropy': get_entropy(payload)
    }