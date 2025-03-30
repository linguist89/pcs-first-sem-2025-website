---
title: Knowledge Check
type: postlesson
contentType: quiz
---

## Quiz Questions

1. Which method is used to read the entire contents of a file in Python?
   - file.readlines()
   - file.read()
   - file.readline()
   - file.readall()

   **Correct Answer:** file.read()
   
   **Explanation:** The `read()` method reads the entire contents of a file as a single string.

2. What does the `isdigit()` method check for?
   - If the string contains at least one digit
   - If the string contains only digits
   - If the string is a valid number
   - If the string can be converted to an integer

   **Correct Answer:** If the string contains only digits
   
   **Explanation:** `isdigit()` returns True if all characters in the string are digits (0-9) and there is at least one character, otherwise False.

3. Which of the following is NOT a valid way to create a list comprehension?
   - [x for x in range(10)]
   - [x for x in range(10) if x % 2 == 0]
   - [x if x % 2 == 0 for x in range(10)]
   - [x**2 for x in range(10)]

   **Correct Answer:** [x if x % 2 == 0 for x in range(10)]
   
   **Explanation:** The correct syntax for a conditional list comprehension is `[expression for item in iterable if condition]`. The condition comes after the for clause, not before it. 