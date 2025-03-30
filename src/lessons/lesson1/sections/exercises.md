---
title: Exercises
type: exercise
---

## Basic Data Analysis

Load the data from `eye_tracking_data.txt`. How many valid gaze durations (numeric values) are greater than 600 milliseconds?

**Difficulty:** Beginner

```python
# Your code here

# Remember to:
# 1. Open and read the file
# 2. Split the data
# 3. Filter out non-numeric values
# 4. Count values > 600
```

**Solution:**

```python
# Count gaze durations > 600ms
with open('eye_tracking_data.txt', 'r') as file:
    data_string = file.read()

# Split by commas
data_list = data_string.split(',')

# Clean and convert to numbers
valid_durations = []
for item in data_list:
    item = item.strip()
    if item.isdigit():
        valid_durations.append(int(item))

# Count values > 600
longer_gazes = [d for d in valid_durations if d > 600]
print(f"Number of gaze durations > 600ms: {len(longer_gazes)}")
# Answer: 14
```

## Creating an Analysis Function

Write a Python function `analyze_gaze_data(filename)` that loads the data, cleans it (handling 'NA', 'nA', 'error', and 'NaN' entries), and returns the percentage of valid gaze durations that are greater than 600 milliseconds.

**Difficulty:** Intermediate

```python
def analyze_gaze_data(filename):
    # Your code here
    
    # Steps:
    # 1. Read the file
    # 2. Clean the data (remove NA, nA, error, NaN)
    # 3. Convert to numbers
    # 4. Calculate percentage of values > 600ms
    
    return percentage

# Test your function
result = analyze_gaze_data('eye_tracking_data.txt')
print(f"Percentage of long gazes: {result}%")
```

**Solution:**

```python
def analyze_gaze_data(filename):
    # Read the file
    with open(filename, 'r') as file:
        data_string = file.read()
    
    # Split by commas
    data_list = data_string.split(',')
    
    # Clean the data
    valid_durations = []
    invalid_values = ['NA', 'nA', 'error', 'NaN']
    
    for item in data_list:
        item = item.strip()
        if item not in invalid_values and item.isdigit():
            valid_durations.append(int(item))
    
    # Count values > 600ms
    long_gazes = [d for d in valid_durations if d > 600]
    
    # Calculate percentage
    percentage = (len(long_gazes) / len(valid_durations)) * 100
    return round(percentage, 1)

# Test the function
result = analyze_gaze_data('eye_tracking_data.txt')
print(f"Percentage of long gazes: {result}%")
# Answer: Approximately 35.0%
```

## Advanced Statistics Function

Load the data from `eye_tracking_data.txt`. Write a Python function `gaze_analysis_stats(filename)` that cleans the data and returns a dictionary containing the number of valid gaze durations, the average gaze duration, and the standard deviation of gaze durations greater than 600 milliseconds.

**Difficulty:** Advanced

```python
def gaze_analysis_stats(filename):
    # Your code here
    
    # Steps:
    # 1. Read and clean the data
    # 2. Calculate total valid count
    # 3. Calculate average of all valid data
    # 4. Calculate standard deviation of gazes > 600ms
    # 5. Return results in a dictionary
    
    return stats

# Test your function
results = gaze_analysis_stats('eye_tracking_data.txt')
print(results)
```

**Solution:**

```python
import math

def gaze_analysis_stats(filename):
    # Read the file
    with open(filename, 'r') as file:
        data_string = file.read()
    
    # Split and clean the data
    data_list = data_string.split(',')
    invalid_values = ['NA', 'nA', 'error', 'NaN']
    
    valid_durations = []
    for item in data_list:
        item = item.strip()
        if item not in invalid_values and item.isdigit():
            valid_durations.append(int(item))
    
    # Calculate statistics
    valid_count = len(valid_durations)
    average = sum(valid_durations) / valid_count if valid_count > 0 else 0
    
    # Find gazes > 600ms
    long_gazes = [d for d in valid_durations if d > 600]
    
    # Calculate standard deviation of long gazes
    if len(long_gazes) > 0:
        long_avg = sum(long_gazes) / len(long_gazes)
        variance = sum([(x - long_avg)**2 for x in long_gazes]) / len(long_gazes)
        std_dev = round(math.sqrt(variance), 1)
    else:
        std_dev = 0
    
    stats = {
        'valid_count': valid_count,
        'average': round(average, 2),
        'std_dev': std_dev
    }
    
    return stats

# Test the function
results = gaze_analysis_stats('eye_tracking_data.txt')
print(results)
# Answer: A dictionary similar to: {'valid_count': 36, 'average': 547.22, 'std_dev': 141.5}
``` 