const fs = require('fs');

let homeContent = fs.readFileSync('src/pages/Home.tsx', 'utf8');
homeContent = homeContent.replace(
  '<Link \n              to="/signup"\n              className="w-full sm:w-auto px-8 py-4 bg-[#9ABA1B] text-[#171717] rounded-full font-bold shadow-xl shadow-[#9ABA1B]/20 hover:bg-[#85A316] transition-colors"\n            >\n              Invest Now\n            </Link>',
  '<Link \n              to="/properties"\n              className="w-full sm:w-auto px-8 py-4 bg-[#9ABA1B] text-[#171717] rounded-full font-bold shadow-xl shadow-[#9ABA1B]/20 hover:bg-[#85A316] transition-colors"\n            >\n              Invest Now\n            </Link>'
);
homeContent = homeContent.replace(
  '<Link \n            to="/signup"\n            className="inline-flex h-14 items-center justify-center rounded-full bg-white dark:bg-[#171717] px-10 text-sm font-bold text-[#171717] dark:text-white transition-transform hover:scale-105 shadow-xl"\n          >\n            Invest Now\n          </Link>',
  '<Link \n            to="/properties"\n            className="inline-flex h-14 items-center justify-center rounded-full bg-white dark:bg-[#171717] px-10 text-sm font-bold text-[#171717] dark:text-white transition-transform hover:scale-105 shadow-xl"\n          >\n            Invest Now\n          </Link>'
);

fs.writeFileSync('src/pages/Home.tsx', homeContent);

let navContent = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Remove Log in (desktop)
navContent = navContent.replace(
  '<Link\n                  to="/login"\n                  className="hidden md:inline-flex h-10 items-center justify-center rounded-full border-2 border-[#171717]/10 dark:border-white/10 px-6 text-sm font-semibold text-[#171717] dark:text-white hover:border-[#171717] dark:hover:border-white transition-colors"\n                >\n                  Log in\n                </Link>',
  ''
);

// Replace Join now (desktop)
navContent = navContent.replace(
  '<Link\n                  to="/signup"\n                  className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-[#171717] dark:bg-white px-6 text-sm font-semibold text-white dark:text-[#171717] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"\n                >\n                  Join now\n                </Link>',
  '<a\n                  href="https://wa.me/2348097701222"\n                  target="_blank"\n                  rel="noopener noreferrer"\n                  className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-[#171717] dark:bg-white px-6 text-sm font-semibold text-white dark:text-[#171717] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"\n                >\n                  Join now\n                </a>'
);

// Remove Log in (mobile)
navContent = navContent.replace(
  '<Link\n                      to="/login"\n                      onClick={() => setMobileMenuOpen(false)}\n                      className="flex w-full h-12 items-center justify-center rounded-full border-2 border-[#171717]/10 dark:border-white/10 text-base font-semibold text-[#171717] dark:text-white"\n                    >\n                      Log in\n                    </Link>',
  ''
);

// Replace Join now (mobile)
navContent = navContent.replace(
  '<Link\n                      to="/signup"\n                      onClick={() => setMobileMenuOpen(false)}\n                      className="flex w-full h-12 items-center justify-center rounded-full bg-[#171717] dark:bg-white text-base font-semibold text-white dark:text-[#171717]"\n                    >\n                      Join now\n                    </Link>',
  '<a\n                      href="https://wa.me/2348097701222"\n                      target="_blank"\n                      rel="noopener noreferrer"\n                      onClick={() => setMobileMenuOpen(false)}\n                      className="flex w-full h-12 items-center justify-center rounded-full bg-[#171717] dark:bg-white text-base font-semibold text-white dark:text-[#171717]"\n                    >\n                      Join now\n                    </a>'
);

fs.writeFileSync('src/components/Navbar.tsx', navContent);
