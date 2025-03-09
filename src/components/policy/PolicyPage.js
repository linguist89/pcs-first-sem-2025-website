'use client';

import { useState, useEffect } from 'react';

const PolicyPage = ({ dataPath }) => {
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(dataPath);
        const data = await response.json();
        setPolicyData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching policy data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dataPath]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 bg-neutral-light animate-pulse rounded mb-4"></div>
          <div className="h-4 bg-neutral-light animate-pulse rounded mb-2 w-3/4"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="mt-8">
              <div className="h-6 bg-neutral-light animate-pulse rounded mb-4 w-1/2"></div>
              <div className="h-4 bg-neutral-light animate-pulse rounded mb-2"></div>
              <div className="h-4 bg-neutral-light animate-pulse rounded mb-2"></div>
              <div className="h-4 bg-neutral-light animate-pulse rounded mb-2 w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Policy</h1>
          <p>Sorry, we couldn't load the policy information. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-text-primary">{policyData.title}</h1>
        <p className="text-sm text-text-secondary mb-6">Last Updated: {policyData.lastUpdated}</p>
        
        <div className="prose max-w-none mb-8">
          <p className="text-lg mb-8">{policyData.introduction}</p>
          
          {policyData.sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-text-primary">{section.title}</h2>
              <p className="whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicyPage; 