const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
}

const files = walkSync('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Replace the light cream/brown with a light green tint
  content = content.replace(/#FAF8F5/gi, '#F5F8E8');
  
  // Replace the beige background in Auth pages with the primary green
  content = content.replace(/bg-\[#F2E6B6\]/g, 'bg-[#9ABA1B]');
  
  // Update other usages of F2E6B6 if it acts as a large background
  // (e.g. in About.tsx it is bg-[#F2E6B6]/20, we can change to bg-[#9ABA1B]/10)
  content = content.replace(/bg-\[#F2E6B6\]\/20/g, 'bg-[#9ABA1B]/10');
  content = content.replace(/border-\[#F2E6B6\]\/50/g, 'border-[#9ABA1B]/30');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
