import React from "react";
import Translate from "@docusaurus/Translate";
import { useThemeConfig } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";

function Footer() {
  const { footer } = useThemeConfig();
  if (!footer) {
    return null;
  }
  const { copyright, links, logo, style } = footer;

  return (
    <footer className="relative bg-white/80 dark:bg-black/40 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8 overflow-hidden z-20">
      {/* Dynamic Background Gradients - Subtle */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[0%] w-[40%] h-[60%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column - Wider */}
          <div className="md:col-span-5 flex flex-col space-y-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="/img/logo.svg"
                  alt="Logo"
                  className="h-10 w-10 relative z-10 transition-transform group-hover:scale-110 duration-500"
                />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
                RainLib
              </span>
            </Link>

            <p className="text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed text-base font-medium">
              <Translate id="footer.tagline">
                Exploring the frontiers of technology, design, and distributed
                systems. Building tools for the future developers.
              </Translate>
            </p>

            {/* Social Links - Enhanced */}
            <div className="flex items-center gap-3 pt-2">
              {[
                {
                  icon: (
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  ),
                  href: "https://github.com/RainLib",
                  label: (
                    <Translate id="footer.social.github">GitHub</Translate>
                  ),
                },
                // Add more social links here
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-110 hover:shadow-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                  aria-label={
                    typeof social.label === "string" ? social.label : "GitHub"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns - Dynamic */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 pt-2">
            {links.map((linkItem, i) => (
              <div key={i} className="flex flex-col space-y-6">
                <h4 className="font-bold text-zinc-900 dark:text-white tracking-wider text-xs uppercase opacity-90 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
                  {linkItem.title}
                </h4>
                <ul className="space-y-4">
                  {linkItem.items.map((item, j) => (
                    <li key={j}>
                      <Link
                        to={item.to || item.href}
                        className="group flex items-center gap-2 text-[15px] text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      >
                        <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 opacity-0 group-hover:opacity-100 text-blue-500 font-bold">
                          →
                        </span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar - Separated */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <div className="text-zinc-500 dark:text-zinc-500 font-medium flex flex-col md:flex-row items-center gap-1 md:gap-4">
            {copyright ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: copyright,
                }}
              />
            ) : (
              <span>© {new Date().getFullYear()} RainLib.</span>
            )}
            <span className="hidden md:inline text-zinc-300 dark:text-zinc-700">
              |
            </span>
            <span>
              <Translate id="footer.rights">All rights reserved.</Translate>
            </span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400 dark:text-zinc-600 font-medium text-xs tracking-wide uppercase">
            {/* Tech Stack Badge Style */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>
                <Translate id="footer.systemStatus">System Normal</Translate>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
