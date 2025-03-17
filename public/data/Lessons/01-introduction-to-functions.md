---
title: "Introduction to Functions: Data Processing and Analysis"
topics:
  - File I/O operations
  - String parsing and manipulation
  - Creating and using functions
  - Data filtering and validation
  - Basic statistical calculations
  - List comprehensions
  - Dictionaries
difficulty: Beginner to Advanced
---

## Warm-up code-a-long

1.  **Reading from a file and splitting data:**
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
2.  **Filtering numeric values:**
    ```python
    data = ["1", "a", "2", "b", "3"]
    numeric_data = []
    for item in data:
        if item.isdigit():
            numeric_data.append(int(item))
    print(numeric_data)
    ```
3.  **Calculating average and standard deviation:**
    ```python
    import math

    numbers = [1, 2, 3, 4, 5]
    average = sum(numbers) / len(numbers)
    variance = sum([(x - average)**2 for x in numbers]) / len(numbers)
    std_dev = math.sqrt(variance)
    print(f"Average: {average}, Standard Deviation: {std_dev}")
    ```
4.  **Creating a dictionary:**
    ```python
    data = {"name": "Alice", "age": 30, "city": "New York"}
    print(data["name"])
    data["job"] = "Engineer"
    print(data)
    ```

# Scenario
Sarah, the team lead, approached Mark with a file in hand. "Mark, we've got this eye-tracking data," she said, placing the file on his desk. "It's a bit of a mess, but we need to figure out how long users are looking at different parts of our interface. We're hoping to find patterns – like, what's catching their attention? Can you clean this up and give us some basic stats? We need to know the number of valid data points, the average gaze duration, and the variability of longer gazes." She added, "Let's start simple and build up from there."

# Scenario highlighted
Sarah, the team lead, approached Mark with a file in hand. "Mark, we've got this eye-tracking data," she said, placing the file on his desk. "It's a bit of a mess, but we need to figure out [1 how long users are looking at different parts of our interface]. [2 We're hoping to find patterns] – like, what's catching their attention? Can you clean this up and give us some basic stats? [3 We need to know the number of valid data points, the average gaze duration, and the variability of longer gazes]." She added, "Let's start simple and build up from there."

## Objective
Sarah wants Mark to analyze eye-tracking data to understand user attention. To do this, Mark needs to:

1.  **Clean the data:** Remove invalid entries like "NA", "error", and "NaN".
2.  **Calculate basic statistics:** Find the number of valid data points, the average gaze duration, and the standard deviation of longer gaze durations.
3.  **Identify patterns:** Determine what parts of the interface are holding user attention.

Therefore, the main question is: **How can we clean and analyze the provided eye-tracking data to understand user attention and identify patterns in gaze duration?**

## Questions, hints, and answers

### Beginner
-   **Question:** "Load the data from `eye_tracking_data.txt`. How many valid gaze durations (numeric values) are greater than 600 milliseconds?"
-   **Hint:** Read the file, split the data by commas, filter out non-numeric values, and count those greater than 600.
-   **Answer:** 14
-   **Related:** This helps identify how many long gazes there are, suggesting which interface elements might be more engaging.

### Intermediate
-   **Question:** "Write a Python function `analyze_gaze_data(filename)` that loads the data, cleans it (handling 'NA', 'nA', 'error', and 'NaN' entries), and returns the percentage of valid gaze durations that are greater than 600 milliseconds."
-   **Hint:** Create a function that reads the file, cleans the data, calculates the percentage of long gazes, and returns it.
-   **Answer:** Approximately 35.0%
-   **Related:** This helps quantify the proportion of long gazes, giving a better sense of how often users focus on specific elements.

### Advanced
-   **Question:** "Load the data from `eye_tracking_data.txt`. Write a Python function `gaze_analysis_stats(filename)` that cleans the data and returns a dictionary containing the number of valid gaze durations, the average gaze duration, and the standard deviation of gaze durations greater than 600 milliseconds."
-   **Hint:** Create a function that reads and cleans the data, calculates the total valid count, the average of all valid data, and the standard deviation of long gazes.
-   **Answer:** A dictionary similar to: `{'valid_count': 36, 'average': 547.22, 'std_dev': 141.5}`
-   **Related:** This provides a comprehensive statistical overview, allowing for deeper analysis of user attention patterns.
