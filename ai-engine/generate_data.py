import pandas as pd
import random

# 1. Define Patterns
sql_patterns = [
    "' OR 1=1 --", "' OR 'a'='a", "UNION SELECT", "DROP TABLE users",
    "SELECT * FROM", "admin' --", "1; DELETE FROM items",
    "benchmark(10000000,MD5(1))", "pg_sleep(10)", "' OR 1=1 #",
    "admin'/*", "' OR '1'='1' --", "admin' OR '1'='1"
]

safe_patterns = [
    "admin", "user", "password", "sarthak", "login", "home", "dashboard",
    "search", "email@example.com", "123456", "qwerty", "hello world",
    "my_image.png", "contact-us", "about page", "profile id 10",
    "checkout", "payment success", "react_app", "node_js"
]

# 2. Generate 2000 Examples
data = []

# Generate Attacks (Label 1)
for _ in range(1000):
    attack = random.choice(sql_patterns)
    # Add random variations
    if random.random() > 0.5:
        attack = attack.lower()
    if random.random() > 0.7:
        attack = attack + " " + str(random.randint(1, 100))
    data.append([attack, 1])

# Generate Safe Traffic (Label 0)
for _ in range(1000):
    safe = random.choice(safe_patterns)
    # Add random variations
    if random.random() > 0.5:
        safe = safe + str(random.randint(1, 999))
    if random.random() > 0.3:
        safe = safe.upper()
    data.append([safe, 0])

# 3. Save to CSV
df = pd.DataFrame(data, columns=['payload', 'label'])
df.to_csv('dataset.csv', index=False)
print("✅ Generated dataset.csv with 2000 examples!")