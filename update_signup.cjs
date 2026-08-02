const fs = require('fs');

let content = fs.readFileSync('src/pages/Signup.tsx', 'utf8');

// Import SuccessModal
if (!content.includes('SuccessModal')) {
  content = content.replace("import { Link, useNavigate } from 'react-router-dom';", "import { Link, useNavigate } from 'react-router-dom';\nimport { SuccessModal } from '../components/SuccessModal';");
}

// Remove the `if (success) { return (...) }` block
content = content.replace(/if\s*\(success\)\s*\{\s*return\s*\(\s*<div className="min-h-screen[\s\S]*?<\/div>\s*\);\s*\}/, '');

// Add the SuccessModal rendering right inside the main return block.
// We'll place it right inside the outermost <div className="min-h-screen flex bg-white dark:bg-[#171717]">
content = content.replace(
  '<div className="min-h-screen flex bg-white dark:bg-[#171717]">',
  `<div className="min-h-screen flex bg-white dark:bg-[#171717]">
      <SuccessModal
        isOpen={success}
        onClose={() => navigate('/login')}
        title="Check your email"
        message={\`We've sent a validation link to \${email}. Please click the link to verify your account and start investing.\`}
        actionButton={
          <Link
            to="/login"
            className="w-full h-14 flex items-center justify-center rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold hover:bg-gray-800 transition-colors shadow-xl"
          >
            Go to Login
          </Link>
        }
      />`
);

fs.writeFileSync('src/pages/Signup.tsx', content, 'utf8');
