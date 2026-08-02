const fs = require('fs');

let content = fs.readFileSync('src/pages/ResetPassword.tsx', 'utf8');
if (!content.includes('import { SuccessModal }')) {
  content = content.replace("import { Building2, AlertCircle } from 'lucide-react';", "import { Building2, AlertCircle } from 'lucide-react';\nimport { SuccessModal } from '../components/SuccessModal';");
}
fs.writeFileSync('src/pages/ResetPassword.tsx', content, 'utf8');
