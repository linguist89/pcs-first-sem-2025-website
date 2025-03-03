import {
  IntroIcon,
  DataTypesIcon,
  ControlFlowIcon,
  FunctionsIcon,
  PandasIcon,
  VisualizationIcon,
  MachineLearningIcon
} from '@/components/icons/LessonIcons';

const lessons = [
  {
    id: 1,
    title: "Introduction to Python",
    slug: "introduction-to-python",
    description: "Get started with Python basics, installation, and running your first code in a Jupyter notebook environment.",
    icon: <IntroIcon className="w-full h-full" />,
    topics: [
      "Python Overview",
      "Setting Up Your Environment",
      "Jupyter Notebooks",
      "Basic Syntax",
      "Running Your First Program"
    ]
  },
  {
    id: 2,
    title: "Data Types and Variables",
    slug: "data-types-and-variables",
    description: "Learn about Python's core data types, variables, and how to manipulate different kinds of data.",
    icon: <DataTypesIcon className="w-full h-full" />,
    topics: [
      "Numbers and Math Operations",
      "Strings and Text Manipulation",
      "Lists and Collections",
      "Dictionaries",
      "Type Conversion"
    ]
  },
  {
    id: 3,
    title: "Control Flow",
    slug: "control-flow",
    description: "Master control structures like conditionals and loops to create dynamic and responsive programs.",
    icon: <ControlFlowIcon className="w-full h-full" />,
    topics: [
      "Conditional Statements",
      "For Loops",
      "While Loops",
      "List Comprehensions",
      "Handling Exceptions"
    ]
  },
  {
    id: 4,
    title: "Functions and Modules",
    slug: "functions-and-modules",
    description: "Create reusable code with functions and organize your programs using Python modules.",
    icon: <FunctionsIcon className="w-full h-full" />,
    topics: [
      "Defining Functions",
      "Parameters and Return Values",
      "Lambda Functions",
      "Importing Modules",
      "Python Standard Library"
    ]
  },
  {
    id: 5,
    title: "Data Analysis with Pandas",
    slug: "data-analysis-with-pandas",
    description: "Analyze and manipulate data effectively using the powerful Pandas library for data science.",
    icon: <PandasIcon className="w-full h-full" />,
    topics: [
      "Introduction to Pandas",
      "DataFrames and Series",
      "Data Loading and Inspection",
      "Data Cleaning",
      "Data Aggregation and Grouping"
    ]
  },
  {
    id: 6,
    title: "Data Visualization",
    slug: "data-visualization",
    description: "Create informative and compelling visualizations using matplotlib, seaborn, and other Python libraries.",
    icon: <VisualizationIcon className="w-full h-full" />,
    topics: [
      "Plotting with Matplotlib",
      "Statistical Visualization with Seaborn",
      "Interactive Plots",
      "Customizing Visualizations",
      "Visualization Best Practices"
    ]
  },
  {
    id: 7,
    title: "Machine Learning Basics",
    slug: "machine-learning-basics",
    description: "Get introduced to fundamental machine learning concepts and implement simple ML models with scikit-learn.",
    icon: <MachineLearningIcon className="w-full h-full" />,
    topics: [
      "Machine Learning Overview",
      "Supervised vs. Unsupervised Learning",
      "Training and Testing Data",
      "Basic Classification Models",
      "Model Evaluation"
    ]
  }
];

export default lessons; 