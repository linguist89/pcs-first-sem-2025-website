---
id: 3
title: "Data Analysis for Cognitive Science with Python"
description: "Learn how to analyze cognitive science data using Python and its scientific ecosystem"
image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
module: "Data Analysis with Python"
duration: 90
difficulty: "Intermediate"
lastUpdated: "2025-08-29T10:00:00"
progress: 0
prerequisites: ["Introduction to Python for Cognitive Science", "Functional Programming for Cognitive Modeling"]
learningObjectives:
  - "Use NumPy and Pandas for efficient data manipulation"
  - "Apply functional programming to data analysis workflows"
  - "Visualize cognitive science data with Matplotlib and Seaborn"
  - "Perform statistical analyses on experimental data"
---

# Data Analysis for Cognitive Science with Python

Welcome to our third lesson! Now that you have a strong foundation in Python and functional programming concepts, we'll explore how to apply these skills to analyze cognitive science data. We'll focus on using NumPy, Pandas, and visualization libraries while maintaining our functional programming approach.

## The Scientific Python Ecosystem

For cognitive science research, Python's scientific libraries are invaluable:

- **NumPy**: Fast numerical computations with arrays
- **Pandas**: Data manipulation and analysis with DataFrames
- **Matplotlib/Seaborn**: Data visualization
- **SciPy**: Scientific computing (statistics, signal processing, etc.)
- **Statsmodels**: Statistical models and hypothesis testing
- **Scikit-learn**: Machine learning algorithms

These libraries are designed to work together, forming a powerful ecosystem for data analysis.

## NumPy for Numerical Computation

NumPy provides an efficient array implementation that's essential for scientific computing. Let's explore how to use NumPy for cognitive science data:

```python
import numpy as np

# Create a NumPy array of reaction times (in ms)
reaction_times = np.array([342, 337, 331, 325, 329, 338, 345, 
                           401, 415, 390, 366, 405, 400, 422,
                           290, 310, 301, 285, 296, 314, 287])

# Basic statistics (functional approach)
mean_rt = np.mean(reaction_times)
median_rt = np.median(reaction_times)
std_rt = np.std(reaction_times, ddof=1)  # Sample standard deviation

print(f"Mean RT: {mean_rt:.2f} ms")
print(f"Median RT: {median_rt:.2f} ms")
print(f"Standard Deviation: {std_rt:.2f} ms")

# Identify outliers (values more than 2 standard deviations from mean)
z_scores = (reaction_times - mean_rt) / std_rt
outliers = reaction_times[np.abs(z_scores) > 2]
print(f"Outliers: {outliers}")

# Transform data (e.g., log-transform RTs)
log_rt = np.log(reaction_times)
print(f"Log-transformed mean: {np.mean(log_rt):.4f}")

# Creating experiment conditions
conditions = np.array(['control', 'experimental'] * (len(reaction_times) // 2))
if len(conditions) < len(reaction_times):
    conditions = np.append(conditions, ['control'] * (len(reaction_times) - len(conditions)))

# Group data by condition (functional approach)
control_rts = reaction_times[conditions == 'control']
experimental_rts = reaction_times[conditions == 'experimental']

print(f"Control condition mean: {np.mean(control_rts):.2f} ms")
print(f"Experimental condition mean: {np.mean(experimental_rts):.2f} ms")
```

## Pandas for Data Manipulation

Pandas extends NumPy with labeled data structures like DataFrames that are ideal for cognitive science experiments:

```python
import pandas as pd

# Create a DataFrame with experimental data
data = {
    'participant_id': np.repeat(range(1, 8), 3),  # 7 participants, 3 trials each
    'condition': np.tile(['control', 'experimental', 'baseline'], 7),
    'reaction_time': np.random.normal(350, 50, 21),  # Random RTs with mean 350ms, SD 50ms
    'accuracy': np.random.choice([0, 1], size=21, p=[0.2, 0.8])  # 80% accuracy
}

df = pd.DataFrame(data)
print(df.head())

# Group by operations (functional approach)
condition_summary = df.groupby('condition').agg({
    'reaction_time': ['mean', 'std', 'count'],
    'accuracy': 'mean'
})
print("\nSummary by condition:")
print(condition_summary)

# Participant-level analysis
participant_summary = df.groupby('participant_id').agg({
    'reaction_time': 'mean',
    'accuracy': 'mean'
})
print("\nSummary by participant:")
print(participant_summary)

# Filter operations (functional approach)
accurate_trials = df[df['accuracy'] == 1]
print(f"\nMean RT for accurate trials: {accurate_trials['reaction_time'].mean():.2f} ms")

# Apply custom functions (functional approach)
def standardize(x):
    """Z-score standardization"""
    return (x - x.mean()) / x.std()

df['rt_z'] = df.groupby('participant_id')['reaction_time'].transform(standardize)
print("\nStandardized RTs by participant:")
print(df[['participant_id', 'reaction_time', 'rt_z']].head(10))

# Pivot tables for complex aggregations
pivot_table = pd.pivot_table(
    df, 
    values='reaction_time', 
    index='participant_id',
    columns='condition', 
    aggfunc='mean'
)
print("\nParticipant × Condition table:")
print(pivot_table)
```

