"use client";

export default function FAQCategories({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeCategory === category.id
              ? 'bg-primary text-white'
              : 'bg-bg-primary text-text-primary hover:bg-bg-accent'
          }`}
        >
          {category.icon && <span className="mr-2">{category.icon}</span>}
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
} 