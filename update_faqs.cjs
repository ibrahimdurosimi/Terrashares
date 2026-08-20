const fs = require('fs');
let content = fs.readFileSync('src/components/FAQAccordion.tsx', 'utf8');

content = content.replace(
  'answer: "Real estate is a stable, tangible asset class that historically appreciates over time. It\'s ideal for investors looking for long-term wealth preservation and steady returns."',
  'answer: "Real estate is a stable, tangible asset class that historically appreciates over time. It is ideal for investors looking for long-term wealth preservation and steady returns."'
);

content = content.replace(
  'answer: "Maturity periods vary depending on the specific property asset. You can view the specific duration (typically 12-24 months) on each property\'s detail page."',
  'answer: "6 months to 5 years."'
);

fs.writeFileSync('src/components/FAQAccordion.tsx', content);