## Functional Data Analysis Pipelines

Combining functional programming with Pandas creates clean, reproducible data analysis pipelines:

```python
# Example dataset: Stroop task results
stroop_data = pd.DataFrame({
    'participant': np.repeat(range(1, 11), 2),  # 10 participants
    'condition': np.tile(['congruent', 'incongruent'], 10),  # Within-subjects design
    'reaction_time': [
        # Congruent condition
        540, 488, 562, 512, 530, 575, 505, 492, 523, 548,
        # Incongruent condition
        650, 582, 679, 604, 635, 685, 598, 601, 612, 654
    ],
    'accuracy': [
        # Congruent condition
        0.95, 0.98, 0.92, 0.96, 0.95, 0.91, 0.97, 0.94, 0.96, 0.93,
        # Incongruent condition
        0.84, 0.91, 0.80, 0.88, 0.85, 0.82, 0.90, 0.89, 0.87, 0.84
    ]
})

# Define processing steps as functions (functional approach)
def clean_extreme_values(df, column, lower_percentile=0.01, upper_percentile=0.99):
    """Remove extreme values from a column"""
    lower = df[column].quantile(lower_percentile)
    upper = df[column].quantile(upper_percentile)
    return df[(df[column] >= lower) & (df[column] <= upper)]

def add_inverse_rt(df):
    """Add inverse RT (1/RT) which is often more normally distributed"""
    df_copy = df.copy()
    df_copy['inverse_rt'] = 1000 / df_copy['reaction_time']  # in seconds⁻¹
    return df_copy

def compute_stroop_effect(df):
    """Compute the Stroop effect (incongruent - congruent) for each participant"""
    # Reshape data from long to wide format
    wide_df = df.pivot_table(
        index='participant',
        columns='condition',
        values='reaction_time'
    )
    
    # Compute Stroop effect
    wide_df['stroop_effect'] = wide_df['incongruent'] - wide_df['congruent']
    return wide_df

# Compose functions to create an analysis pipeline
def analyze_stroop_data(df):
    cleaned_df = clean_extreme_values(df, 'reaction_time')
    transformed_df = add_inverse_rt(cleaned_df)
    effects_df = compute_stroop_effect(transformed_df)
    return effects_df

# Run the analysis
stroop_results = analyze_stroop_data(stroop_data)
print("Stroop Effect Analysis:")
print(stroop_results[['congruent', 'incongruent', 'stroop_effect']].describe())
```

## Data Visualization for Cognitive Science

Visualizing data is crucial for understanding patterns in cognitive science experiments:

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Set style for better visualizations
sns.set(style="whitegrid", palette="muted")

# Sample data: Working memory capacity test scores by age group
memory_data = pd.DataFrame({
    'age_group': np.repeat(['18-25', '26-35', '36-45', '46-55', '56-65'], 20),
    'memory_score': np.concatenate([
        np.random.normal(8.2, 1.2, 20),  # 18-25 age group
        np.random.normal(7.8, 1.1, 20),  # 26-35 age group
        np.random.normal(7.1, 1.3, 20),  # 36-45 age group
        np.random.normal(6.3, 1.5, 20),  # 46-55 age group
        np.random.normal(5.2, 1.7, 20)   # 56-65 age group
    ]),
    'education': np.random.choice(
        ['high school', 'bachelor', 'graduate'], 
        size=100, 
        p=[0.3, 0.5, 0.2]
    )
})

# Create a figure with multiple plots
plt.figure(figsize=(15, 10))

