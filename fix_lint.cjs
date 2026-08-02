const fs = require('fs');

// Fix SuccessModal.tsx
let modalContent = fs.readFileSync('src/components/SuccessModal.tsx', 'utf8');
if (!modalContent.includes('import React')) {
  modalContent = "import React from 'react';\n" + modalContent;
  fs.writeFileSync('src/components/SuccessModal.tsx', modalContent, 'utf8');
}

// Fix PropertyDetail.tsx
let propContent = fs.readFileSync('src/pages/PropertyDetail.tsx', 'utf8');
if (!propContent.includes("import React")) {
  propContent = "import React from 'react';\n" + propContent;
  fs.writeFileSync('src/pages/PropertyDetail.tsx', propContent, 'utf8');
}

// Fix ResetPassword.tsx
let resetContent = fs.readFileSync('src/pages/ResetPassword.tsx', 'utf8');
if (!resetContent.includes('import { SuccessModal }')) {
  resetContent = resetContent.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { SuccessModal } from '../components/SuccessModal';");
}
if (!resetContent.includes('import { Link, useNavigate }')) {
  if (resetContent.includes("import { useNavigate }")) {
    resetContent = resetContent.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate, Link } from 'react-router-dom';");
  } else {
    resetContent = "import { useNavigate, Link } from 'react-router-dom';\n" + resetContent;
  }
}
fs.writeFileSync('src/pages/ResetPassword.tsx', resetContent, 'utf8');
