const fs = require('fs');
let content = fs.readFileSync('src/pages/Signup.tsx', 'utf8');
if (!content.includes('import { SuccessModal }')) {
  content = content.replace("import { useNavigate, Link } from 'react-router-dom';", "import { useNavigate, Link } from 'react-router-dom';\nimport { SuccessModal } from '../components/SuccessModal';");
  fs.writeFileSync('src/pages/Signup.tsx', content, 'utf8');
}
