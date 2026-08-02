const fs = require('fs');

let content = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

if (!content.includes('import { SuccessModal }')) {
  content = content.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { SuccessModal } from '../components/SuccessModal';");
}

// Remove the `setTimeout` in the handleSubmit function
content = content.replace("setTimeout(() => setSubmitted(false), 5000);", "");

// Replace the submitted inline view with just the form, and add SuccessModal right after the closing form tag or somewhere near.
const submittedBlockRegex = /\{submitted \? \([\s\S]*?\) : \(/;
content = content.replace(submittedBlockRegex, "");
content = content.replace(/<\/form>\s*\)}/, "</form>");

// Now inject SuccessModal inside the main container
content = content.replace(
  '<div className="flex flex-col min-h-screen bg-white dark:bg-[#171717]">',
  `<div className="flex flex-col min-h-screen bg-white dark:bg-[#171717]">
      <SuccessModal
        isOpen={submitted}
        onClose={() => setSubmitted(false)}
        title="Message Sent!"
        message="Thanks for reaching out. A member of our team will get back to you within 24 hours."
        actionButton={
          <button
            onClick={() => setSubmitted(false)}
            className="w-full h-14 flex items-center justify-center rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold hover:bg-gray-800 transition-colors shadow-xl"
          >
            Got it
          </button>
        }
      />`
);

fs.writeFileSync('src/pages/Contact.tsx', content, 'utf8');
