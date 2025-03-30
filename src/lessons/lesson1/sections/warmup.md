---
title: Warm-up code-a-long
type: warmup
---

Let's start with some basic exercises to get familiar with the concepts we'll be using throughout this lesson.

## Reading from a file and splitting data

```python
# Open a file and read its contents
with open('warmup.txt', 'w') as f:
    f.write("1, 2, 3, 4, 5")
with open('warmup.txt', 'r') as file:
    data_string = file.read()
# Split the string into a list of numbers
data_list = data_string.split(", ")
print(data_list)
```

## Filtering numeric values

```python
data = ["1", "a", "2", "b", "3"]
numeric_data = []
for item in data:
    if item.isdigit():
        numeric_data.append(int(item))
print(numeric_data)
```

## Calculating average and standard deviation

```python
import math

numbers = [1, 2, 3, 4, 5]
average = sum(numbers) / len(numbers)
variance = sum([(x - average)**2 for x in numbers]) / len(numbers)
std_dev = math.sqrt(variance)
print(f"Average: {average}, Standard Deviation: {std_dev}")
```

## Creating a dictionary

```python
data = {"name": "Alice", "age": 30, "city": "New York"}
print(data["name"])
data["job"] = "Engineer"
print(data)
``` 