---
type: "code"

---

# Open a file and read its contents
with open('warmup.txt', 'w') as f:
    f.write("red, green, blue\nyellow, red, purple")
with open('warmup.txt', 'r') as file:
    lines = file.readlines()
list1 = lines[0].strip().split(", ")
list2 = lines[1].strip().split(", ")
print(list1)
print(list2)