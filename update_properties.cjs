const fs = require('fs');
let content = fs.readFileSync('src/pages/Properties.tsx', 'utf8');

// Add visibleCount state
content = content.replace(
  'const [showMobileFilters, setShowMobileFilters] = useState(false);',
  'const [showMobileFilters, setShowMobileFilters] = useState(false);\n  const [visibleCount, setVisibleCount] = useState(4);'
);

// Reset visibleCount on filter change
content = content.replace(
  'useEffect(() => {\n    fetchProperties();\n  }, [filterLocation, activeCategory, minPrice, maxPrice]);',
  'useEffect(() => {\n    setVisibleCount(4);\n    fetchProperties();\n  }, [filterLocation, activeCategory, minPrice, maxPrice]);'
);

// Update grid classes to be bigger (1 col on mobile, 2 on desktop)
content = content.replace(
  /className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6"/g,
  'className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"'
);

// Filter the rendered properties
content = content.replace(
  '{properties.map(property => (',
  '{properties.slice(0, visibleCount).map(property => ('
);

// Add Load More button
content = content.replace(
  '</motion.div>\n              ) : (',
  '</motion.div>\n                  {properties.length > visibleCount && (\n                    <div className="flex justify-center mt-12 mb-8">\n                      <button\n                        onClick={() => setVisibleCount(prev => prev + 4)}\n                        className="px-8 py-4 rounded-full border-2 border-black/10 dark:border-white/10 font-bold text-[#171717] dark:text-white hover:border-[#9ABA1B] hover:text-[#9ABA1B] transition-colors"\n                      >\n                        Load More Properties\n                      </button>\n                    </div>\n                  )}\n              ) : ('
);

fs.writeFileSync('src/pages/Properties.tsx', content);
