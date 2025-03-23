---
type: "code"

---

data = ["1", "a", "2", "b", "3"]
numeric_data = []
for item in data:
    if item.isdigit():
        numeric_data.append(int(item))
print(numeric_data)