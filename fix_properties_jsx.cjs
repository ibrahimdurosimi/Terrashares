const fs = require('fs');
let content = fs.readFileSync('src/pages/Properties.tsx', 'utf8');

content = content.replace(
  '              ) : properties.length > 0 ? (\n                <motion.div \n                  key="grid"',
  '              ) : properties.length > 0 ? (\n                <>\n                <motion.div \n                  key="grid"'
);

content = content.replace(
  '                  {properties.length > visibleCount && (\n                    <div className="flex justify-center mt-12 mb-8">\n                      <button',
  '                  {properties.length > visibleCount && (\n                    <div className="flex justify-center mt-12 mb-8">\n                      <button'
);

content = content.replace(
  '                      </button>\n                    </div>\n                  )}\n              ) : (',
  '                      </button>\n                    </div>\n                  )}\n                </>\n              ) : ('
);

fs.writeFileSync('src/pages/Properties.tsx', content);
