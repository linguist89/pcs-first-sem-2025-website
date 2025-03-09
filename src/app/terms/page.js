import PolicyPage from '@/components/policy/PolicyPage';

export const metadata = {
  title: 'Terms of Service - EdTech Course - Interactive Learning Platform',
  description: 'Read our Terms of Service that govern your use of the EdTech Course educational platform. Learn about your rights and responsibilities as a user of our services.'
};

export default function TermsOfService() {
  return <PolicyPage dataPath="/data/terms-of-service.json" />;
} 