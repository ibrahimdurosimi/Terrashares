const fs = require('fs');

let content = fs.readFileSync('src/pages/PropertyDetail.tsx', 'utf8');

if (!content.includes('import { SuccessModal }')) {
  content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\nimport { SuccessModal } from '../components/SuccessModal';");
}

// Add state for inquiry submitted
content = content.replace("const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);", "const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);\n  const [inquirySubmitted, setInquirySubmitted] = useState(false);\n  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);");

// Create submit handler
const submitHandler = `
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingInquiry(true);
    setTimeout(() => {
      setIsSubmittingInquiry(false);
      setIsInvestModalOpen(false);
      setInquirySubmitted(true);
    }, 1500);
  };
`;
content = content.replace("export default function PropertyDetail() {", `export default function PropertyDetail() {\n${submitHandler}`);

// Replace the Mail option with an inline form or just replace it with a button that triggers a form. Let's just make the second option a form.
const oldMailto = `<a 
                  href={\`mailto:invest@yourcompany.com?subject=\${encodeURIComponent(\`Investment Inquiry: \${property.title}\`)}&body=\${encodeURIComponent(\`Hello,\\n\\nI am interested in investing in \${property.title} located at \${property.location}.\\n\\nThe minimum investment is ₦\${property.min_investment.toLocaleString()}.\\n\\nPlease provide me with the next steps to proceed with this investment.\\n\\nThank you.\`)}\`}
                  className="flex items-center w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:bg-gray-800 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#171717] flex items-center justify-center mr-4 shrink-0 shadow-sm shadow-black/10">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#171717] dark:text-white mb-0.5">Send an Email</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Detailed correspondence</p>
                  </div>
                </a>`;

const newForm = `
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white dark:bg-[#171717] text-xs text-gray-500">OR DIRECT INQUIRY</span>
                  </div>
                </div>
                
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <input type="text" placeholder="Your Name" required className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white" />
                  <input type="email" placeholder="Your Email" required className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white" />
                  <button type="submit" disabled={isSubmittingInquiry} className="w-full h-12 bg-[#171717] dark:bg-white text-white dark:text-[#171717] rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center">
                    {isSubmittingInquiry ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </form>
`;

content = content.replace(oldMailto, newForm);

// Add the SuccessModal at the end of the return statement
content = content.replace("</AnimatePresence>\n    </div>", `</AnimatePresence>\n\n      <SuccessModal\n        isOpen={inquirySubmitted}\n        onClose={() => setInquirySubmitted(false)}\n        title="Inquiry Sent!"\n        message={\`Thank you for your interest in \${property.title}. Our investment team will contact you shortly with the next steps.\`}\n        actionButton={\n          <button\n            onClick={() => setInquirySubmitted(false)}\n            className="w-full h-14 flex items-center justify-center rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold hover:bg-gray-800 transition-colors shadow-xl"\n          >\n            Done\n          </button>\n        }\n      />\n    </div>`);

fs.writeFileSync('src/pages/PropertyDetail.tsx', content, 'utf8');
