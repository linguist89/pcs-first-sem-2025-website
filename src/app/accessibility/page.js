import PolicyPage from '@/components/policy/PolicyPage';

export const metadata = {
  title: 'Accessibility Statement - EdTech Course - Interactive Learning Platform',
  description: 'Our commitment to digital accessibility. Learn about the accessibility features of the EdTech Course platform and our ongoing efforts to ensure an inclusive learning experience.'
};

export default function Accessibility() {
  return <PolicyPage dataPath="/data/accessibility.json" />;
} 