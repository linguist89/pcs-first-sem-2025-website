---
type: "code"

---

original = ["Apple", "Orange", "Banana"]
recalled = ["apple", "orange", "Grape"]
correct_matches = 0

for item in recalled:
    if item.lower() in [x.lower() for x in original]:
        correct_matches += 1

print(f"Correct matches: {correct_matches}")