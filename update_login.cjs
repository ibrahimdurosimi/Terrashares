const fs = require('fs');

let content = fs.readFileSync('src/pages/Login.tsx', 'utf8');

// Replace the form structure
content = content.replace(
  '<form className="space-y-6" onSubmit={handleLogin}>',
  '<form className="grid grid-cols-2 gap-4 sm:gap-6" onSubmit={handleLogin}>'
);

content = content.replace(
  '{error && (\n              <div className="bg-red-50',
  '{error && (\n              <div className="col-span-2 bg-red-50'
);

content = content.replace(
  '<div className="pt-4">\n              <button',
  '<div className="col-span-2 pt-4">\n              <button'
);

// Fix the 'Forgot password' to not break the layout or put it under password
content = content.replace(
  '<div className="flex justify-between items-center mb-2">\n                <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider">Password</label>\n                <Link to="/forgot-password" className="text-sm font-bold text-[#9ABA1B] hover:underline">Forgot password?</Link>\n              </div>',
  '<div className="flex justify-between items-center mb-2">\n                <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider truncate mr-2">Password</label>\n                <Link to="/forgot-password" className="text-xs sm:text-sm font-bold text-[#9ABA1B] hover:underline shrink-0 truncate">Forgot?</Link>\n              </div>'
);

fs.writeFileSync('src/pages/Login.tsx', content);
