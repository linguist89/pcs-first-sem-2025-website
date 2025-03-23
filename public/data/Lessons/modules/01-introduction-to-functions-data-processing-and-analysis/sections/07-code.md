---
type: "code"

---

import math

numbers = [1, 2, 3, 4, 5]
average = sum(numbers) / len(numbers)
variance = sum([(x - average)**2 for x in numbers]) / len(numbers)
std_dev = math.sqrt(variance)
print(f"Average: {average}, Standard Deviation: {std_dev}")