import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/BlogSidebar";

export default function BlogSidebar({ sidebar }: Props) {
  if (sidebar.items.length === 0) {
    return null;
  }

  return (
    <nav
      className="hidden lg:block w-72 flex-shrink-0 relative overflow-y-auto thin-scrollbar pl-4 py-10"
      aria-label={translate({
        id: "theme.blog.sidebar.navAriaLabel",
        message: "Blog recent posts navigation",
        description: "The ARIA label for recent posts in the blog sidebar",
      })}
    >
      {/* Tech Header */}
      <h3 className="font-mono text-xs font-bold text-neutral-400 dark:text-cyan-500/70 uppercase tracking-widest pl-4 border-l border-neutral-300 dark:border-cyan-900 mb-6">
        // ROOT_DIRECTORY
      </h3>

      <ul className="space-y-1 relative">
        {/* Vertical Guide Line */}
        <div className="absolute left-[7px] top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />

        {sidebar.items.map((item) => (
          <li key={item.permalink} className="relative group">
            {/* Horizontal Connector */}
            <div className="absolute left-[7px] top-1/2 w-3 h-px bg-neutral-200 dark:bg-neutral-800 group-hover:bg-primary dark:group-hover:bg-cyan-400 transition-colors" />

            <Link
              isNavLink
              to={item.permalink}
              className="block pl-8 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-cyan-400 border-l-2 border-transparent hover:border-r-0 transition-all font-medium leading-tight group-hover:translate-x-1"
              activeClassName="!text-primary dark:!text-cyan-400 font-bold bg-primary/5 dark:bg-cyan-900/20 rounded-r-lg"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
