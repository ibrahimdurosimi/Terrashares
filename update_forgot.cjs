const fs = require('fs');

let content = fs.readFileSync('src/pages/ForgotPassword.tsx', 'utf8');

// Import SuccessModal
if (!content.includes('SuccessModal')) {
  content = content.replace("import { Link } from 'react-router-dom';", "import { Link, useNavigate } from 'react-router-dom';\nimport { SuccessModal } from '../components/SuccessModal';");
}
content = content.replace("import { useNavigate } from 'react-router-dom';\n", "");
content = content.replace("const [success, setSuccess] = useState(false);", "const [success, setSuccess] = useState(false);\n  const navigate = useNavigate();");

// Remove the `if (success) { return (...) }` block
content = content.replace(/if\s*\(success\)\s*\{\s*return\s*\(\s*<div className="min-h-screen[\s\S]*?<\/div>\s*\);\s*\}/, '');

// Add the SuccessModal rendering right inside the main return block.
content = content.replace(
  '<div className="min-h-screen flex bg-white dark:bg-[#171717]">',
  `<div className="min-h-screen flex bg-white dark:bg-[#171717]">
      <SuccessModal
        isOpen={success}
        onClose={() => navigate('/login')}
        title="Check your email"
        message={\`We've sent password reset instructions to \${email}.\`}
        actionButton={
          <Link
            to="/login"
            className="w-full h-14 flex items-center justify-center rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold hover:bg-gray-800 transition-colors shadow-xl"
          >
            Back to Login
          </Link>
        }
      />`
);

fs.writeFileSync('src/pages/ForgotPassword.tsx', content, 'utf8');
