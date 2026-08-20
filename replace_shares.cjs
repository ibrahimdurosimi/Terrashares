const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [oldText, newText] of replacements) {
    content = content.replace(new RegExp(oldText, 'gi'), newText);
  }
  fs.writeFileSync(filePath, content);
}

replaceInFile('src/components/HowItWorks.tsx', [
  ['fractional shares', 'fractional units']
]);

replaceInFile('src/components/WhyLoveCarousel.tsx', [
  ['just a share', 'just a unit']
]);

replaceInFile('src/components/SocialProofToast.tsx', [
  ['bought a share of', 'bought a unit of']
]);

replaceInFile('src/pages/Terms.tsx', [
  ['Property Shares', 'Property Units']
]);

replaceInFile('src/pages/Home.tsx', [
  ['one share at a time', 'one unit at a time']
]);

replaceInFile('src/pages/Properties.tsx', [
  ['Shares', 'Units']
]);
