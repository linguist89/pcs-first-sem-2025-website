import Hero from './Hero';
import Announcements from './Announcements';
import UpcomingClasses from './UpcomingClasses';
import RecentLessons from './RecentLessons';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Announcements />
      <UpcomingClasses />
      <RecentLessons />
    </main>
  );
};

export default HomePage; 