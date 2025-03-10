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

---

## Next Steps & Homework

1. **Personal Audit:** Run the phone analyzer with your real screen times
2. **Code Modification:** Add error handling if someone enters letters in the phone number
3. **Prep for ML:** Notice how we cleaned data (phone numbers) before processing - this is exactly what you'll do with brain scan data!

**Remember:** Every complex system (including the brain!) can be understood through computational thinking. You're now thinking like both a cognitive scientist and programmer!

