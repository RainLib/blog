import { translate } from "@docusaurus/Translate";
import { iconNoResults } from "./icons";
import styles from "./SearchBar.module.css";
export function EmptyTemplate() {
  if (process.env.NODE_ENV === "production") {
    return `<span class="${styles.noResults}"><span class="${styles.noResultsIcon}">${iconNoResults}</span><span>${translate(
      {
        id: "theme.SearchBar.noResultsText",
        message: "No results",
      },
    )}</span></span>`;
  }
  return `<div class="${styles.noResults}">
        <span class="${styles.noResultsIcon}">${iconNoResults}</span>
        <div style="text-align: center;">
            <p><strong>UI Test Mode (Development)</strong></p>
            <p style="font-size: 0.8em; opacity: 0.7;">Search results only appear after <code>npm run build</code>.</p>
            <p style="font-size: 0.8em; opacity: 0.7;">You can now test the Modal UI and style <code>.suggestion</code> in CSS.</p>
        </div>
    </div>`;
}
