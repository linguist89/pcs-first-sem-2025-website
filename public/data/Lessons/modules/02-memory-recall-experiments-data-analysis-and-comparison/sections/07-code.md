---
type: "code"

---

list1 = ["apple", "banana", "cherry", "date"]
list2 = ["banana", "cherry", "fig", "grape"]

missing_items = [item for item in list1 if item not in list2]
new_items = [item for item in list2 if item not in list1]

print(f"Missing from list2: {missing_items}")
print(f"New in list2: {new_items}")