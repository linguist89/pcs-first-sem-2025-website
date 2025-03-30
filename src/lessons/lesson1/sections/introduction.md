---
title: "Introduction"
type: "lesson"
---

# Introduction to Eye-Tracking Data Analysis

In this lesson, we'll focus on processing and analyzing eye-tracking data using Python functions. You will learn how to clean noisy data, perform basic statistical analysis, and extract meaningful insights from eye-tracking experiments.

Eye-tracking data is often messy and requires careful preprocessing before analysis. We'll walk through essential techniques for handling this type of data, with a focus on practical application.

## Prerequisites

Before starting this lesson, you'll need to download the eye-tracking data file. You can use one of the methods below:

### Using wget (Linux/macOS)

```bash
wget https://raw.githubusercontent.com/chcaa/pcs-2025-data/main/eye_tracking_data.txt
```

### Using curl (Alternative for Linux/macOS)

```bash
curl -O https://raw.githubusercontent.com/chcaa/pcs-2025-data/main/eye_tracking_data.txt
```

### Using PowerShell (Windows)

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/chcaa/pcs-2025-data/main/eye_tracking_data.txt" -OutFile "eye_tracking_data.txt"
```

Alternatively, you can use the download button at the top of this page.

## What You'll Learn

By the end of this lesson, you'll be able to:

1. Clean and preprocess eye-tracking data
2. Calculate basic statistics on gaze durations
3. Identify patterns in user attention
4. Create reusable functions for eye-tracking data analysis

Let's get started! 