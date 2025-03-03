"use client";

import {
  IntroIcon,
  DataTypesIcon,
  ControlFlowIcon,
  FunctionsIcon,
  PandasIcon,
  VisualizationIcon,
  MachineLearningIcon
} from '@/components/icons/LessonIcons';

// Import the lesson data from the JSON file
import lessonsData from '../../public/data/lessons.json';

// Map to associate iconName strings with actual icon components
const iconMap = {
  IntroIcon: <IntroIcon className="w-full h-full" />,
  DataTypesIcon: <DataTypesIcon className="w-full h-full" />,
  ControlFlowIcon: <ControlFlowIcon className="w-full h-full" />,
  FunctionsIcon: <FunctionsIcon className="w-full h-full" />,
  PandasIcon: <PandasIcon className="w-full h-full" />,
  VisualizationIcon: <VisualizationIcon className="w-full h-full" />,
  MachineLearningIcon: <MachineLearningIcon className="w-full h-full" />
};

// Process the lessons data to include the actual icon components
const lessons = lessonsData.map(lesson => ({
  ...lesson,
  icon: iconMap[lesson.iconName]
}));

export default lessons; 