---
id: computational-thinking-session1
title: "Session 1: Computational Thinking for Problem Solving"
description: "Introduction to computational thinking principles and their application to everyday problems and cognitive science."
image: https://images.unsplash.com/photo-1580894908361-967195033215?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80
module: "Computational Thinking for Cognitive Science"
duration: "60 minutes"
difficulty: Beginner
lastUpdated: 2024-01-26
progress: 0
prerequisites:
  - "Basic understanding of Python primitive data types (Integers, Floats, Strings, Booleans)"
learningObjectives:
  - "Understand the core principles of computational thinking: decomposition, pattern recognition, abstraction, and algorithms."
  - "Break down complex problems into manageable steps through decomposition."
  - "Identify patterns in data and everyday activities."
  - "Create step-by-step algorithms to solve problems efficiently."
  - "Apply computational thinking concepts to cognitive science research scenarios."
  - "Write basic Python functions to implement algorithmic solutions."
---

<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# 

---

# Computational Thinking for Everyday Problem Solving

*A Foundational Lesson for Cognitive Science Students*

---

## Lesson Overview

**What You'll Learn Today:**

1. Break complex problems into manageable steps
2. Spot patterns in daily activities
3. Create efficient solutions using code
4. Connect these skills to cognitive research

All code examples are **runnable right now** - no setup needed!

---

## 1. Morning Routine: Your First Algorithm

### 1.1 Let's Simulate Your Morning

*Why This Matters:* Your morning routine is already an algorithm - let's make it explicit!

```python
def morning_routine():
    tasks = {
        'Brush Teeth': 3,    # Minutes
        'Make Bed': 2,
        'Eat Breakfast': 10
    }
    
    print("Today's Morning Plan:")
    total_time = 0
    
    # Step 1: List all tasks
    for task, minutes in tasks.items():
        print(f" - {task}: {minutes} minutes")
        total_time += minutes
    
    # Step 2: Calculate total time
    print(f"\nTotal morning routine: {total_time} minutes")
    
morning_routine()
```

**Key Concept:**

- **Decomposition:** We broke your routine into individual tasks
- **Algorithm:** Created step-by-step instructions your computer can follow
- **Variables:** Used `tasks` to store data and `total_time` to track progress

*Your Turn:* Add "Shower: 8 minutes" to the tasks dictionary. What's the new total time?

---

## 2. Cleaning Your Room Like a Computer

### 2.1 The Room Cleaning Algorithm

*Real-World Application:* Just like organizing data in research!

```python
# Our virtual room state
room = {
    'floor': ['socks', 'textbook', 'empty pizza box'],
    'desk': ['3 coffee cups', 'laptop', 'dirty plate']
}

def clean_room():
    cleaned_items = 0
    
    print("Cleaning Process Starting...")
    
    # Area-by-area cleaning
    for area, items in room.items():
        print(f"\nCleaning {area.capitalize()}:")
        
        # Item-by-item processing
        for item in items:
            if 'pizza box' in item or 'dirty' in item:
                print(f"  Recycling: {item}")
            else:
                print(f"  Organizing: {item}")
            cleaned_items += 1
    
    print(f"\nTotal items processed: {cleaned_items}")

clean_room()
```

**What We're Practicing:**

1. **Conditional Logic:** Different actions for different item types
2. **Nested Loops:** Area → Item hierarchy
3. **Counter Variable:** Tracking progress with `cleaned_items`

*Research Connection:* This is similar to how cognitive scientists categorize experimental data!

---

## 3. Code-Along: Phone Usage Analysis

### 3.1 Find Your Screen Time Patterns

*Why It Matters:* Pattern recognition is crucial for analyzing brain scan data!

