---
id: 4
title: "Machine Learning for Cognitive Science"
description: "Learn how to apply machine learning techniques to cognitive science problems"
image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
module: "Machine Learning Applications"
duration: 90
difficulty: "Intermediate-Advanced"
lastUpdated: "2025-09-05T10:00:00"
progress: 0
prerequisites: ["Introduction to Python for Cognitive Science", "Functional Programming for Cognitive Modeling", "Data Analysis for Cognitive Science with Python"]
learningObjectives:
  - "Understand fundamental machine learning concepts and their applications in cognitive science"
  - "Apply supervised learning algorithms to predict cognitive and behavioral outcomes"
  - "Use unsupervised learning for pattern discovery in cognitive data"
  - "Implement and evaluate machine learning models in Python"
---

# Machine Learning for Cognitive Science

Welcome to our fourth lesson! Now that you have a strong foundation in Python, functional programming, and data analysis, we're ready to explore machine learning techniques and their applications in cognitive science. Machine learning offers powerful tools for understanding cognition and brain function from complex datasets.

## Machine Learning in Cognitive Science

Machine learning and cognitive science share deep connections:

1. **Cognitive modeling**: ML algorithms can model human learning, decision-making, and perception
2. **Neuroimaging analysis**: Classify and interpret patterns in brain imaging data
3. **Behavioral prediction**: Predict human behaviors and cognitive processes
4. **Natural language processing**: Analyze linguistic patterns and semantic structures
5. **Computational psychiatry**: Model cognitive differences in clinical populations

In this lesson, we'll explore practical applications using scikit-learn and other Python libraries, while continuing to apply functional programming principles.

## Preparing Cognitive Science Data for Machine Learning

Before applying ML algorithms, we need to properly prepare our data:

```python
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

# Load a sample cognitive dataset 
# (Working memory task with demographics and performance metrics)
data = pd.DataFrame({
    'participant_id': range(1, 101),
    'age': np.random.normal(35, 12, 100).astype(int),
    'education_years': np.random.normal(16, 3, 100).astype(int),
    'gender': np.random.choice(['male', 'female', 'non-binary'], 100),
    'condition': np.random.choice(['control', 'experimental'], 100),
    'reaction_time_ms': np.random.normal(450, 80, 100),
    'accuracy': np.random.normal(0.75, 0.15, 100),
    'working_memory_score': np.random.normal(7.5, 2.0, 100)
})

# Define features and target
X = data.drop(['participant_id', 'working_memory_score'], axis=1)
y = data['working_memory_score']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create preprocessing pipeline (functional approach)
numeric_features = ['age', 'education_years', 'reaction_time_ms', 'accuracy']
categorical_features = ['gender', 'condition']

# Create transformers for different column types
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(), categorical_features)
    ]
)

# Preview the preprocessed data
preprocessed_X_train = preprocessor.fit_transform(X_train)
print(f"Preprocessed data shape: {preprocessed_X_train.shape}")
```

## Supervised Learning for Cognitive Prediction

### Predicting Working Memory Performance

Let's use regression models to predict working memory performance from demographic and behavioral variables:

```python
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import cross_val_score
import matplotlib.pyplot as plt

# Create a modeling pipeline
def create_model_pipeline(model):
    """Create a pipeline with preprocessing and a model"""
    return Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', model)
    ])

# Define models to evaluate
models = {
    'Linear Regression': LinearRegression(),
    'Ridge Regression': Ridge(alpha=0.5),
    'Lasso Regression': Lasso(alpha=0.1),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42)
}

# Evaluate models using cross-validation (functional approach)
def evaluate_model(model, X, y, cv=5):
    """Evaluate a model with cross-validation"""
    pipeline = create_model_pipeline(model)
    scores = cross_val_score(pipeline, X, y, cv=cv, scoring='neg_mean_squared_error')
    rmse_scores = np.sqrt(-scores)
    return {
        'mean_rmse': rmse_scores.mean(),
        'std_rmse': rmse_scores.std()
    }

# Evaluate all models
results = {name: evaluate_model(model, X, y) 
           for name, model in models.items()}

# Display results
for name, metrics in results.items():
    print(f"{name}: RMSE = {metrics['mean_rmse']:.4f} (±{metrics['std_rmse']:.4f})")

# Select best model and train on full training set
best_model = models['Random Forest']  # Usually performs well
pipeline = create_model_pipeline(best_model)
pipeline.fit(X_train, y_train)

# Evaluate on test set
y_pred = pipeline.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)
print(f"\nTest set RMSE: {rmse:.4f}")
print(f"Test set R²: {r2:.4f}")

# Feature importance (for Random Forest)
feature_names = (numeric_features + 
                 list(pipeline.named_steps['preprocessor']
                     .named_transformers_['cat']
                     .get_feature_names_out(categorical_features)))

if hasattr(pipeline.named_steps['model'], 'feature_importances_'):
    importances = pipeline.named_steps['model'].feature_importances_
    indices = np.argsort(importances)[::-1]
    
    plt.figure(figsize=(10, 6))
    plt.title('Feature Importance for Working Memory Prediction')
    plt.bar(range(len(importances)), importances[indices], align='center')
    plt.xticks(range(len(importances)), [feature_names[i] for i in indices], rotation=90)
    plt.tight_layout()
```

