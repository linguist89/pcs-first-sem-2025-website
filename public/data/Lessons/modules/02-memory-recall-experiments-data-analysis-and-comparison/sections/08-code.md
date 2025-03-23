---
type: "code"

---

list1 = ["apple", "banana", "cherry", "date"]
list2 = ["banana", "cherry", "fig", "grape"]

results = {
    "matches": len([item for item in list2 if item in list1]),
    "missing": [item for item in list1 if item not in list2],
    "new": [item for item in list2 if item not in list1]
}

print(results)