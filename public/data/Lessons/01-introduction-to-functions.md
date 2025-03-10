---
id: 1
title: "Introduction to Python for Cognitive Science"
description: "Learn the fundamentals of Python with applications in cognitive science"
image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
module: "Functional Programming Fundamentals"
duration: 60
difficulty: "Beginner"
lastUpdated: "2025-08-15T10:00:00"
progress: 0
prerequisites: ["None"]
learningObjectives:
  - "Understand the Python programming environment"
  - "Learn basic Python syntax and data types"
  - "Apply functional programming concepts in Python"
  - "Recognize how Python is used in cognitive science research"
---

<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# 

---

# Teaching Python Functions for Machine Learning Preparation: A Lesson Plan for Cognitive Science Students

Key findings: This lesson plan introduces Python functions through direct ML-relevant examples, progressing from basic syntax to collaborative coding exercises. The structure emphasizes practical application in Jupyter notebooks, with group activities designed to mirror real-world ML workflows. Concepts are grounded in educational best practices from computer science pedagogy, while exercises draw from proven function training materials.

## 1. Introduction to Functions in Machine Learning Context

### 1.1 Why Functions Matter for ML

Functions form the building blocks of machine learning pipelines, enabling:

- Reproducible data preprocessing
- Modular model architecture design
- Efficient hyperparameter tuning

Cognitive scientists benefit from function mastery when implementing experimental paradigms and analyzing behavioral data. A typical ML workflow involves chaining multiple functions for data loading, feature engineering, and model evaluation.

### 1.2 Basic Function Syntax

Python functions follow this template:

```python
def normalize_data(values):  # Function definition
    """Scale numerical values between 0-1"""  # Docstring
    scaled = [(x - min(values))/(max(values)-min(values)) for x in values]
    return scaled  # Return statement
```

Key components:

1. `def` keyword initiates function declaration
2. Parentheses contain parameters (values in this case)
3. Colon and indentation define the function body
4. `return` sends processed data back to caller

## 2. Core Function Concepts with ML Examples

### 2.1 Parameters vs Arguments

Parameters are placeholders in function definitions, while arguments are actual values passed during calls:

```python
def accuracy(y_true, y_pred):  # Parameters
    correct = sum(1 for t,p in zip(y_true,y_pred) if t == p)
    return correct/len(y_true)

acc = accuracy([0,1,1], [1,1,1])  # Arguments
print(f"Model accuracy: {acc:.1%}")  
```

Machine learning libraries like scikit-learn use this pattern extensively in their API design.

### 2.2 Return Values and Variable Scope

Functions encapsulate logic while maintaining namespace separation:

```python
def feature_means(X):
    means = []
    for col in X.T:  # Transpose for column iteration
        means.append(sum(col)/len(col))
    return means  # Only this value exits the function

data = [[1,2], [3,4], [5,6]]
print(means)  # NameError - exists only inside function
print(feature_means(data))  # Correct access via return
```

This scope isolation prevents variable collisions in complex ML workflows.

## 3. Code-Along Exercises

### 3.1 Exercise 1: Data Preprocessing Function

Create a function to handle missing values:

```python
def handle_missing(data, strategy='mean'):
    """Replace NaN values using specified strategy"""
    import numpy as np
    if strategy == 'mean':
        fill_value = np.nanmean(data)
    elif strategy == 'median':
        fill_value = np.nanmedian(data)
    return np.nan_to_num(data, nan=fill_value)
```

**Implementation Steps**:

1. Define function with data and strategy parameters
2. Calculate appropriate fill value based on strategy
3. Use NumPy's nan_to_num for efficient replacement

### 3.2 Exercise 2: Model Evaluation Function

Implement a multi-metric evaluator:

```python
def evaluate_model(y_true, y_pred):
    from sklearn.metrics import accuracy_score, f1_score
    return {
        'accuracy': accuracy_score(y_true, y_pred),
        'f1': f1_score(y_true, y_pred, average='macro')
    }
```

Test with sample predictions:

```python
results = evaluate_model([0,1,0], [1,1,0])
print(results)  # {'accuracy': 0.666..., 'f1': 0.555...}
```

This mirrors ML library design patterns.

## 4. Group Work Activities

### 4.1 Collaborative Function Design

**Task**: Implement a KNN classifier from scratch in groups:

```python
def knn_predict(X_train, y_train, X_test, k=3):
    predictions = []
    for test_point in X_test:
        # Calculate distances
        distances = [np.linalg.norm(test_point - x) for x in X_train]
        # Get indices of k nearest neighbors
        knn_indices = np.argsort(distances)[:k]
        # Get labels of nearest neighbors
        knn_labels = [y_train[i] for i in knn_indices]
        # Return most common label
        predictions.append(max(set(knn_labels), key=knn_labels.count))
    return predictions
```

Groups must:

1. Implement distance calculation
2. Handle edge cases (tie votes, empty inputs)
3. Test with sample iris dataset

### 4.2 Function Debugging Challenge

Debug a faulty ML function:

```python
def normalize_features(X):  # Buggy version
    for col in X:
        col = (col - col.mean()) / col.std()
    return X
```

**Issues to Identify**:

1. Modifying loop variable doesn't affect original array
2. Missing axis parameter in mean/std calculations
3. No handling of zero division

## 5. Advanced Function Concepts for ML

### 5.1 Lambda Functions for Quick Transformations

Create on-the-fly feature mappers:

```python
log_transform = lambda x: np.log1p(x)
squared_features = list(map(lambda x: x**2, raw_data))
```

Used in sklearn preprocessing pipelines.

### 5.2 Decorators for Model Timing

Add timing to existing functions:

```python
def timer_decorator(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time()-start:.2f}s")
        return result
    return wrapper

@timer_decorator
def train_model(X, y):
    # Training logic
    return model
```

Essential for performance profiling in ML.

## 6. Jupyter Notebook Best Practices

### 6.1 Function Organization in Notebooks

Create reusable function cells:

```python
# Cell 1: Data loading functions
def load_csv(path):
    import pandas as pd
    return pd.read_csv(path)

# Cell 2: Visualization functions
def plot_distribution(data):
    import matplotlib.pyplot as plt
    plt.hist(data)
    plt.show()
```

Import across notebooks using `%run -i utilities.py`.

### 6.2 Documentation with Docstrings

ML-grade function documentation:

```python
def compute_gradients(X, y, theta):
    """
    Compute gradients for linear regression
    
    Parameters:
    X (ndarray): Design matrix of shape (m,n)
    y (ndarray): Target vector of shape (m,)
    theta (ndarray): Parameter vector of shape (n,)
    
    Returns:
    ndarray: Gradient vector of shape (n,)
    """
    m = len(y)
    return (1/m) * X.T @ (X @ theta - y)
```

Supports automatic documentation generation.

## Conclusion

This lesson plan bridges foundational Python functions with machine learning applications through:

1. Direct ML-relevant examples in data processing and model evaluation
2. Collaborative coding exercises mirroring real-world development
3. Jupyter-specific workflow optimization techniques

Next steps for students should include:

- Implementing function-based ML pipelines from scratch
- Exploring decorators for advanced ML monitoring
- Participating in code review sessions for function quality

The presented materials draw on established Python pedagogy while focusing on practical ML implementation needs. Functions serve as the critical building block for progressing to neural networks and deep learning architectures.

<div style="text-align: center">⁂</div>