### Classification of Cognitive States

Let's explore classification for a different cognitive science problem - predicting attentional state (focused vs. distracted) from performance metrics:

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import seaborn as sns

# Simulate cognitive state classification data
attention_data = pd.DataFrame({
    'rt_variability': np.random.normal(0, 1, 200),
    'error_rate': np.random.normal(0, 1, 200),
    'response_consistency': np.random.normal(0, 1, 200),
    'mind_wandering_probe': np.random.normal(0, 1, 200)
})

# Add some correlation between features and label
z = (0.7 * attention_data['rt_variability'] + 
     0.8 * attention_data['error_rate'] - 
     0.6 * attention_data['response_consistency'] +
     0.9 * attention_data['mind_wandering_probe'])

# Create binary attention state label
attention_data['attention_state'] = (z > 0).astype(int)
print(f"Class distribution: {attention_data['attention_state'].value_counts()}")

# Prepare data
X = attention_data.drop('attention_state', axis=1)
y = attention_data['attention_state']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Create and train classifiers
classifiers = {
    'Logistic Regression': LogisticRegression(random_state=42),
    'Random Forest': RandomForestClassifier(random_state=42)
}

# Train and evaluate classifiers
for name, clf in classifiers.items():
    # Train
    clf.fit(X_train, y_train)
    
    # Predict
    y_pred = clf.predict(X_test)
    
    # Evaluate
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)
    
    print(f"\n{name}:")
    print(f"Accuracy: {accuracy:.4f}")
    print(report)
    
    # Plot confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['Focused', 'Distracted'],
                yticklabels=['Focused', 'Distracted'])
    plt.title(f'Confusion Matrix - {name}')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
```

## Unsupervised Learning for Cognitive Pattern Discovery

Unsupervised learning can help discover patterns in cognitive data without predefined labels:

```python
from sklearn.cluster import KMeans, DBSCAN
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Generate simulated cognitive assessment data
n_samples = 200
n_features = 10

# Create synthetic data with 3 underlying clusters
X = np.zeros((n_samples, n_features))

# Cluster 1: High performance on verbal tasks
cluster1_indices = range(0, 70)
X[cluster1_indices, 0:4] = np.random.normal(7, 1, (70, 4))  # Verbal tasks
X[cluster1_indices, 4:] = np.random.normal(4, 1, (70, 6))   # Other tasks

# Cluster 2: High performance on spatial tasks
cluster2_indices = range(70, 140)
X[cluster2_indices, 4:8] = np.random.normal(7, 1, (70, 4))  # Spatial tasks
X[cluster2_indices, 0:4] = np.random.normal(4, 1, (70, 4))  # Verbal tasks
X[cluster2_indices, 8:] = np.random.normal(4, 1, (70, 2))   # Other tasks

# Cluster 3: High performance on executive function
cluster3_indices = range(140, 200)
X[cluster3_indices, 8:] = np.random.normal(7, 1, (60, 2))   # Executive function
X[cluster3_indices, 0:8] = np.random.normal(4, 1, (60, 8))  # Other tasks

# Create a DataFrame
task_names = [
    'verbal_comprehension', 'vocabulary', 'word_fluency', 'verbal_reasoning',
    'spatial_visualization', 'mental_rotation', 'spatial_reasoning', 'pattern_recognition',
    'working_memory', 'inhibitory_control'
]
cognitive_df = pd.DataFrame(X, columns=task_names)

# Standardize the data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(cognitive_df)

# Apply PCA for dimensionality reduction
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# Explained variance
print(f"Explained variance ratio: {pca.explained_variance_ratio_}")
print(f"Total explained variance: {sum(pca.explained_variance_ratio_):.4f}")

# Apply K-means clustering
kmeans = KMeans(n_clusters=3, random_state=42)
cluster_labels = kmeans.fit_predict(X_scaled)

# Visualize the clusters
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=cluster_labels, cmap='viridis', alpha=0.7)
plt.title('Cognitive Profile Clusters')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.colorbar(scatter, label='Cluster')

# Add cluster centroids in PCA space
centroids_pca = pca.transform(kmeans.cluster_centers_)
plt.scatter(centroids_pca[:, 0], centroids_pca[:, 1], s=200, marker='*', 
            c='red', label='Centroids', edgecolor='black', zorder=10)
plt.legend()

# Analyze clusters
cognitive_df['cluster'] = cluster_labels
cluster_analysis = cognitive_df.groupby('cluster').mean()
print("\nCluster Profiles:")
print(cluster_analysis)

