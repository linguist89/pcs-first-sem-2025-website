---
title: "Memory Recall Experiments: Data Analysis and Comparison"
topics:
  - File reading and parsing
  - String manipulation and case handling
  - Creating and using functions
  - List operations and comparisons
  - Data analysis and statistics
  - Set operations
  - Dictionary creation and manipulation
difficulty: Beginner to Advanced
---

### Download warmup.txt
```
wget https://raw.githubusercontent.com/linguist89/pcs-first-sem-2025-website/refs/heads/newLessonStructure/public/data/Lessons/lesson2-data/warmup.txt
```
### Download recall_data.txt
```
wget https://raw.githubusercontent.com/linguist89/pcs-first-sem-2025-website/refs/heads/newLessonStructure/public/data/Lessons/lesson2-data/recall_data.txt
```

## Warm-up code-a-long

1.  **Reading lists from a file:**
    ```python
    # Open a file and read its contents
    with open('warmup.txt', 'w') as f:
        f.write("red, green, blue\nyellow, red, purple")
    with open('warmup.txt', 'r') as file:
        lines = file.readlines()
    list1 = lines[0].strip().split(", ")
    list2 = lines[1].strip().split(", ")
    print(list1)
    print(list2)
    ```
2.  **Case-insensitive string comparison:**
    ```python
    original = ["Apple", "Orange", "Banana"]
    recalled = ["apple", "orange", "Grape"]
    correct_matches = 0
    
    for item in recalled:
        if item.lower() in [x.lower() for x in original]:
            correct_matches += 1
    
    print(f"Correct matches: {correct_matches}")
    ```
3.  **Finding items in one list but not another:**
    ```python
    list1 = ["apple", "banana", "cherry", "date"]
    list2 = ["banana", "cherry", "fig", "grape"]
    
    missing_items = [item for item in list1 if item not in list2]
    new_items = [item for item in list2 if item not in list1]
    
    print(f"Missing from list2: {missing_items}")
    print(f"New in list2: {new_items}")
    ```
4.  **Creating a dictionary with analysis results:**
    ```python
    list1 = ["apple", "banana", "cherry", "date"]
    list2 = ["banana", "cherry", "fig", "grape"]
    
    results = {
        "matches": len([item for item in list2 if item in list1]),
        "missing": [item for item in list1 if item not in list2],
        "new": [item for item in list2 if item not in list1]
    }
    
    print(results)
    ```

# Scenario
Professor Chen was conducting a memory experiment with her psychology students. "Today, we're going to analyze memory recall accuracy," she explained to her research assistant, Alex. "I showed participants a list of fruits and asked them to recall as many as they could. The data's in this file," she said, handing over a flash drive. "We need to determine how accurately they recalled the items, ignoring case sensitivity. I'm particularly interested in which items they consistently forgot and which ones they incorrectly added. Can you write a program to analyze this data and give me some statistics on recall accuracy?"

# Scenario highlighted
Professor Chen was conducting a memory experiment with her psychology students. "Today, we're going to analyze [1 memory recall accuracy]," she explained to her research assistant, Alex. "I showed participants a list of fruits and asked them to recall as many as they could. The data's in this file," she said, handing over a flash drive. "[2 We need to determine how accurately they recalled the items], ignoring case sensitivity. I'm particularly interested in [3 which items they consistently forgot and which ones they incorrectly added]. Can you write a program to analyze this data and give me some statistics on recall accuracy?"

## Objective
Professor Chen wants Alex to analyze memory recall data to understand recall accuracy. To do this, Alex needs to:

1.  **Compare the original and recalled lists:** Determine which items were correctly recalled, ignoring case sensitivity.
2.  **Calculate recall statistics:** Find the number and percentage of correctly recalled items.
3.  **Identify specific patterns:** Determine which items were forgotten and which ones were incorrectly added.

Therefore, the main question is: **How can we analyze the provided memory recall data to determine recall accuracy and identify patterns in what people remember and forget?**

## Questions, hints, and answers

### Beginner
-   **Question:** "Load the two lists from `recall_data.txt`. How many items were recalled correctly, ignoring case sensitivity?"
-   **Hint:** Read the file line by line, split each line into items, convert all to lowercase, and count how many items from the second list are in the first list.
-   **Answer:** 7
-   **Related:** This helps establish a basic measure of memory recall performance.

### Intermediate
-   **Question:** "Write a Python function `analyze_recall(filename)` that loads the lists from the file, converts all items to lowercase, and returns the percentage of correctly recalled items."
-   **Hint:** Create a function that reads the file, processes both lists to lowercase, calculates how many items from the recalled list match the original list, and computes the percentage.
-   **Answer:** 70.0%
-   **Related:** This provides a standardized measure of recall performance that can be compared across different experiments.

### Advanced
-   **Question:** "Load the lists from `recall_data.txt`. Write a Python function `recall_stats(filename)` that returns a dictionary containing: the number of correctly recalled items, the number of incorrectly recalled items, and a list of items that were in the original list but not recalled."
-   **Hint:** Create a function that reads the file, processes both lists, and computes comprehensive statistics on recall accuracy, including correct recalls, incorrect additions, and missed items.
-   **Answer:** A dictionary similar to: `{'correct': 7, 'incorrect': 3, 'missing': ['elderberry', 'honeydew', 'kiwi']}`
-   **Related:** This provides a comprehensive analysis of memory performance, revealing not just how much was remembered but also specific patterns in what was forgotten or incorrectly added.

