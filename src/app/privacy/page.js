import PolicyPage from '@/components/policy/PolicyPage';

export const metadata = {
  title: 'Privacy Policy - EdTech Course - Interactive Learning Platform',
  description: 'Learn how EdTech Course collects, uses, and protects your personal information. Our Privacy Policy explains our data practices and your privacy rights.'
};

export default function PrivacyPolicy() {
  return <PolicyPage dataPath="/data/privacy-policy.json" />;
} 