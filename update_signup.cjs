const fs = require('fs');

let content = fs.readFileSync('src/pages/Signup.tsx', 'utf8');

// Replace space-y-6 with grid for email
content = content.replace(
  '<div className="space-y-6">',
  '<div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">'
);

// Replace space-y-6 for password
content = content.replace(
  '<div className="space-y-6 pt-2">',
  '<div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">'
);

// Phone is already grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2
content = content.replace(
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">',
  '<div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">'
);

fs.writeFileSync('src/pages/Signup.tsx', content);