```python
# Weekly screen time in minutes
screen_time = {
    'Monday': 142,
    'Tuesday': 98,
    'Wednesday': 210,  # Uh-oh, Netflix marathon?
    'Thursday': 105,
    'Friday': 175
}

def analyze_habits():
    total = sum(screen_time.values())
    average = total / len(screen_time)
    
    print("Your Weekly Phone Report:")
    print(f"  Total: {total} minutes")
    print(f"  Daily Average: {average:.1f} minutes")
    
    # Find problem days
    print("\nHigh Usage Days:")
    for day, minutes in screen_time.items():
        if minutes > 150:
            overage = minutes - average
            print(f"  {day}: {minutes} min ({overage:.0f} above average)")

analyze_habits()
```

**Breaking It Down:**

1. **sum():** Calculates total weekly usage
2. **Loop with Condition:** Identifies high-usage days
3. **Pattern Recognition:** Finds days needing improvement

*Your Challenge:* Add a "low usage days" check for days under 100 minutes!

---

## 4. Group Project: Party Planning Algorithm

### 4.1 Budget-Friendly Party Planner

*Real-World Skill:* Similar to resource allocation in psychology experiments!

```python
def plan_party(budget=50):
    options = {
        'Food': {'Pizza': 25, 'Sandwiches': 15, 'Tacos': 20},
        'Entertainment': {'Movie': 5, 'Games': 0, 'Karaoke': 10},
        'Decorations': {'Balloons': 5, 'Banner': 8, 'Lights': 12}
    }
    
    print(f"Planning Party with €{budget} Budget:")
    total_spent = 0
    
    # Choose cheapest options
    for category, items in options.items():
        cheapest = min(items, key=lambda k: items[k])
        cost = items[cheapest]
        
        print(f"  {category}: {cheapest} (€{cost})")
        total_spent += cost
    
    remaining = budget - total_spent
    print(f"\nTotal Spent: €{total_spent}")
    print(f"Remaining: €{remaining} {'✓' if remaining >=0 else 'X'}")

plan_party()
```

**Group Tasks:**

1. Make it choose mid-priced options instead of cheapest
2. Add a "Venue" category with options
3. Handle negative remaining budgets (overspending)

*Pro Tip:* This uses the same logic as allocating resources in memory experiments!

---

## 5. Connecting to Cognitive Science

### 5.1 Memory Techniques as Algorithms

```python
def chunk_phone_number(number):
    cleaned = ''.join([c for c in number if c.isdigit()])
    
    if len(cleaned) != 10:
        return "Invalid number"
    
    # Break into 3-3-4 chunks
    return f"{cleaned[:3]}-{cleaned[3:6]}-{cleaned[6:]}"

print(chunk_phone_number("049 555 1234"))  # 049-555-1234
```

**Why It Matters:**

- **Decomposition:** Breaking numbers into chunks
- **Pattern Recognition:** Standard phone number format
- **Research Link:** Similar to how we segment memories!

---

## What We've Learned

| CT Concept | Real-World Example | Research Connection |
| :-- | :-- | :-- |
| Decomposition | Morning routine steps | Breaking complex experiments |
| Pattern Finding | Phone usage analysis | Identifying brain wave trends |
| Abstraction | Shopping list creation | Focusing on key study variables |
| Algorithms | Party planning | Standardized testing protocols |

## Open-Ended Exercises

### Exercise 1: Attention Experiment Analysis

*Computational Thinking Connection: Decomposition, Pattern Recognition*

**Task:** Design a function to analyze reaction time data from a hypothetical attention experiment.

```python
# Example starter code - expand upon this!
def analyze_attention_experiment(subject_data):
    """
    Analyze reaction time data from an attention experiment.
    subject_data: Dictionary with keys = trial numbers, values = reaction times in ms
    """
    # Your algorithm here!
    pass  # Remove this and add your code

# Sample data to work with
sample_data = {
    'Subject1': {'trial1': 245, 'trial2': 302, 'trial3': 198, 'trial4': 287, 'trial5': 251},
    'Subject2': {'trial1': 301, 'trial2': 315, 'trial3': 270, 'trial4': 265, 'trial5': 280}
}
```

