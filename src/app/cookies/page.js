import PolicyPage from '@/components/policy/PolicyPage';

export const metadata = {
  title: 'Cookie Policy - EdTech Course - Interactive Learning Platform',
  description: 'Information about how EdTech Course uses cookies and similar technologies. Learn about the types of cookies we use and how you can control them.'
};

export default function CookiePolicy() {
  return <PolicyPage dataPath="/data/cookie-policy.json" />;
} 