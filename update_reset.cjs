const fs = require('fs');

let content = fs.readFileSync('src/pages/ResetPassword.tsx', 'utf8');

// Import SuccessModal
if (!content.includes('SuccessModal')) {
  content = content.replace("import { Link, useNavigate } from 'react-router-dom';", "import { Link, useNavigate } from 'react-router-dom';\nimport { SuccessModal } from '../components/SuccessModal';");
}

content = content.replace("const [loading, setLoading] = useState(false);", "const [loading, setLoading] = useState(false);\n  const [success, setSuccess] = useState(false);");

content = content.replace("navigate('/login');", "setSuccess(true);");

content = content.replace(
  '<div className="min-h-screen flex bg-white dark:bg-[#171717]">',
  `<div className="min-h-screen flex bg-white dark:bg-[#171717]">
      <SuccessModal
        isOpen={success}
        onClose={() => navigate('/login')}
        title="Password Reset"
        message="Your password has been successfully updated. You can now log in with your new password."
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

fs.writeFileSync('src/pages/ResetPassword.tsx', content, 'utf8');