**Questions to Guide Your Solution:**
1. How would you calculate each subject's average reaction time?
2. What algorithm could identify the fastest and slowest trials for each subject?
3. How might you detect outliers in the data (extremely fast/slow responses)?
4. How would you compare performance between subjects?
5. Can you connect your approach to real cognitive science research methods?

---

### Exercise 2: Memory Chunking Simulator

*Computational Thinking Connection: Abstraction, Algorithms*

**What is Chunking?** Chunking is how our brains group individual pieces of information into meaningful units to remember them better. For example, we remember phone numbers as chunks (123-456-7890) rather than ten separate digits.

**Task:** Create a function that demonstrates how chunking improves our ability to remember information.

```python
def memory_chunking_simulator(items):
    """
    Simulate how humans group information into chunks for better recall.
    
    Parameters:
    - items: List of individual items to remember (digits, words, etc.)
    
    Returns:
    - A string showing how the items might be chunked for better memory
    """
    # STEP 1: Determine a reasonable chunk size (typically 3-4 items)
    chunk_size = 3
    
    # STEP 2: Group the items into chunks
    chunked_result = []
    for i in range(0, len(items), chunk_size):
        # Get a slice of items for this chunk
        chunk = items[i:i + chunk_size]
        
        # Add this chunk to our results
        chunked_result.append(chunk)
    
    # STEP 3: Format the chunked items for display
    # YOUR CODE HERE: Transform chunked_result into a readable format
    # Hint: You might want to join items within each chunk, then separate chunks with dashes
    
    return "Show chunked result here"  # Replace with your formatted output

# Test with these examples:
phone_digits = [4, 0, 7, 5, 5, 5, 1, 2, 3, 4]
random_letters = ['F', 'B', 'I', 'C', 'I', 'A', 'N', 'S', 'A']
```

**Questions to Explore:**
1. How does the chunking size affect memory? Try different chunk sizes.
2. How would you format the output to clearly show the chunks?
3. Could you create a simple memory quiz function that tests if chunking improves recall?
4. For the random letters, can you detect any meaningful patterns (like FBI, CIA, NSA) and chunk accordingly?

---

### Exercise 3: Simple Decision-Making Model

*Computational Thinking Connection: Decomposition, Algorithms*

**Real-World Context:** When deciding between options (like "study," "party," or "sleep"), our brains weigh different factors like immediate enjoyment, long-term benefits, and social value.

**Task:** Create a function that simulates this decision-making process using simple weighted factors.

```python
def simple_decision_maker(options):
    """
    A basic model of how people make decisions between options.
    
    Parameters:
    - options: Dictionary where keys are options and values are dictionaries of scores
               Example: {"Study": {"enjoyment": 2, "future_benefit": 9}, ...}
    
    Returns:
    - The recommended option based on the highest total score
    """
    # Pre-defined weights for different factors (how much we care about each)
    weights = {
        "enjoyment": 0.4,       # How fun it is (40% importance)
        "future_benefit": 0.6    # How useful for the future (60% importance)
    }
    
    best_option = None
    best_score = 0
    
    print("Decision Analysis:")
    
    # YOUR CODE HERE:
    # 1. For each option, calculate a weighted score
    # 2. Print the breakdown of points for each option
    # 3. Return the option with the highest score
    
    return best_option

# Example data to test your function
life_choices = {
    "Study for exam": {"enjoyment": 3, "future_benefit": 9},
    "Go to party": {"enjoyment": 8, "future_benefit": 2},
    "Get extra sleep": {"enjoyment": 7, "future_benefit": 6}
}

recommendation = simple_decision_maker(life_choices)
print(f"\nRecommended choice: {recommendation}")
```

**Questions to Explore:**
1. How does changing the weights affect the recommended decision?
2. Could you add a "social pressure" factor to the model?
3. How might you simulate different personality types by using different weights?
4. How could you visualize the scores for each option (e.g., with text-based bars)?
5. How does this simple model compare to how you actually make decisions?

---



