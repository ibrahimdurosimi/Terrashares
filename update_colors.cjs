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
  
  content = content.replace(/#0a0a0a/gi, '#171717');
  content = content.replace(/#9b8924/gi, '#9ABA1B');
  content = content.replace(/#f7d0bc/gi, '#F2E6B6');
  content = content.replace(/#8a791c/gi, '#85A316');
  content = content.replace(/#83731c/gi, '#85A316');
  content = content.replace(/#BFA15F/gi, '#9ABA1B'); // Replace other gold shade with primary
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