# 1. Boxplot of memory scores by age group
plt.subplot(2, 2, 1)
sns.boxplot(x='age_group', y='memory_score', data=memory_data)
plt.title('Working Memory Performance by Age Group')
plt.xlabel('Age Group')
plt.ylabel('Memory Score')

# 2. Violin plot with individual points
plt.subplot(2, 2, 2)
sns.violinplot(x='age_group', y='memory_score', data=memory_data, inner=None, color='0.8')
sns.stripplot(x='age_group', y='memory_score', data=memory_data, size=4, jitter=True)
plt.title('Distribution of Memory Scores by Age Group')
plt.xlabel('Age Group')
plt.ylabel('Memory Score')

# 3. Grouped boxplot by education level
plt.subplot(2, 2, 3)
sns.boxplot(x='age_group', y='memory_score', hue='education', data=memory_data)
plt.title('Memory Performance by Age and Education')
plt.xlabel('Age Group')
plt.ylabel('Memory Score')
plt.legend(title='Education Level')

# 4. Regression plot with confidence interval
plt.subplot(2, 2, 4)
# Convert age groups to numeric values for regression
age_to_num = {'18-25': 21.5, '26-35': 30.5, '36-45': 40.5, '46-55': 50.5, '56-65': 60.5}
memory_data['age_numeric'] = memory_data['age_group'].map(age_to_num)

sns.regplot(x='age_numeric', y='memory_score', data=memory_data, scatter_kws={'alpha':0.5})
plt.title('Relationship Between Age and Memory Performance')
plt.xlabel('Age (years)')
plt.ylabel('Memory Score')

plt.tight_layout()
```

## Statistical Analysis for Cognitive Science

Let's perform some common statistical analyses used in cognitive science research:

```python
from scipy import stats

# Two-sample t-test (comparing congruent vs incongruent in Stroop task)
congruent = stroop_data[stroop_data['condition'] == 'congruent']['reaction_time']
incongruent = stroop_data[stroop_data['condition'] == 'incongruent']['reaction_time']

t_stat, p_value = stats.ttest_rel(incongruent, congruent)  # Paired t-test for within-subjects design
print(f"Paired t-test: t = {t_stat:.4f}, p = {p_value:.6f}")
print(f"Mean difference (Stroop effect): {incongruent.mean() - congruent.mean():.2f} ms")

# One-way ANOVA (comparing memory scores across age groups)
groups = [memory_data[memory_data['age_group'] == group]['memory_score'] 
          for group in ['18-25', '26-35', '36-45', '46-55', '56-65']]
f_stat, p_value = stats.f_oneway(*groups)
print(f"\nOne-way ANOVA: F = {f_stat:.4f}, p = {p_value:.6f}")

# Correlation analysis
correlation = stats.pearsonr(memory_data['age_numeric'], memory_data['memory_score'])
print(f"\nCorrelation between age and memory score: r = {correlation[0]:.4f}, p = {correlation[1]:.6f}")

# Linear regression
import statsmodels.api as sm

# Add constant for intercept
X = sm.add_constant(memory_data['age_numeric'])
y = memory_data['memory_score']

# Fit model
model = sm.OLS(y, X).fit()
print("\nRegression Results:")
print(model.summary().tables[1])  # Print coefficient table
```

## Exercise: Analyzing a Cognitive Experiment

For practice, let's analyze a fictional cognitive control experiment:

Imagine we conducted a task-switching experiment with the following design:
- 20 participants completed a task-switching paradigm
- Two task conditions: "switch" trials and "stay" trials
- Dependent variables: reaction time and accuracy

Your tasks:
1. Create a DataFrame to simulate this experiment
2. Clean and transform the data using functional programming principles
3. Visualize the switch costs (difference between switch and stay trials)
4. Conduct appropriate statistical tests to analyze switch costs

## Next Steps

In this lesson, we've covered the core Python tools for data analysis in cognitive science. In our next session, we'll introduce machine learning concepts and how they can be applied to cognitive science data. We'll explore:

- Supervised learning for predicting cognitive outcomes
- Clustering for identifying patterns in behavioral data
- Dimensionality reduction for simplifying complex cognitive measures
- Model evaluation and cross-validation

Remember that the functional programming principles we've learned (pure functions, immutability, higher-order functions) are extremely valuable in data analysis workflows, helping to create reproducible and maintainable research code. 