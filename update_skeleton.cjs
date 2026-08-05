const fs = require('fs');

let content = fs.readFileSync('src/pages/Properties.tsx', 'utf8');

const oldSkeleton = `<div key={i} className="animate-pulse bg-white dark:bg-[#171717] rounded-3xl h-[350px] border border-black/5 p-6">
                      <div className="flex gap-4 mb-4">
                        <div className="w-[72px] h-[72px] bg-gray-200 dark:bg-gray-700 rounded-2xl shrink-0"></div>
                        <div className="flex flex-col justify-center gap-2 w-full">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
                    </div>`;

const newSkeleton = `<div key={i} className="animate-pulse bg-white dark:bg-[#171717] rounded-2xl md:rounded-[2rem] p-3 sm:p-5 md:p-6 border border-black/5 flex flex-col h-full">
                      <div className="w-full aspect-[4/3] rounded-xl md:rounded-2xl bg-gray-200 dark:bg-gray-700 mb-4"></div>
                      <div className="flex flex-col flex-grow">
                        <div className="mb-3 space-y-2">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4 mt-auto pt-3 border-t border-black/5 dark:border-white/5">
                          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                        <div className="h-10 md:h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
                      </div>
                    </div>`;

content = content.replace(oldSkeleton, newSkeleton);

fs.writeFileSync('src/pages/Properties.tsx', content);