# Radar plot of cluster profiles
def radar_plot(df, categories):
    """Create a radar plot for visualizing cluster profiles"""
    # Number of variables
    N = len(categories)
    
    # What will be the angle of each axis in the plot
    angles = [n / float(N) * 2 * np.pi for n in range(N)]
    angles += angles[:1]  # Close the loop
    
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 10), subplot_kw=dict(polar=True))
    
    # Add cluster lines
    for cluster in df.index:
        values = df.loc[cluster].values.tolist()
        values += values[:1]  # Close the loop
        
        # Plot values
        ax.plot(angles, values, linewidth=2, label=f'Cluster {cluster}')
        ax.fill(angles, values, alpha=0.1)
    
    # Set category labels
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories)
    
    # Add legend
    plt.legend(loc='upper right', bbox_to_anchor=(0.1, 0.1))
    plt.title('Cognitive Profiles by Cluster', y=1.1)

# Plot the cognitive profiles
radar_plot(cluster_analysis, task_names)
```

## Neural Networks for Cognitive Modeling

Neural networks can model complex cognitive processes:

```python
from sklearn.neural_network import MLPRegressor
from sklearn.model_selection import train_test_split, learning_curve
import matplotlib.pyplot as plt
import numpy as np

# Generate synthetic data: Modeling memory decay over time
# Based on the Ebbinghaus forgetting curve: retention = e^(-time/decay_rate)

# Generate data points
n_samples = 200
times = np.random.uniform(0, 30, n_samples)  # Time since learning (days)
individual_decay_rates = np.random.normal(10, 3, n_samples)  # Individual differences
retention = np.exp(-times / individual_decay_rates)

# Add noise
retention = retention + np.random.normal(0, 0.05, n_samples)
retention = np.clip(retention, 0, 1)  # Ensure values are between 0 and 1

# Create features: We'll use time and some individual characteristics
age = np.random.normal(25, 8, n_samples)
sleep_quality = np.random.uniform(3, 10, n_samples)  # Scale of 1-10
prior_knowledge = np.random.uniform(1, 10, n_samples)  # Scale of 1-10

# Combine into a feature matrix
X = np.column_stack([times, age, sleep_quality, prior_knowledge])
y = retention

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Create and train a neural network
nn = MLPRegressor(
    hidden_layer_sizes=(20, 10),  # Two hidden layers
    activation='relu',
    solver='adam',
    alpha=0.001,  # Regularization
    max_iter=2000,
    random_state=42
)

# Train the model
nn.fit(X_train_scaled, y_train)

# Evaluate
train_score = nn.score(X_train_scaled, y_train)
test_score = nn.score(X_test_scaled, y_test)
print(f"Neural Network R² on training data: {train_score:.4f}")
print(f"Neural Network R² on test data: {test_score:.4f}")

# Visualize predictions vs actual
y_pred = nn.predict(X_test_scaled)
plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred, alpha=0.7)
plt.plot([0, 1], [0, 1], 'r--')
plt.title('Neural Network: Predicted vs Actual Memory Retention')
plt.xlabel('Actual Retention')
plt.ylabel('Predicted Retention')
plt.tight_layout()

# Plot learning curves to check for overfitting
train_sizes, train_scores, test_scores = learning_curve(
    nn, X_train_scaled, y_train, train_sizes=np.linspace(0.1, 1.0, 10),
    cv=5, scoring='r2'
)

plt.figure(figsize=(10, 6))
plt.plot(train_sizes, np.mean(train_scores, axis=1), 'o-', label='Training score')
plt.plot(train_sizes, np.mean(test_scores, axis=1), 'o-', label='Cross-validation score')
plt.title('Learning Curves (Neural Network)')
plt.xlabel('Training examples')
plt.ylabel('R² Score')
plt.legend(loc='best')
plt.grid(True)
```

## Exercise: Building a Cognitive State Classifier

For practice, let's build a classifier to identify cognitive states from EEG data:

1. **Task**: Using the provided dataset (simulated EEG features), build a classifier that can distinguish between different cognitive states (rest, attention, memory retrieval)
2. **Steps**:
   - Preprocess and explore the data
   - Select appropriate features
   - Train different classification models
   - Evaluate and compare their performance
   - Visualize the results
3. **Extension**: Use cross-validation to tune hyperparameters and improve performance

## Ethical Considerations in ML for Cognitive Science

When applying machine learning to cognitive science, important ethical considerations include:

1. **Data privacy**: Cognitive data is often sensitive and personal
2. **Interpretability**: "Black box" models may limit scientific insight
3. **Reproducibility**: Ensuring methods and results can be replicated
4. **Bias**: Machine learning can perpetuate biases in research design or datasets
5. **Overgeneralization**: Being careful about extrapolating beyond the studied population

As cognitive scientists using ML tools, we have a responsibility to consider these issues in our work.

## Next Steps

In this lesson, we've explored how machine learning can be applied to cognitive science problems. In future lessons, we'll delve deeper into:

- Advanced neural network architectures for cognitive modeling
- Reinforcement learning models of human decision-making
- Deep learning approaches to neuroimaging data
- Natural language processing for linguistic data

Remember to keep applying functional programming principles when implementing these machine learning techniques. Pure functions, immutability, and composition help create reproducible, maintainable machine learning pipelines for cognitive science research. 