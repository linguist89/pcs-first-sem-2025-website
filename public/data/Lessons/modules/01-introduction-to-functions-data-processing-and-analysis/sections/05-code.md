---
type: "code"

---

# Open a file and read its contents
with open('warmup.txt', 'w') as f:
    f.write("1, 2, 3, 4, 5")
with open('warmup.txt', 'r') as file:
    data_string = file.read()
# Split the string into a list of numbers
data_list = data_string.split(", ")
print(data_list)