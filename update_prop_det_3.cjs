const fs = require('fs');
let content = fs.readFileSync('src/pages/PropertyDetail.tsx', 'utf8');

if (!content.includes('import { PropertyROICalculator }')) {
  content = content.replace("import { FAQAccordion } from '../components/FAQAccordion';", "import { FAQAccordion } from '../components/FAQAccordion';\nimport { PropertyROICalculator } from '../components/PropertyROICalculator';");
}

const injectionPoint = `        {/* 7. Property Value Over Time */}`;
const injectionContent = `        {/* 6.5. ROI Calculator */}
        <div className="mb-12">
          <PropertyROICalculator 
            minInvestment={property.min_investment}
            returnsPercent={property.returns_percent}
            durationMonths={property.duration_months}
          />
        </div>

        {/* 7. Property Value Over Time */}`;

content = content.replace(injectionPoint, injectionContent);

fs.writeFileSync('src/pages/PropertyDetail.tsx', content, 'utf8');
