import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { useHistory, useLocation } from "@docusaurus/router";
import { translate } from "@docusaurus/Translate";
import {
  useActivePlugin,
  useActiveVersion,
} from "@docusaurus/plugin-content-docs/client";
import {
  fetchIndexesByWorker,
  searchByWorker,
} from "@easyops-cn/docusaurus-search-local/dist/client/client/theme/searchByWorker";
import { SearchDocumentType } from "@easyops-cn/docusaurus-search-local/dist/client/shared/interfaces";
import {
  Mark,
  searchBarShortcut,
  searchBarShortcutKeymap,
  docsPluginIdForPreferredVersion,
  searchContextByPaths,
  useAllContextsWithNoSearchContext,
} from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/proxiedGenerated";
// import LoadingRing from "@easyops-cn/docusaurus-search-local/dist/client/client/theme/LoadingRing/LoadingRing"; // Replaced with custom CSS spinner
import { normalizeContextByPath } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/normalizeContextByPath";
import { searchResultLimits } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/proxiedGeneratedConstants";
import {
  parseKeymap,
  matchesKeymap,
} from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/keymap";
import { isMacPlatform } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/platform";
import styles from "./SearchBar.module.css";

const DEBOUNCE_DELAY = 300;

export default function SearchBar() {
  const isBrowser = useIsBrowser();
  const {
    siteConfig: { baseUrl },
    i18n: { currentLocale },
  } = useDocusaurusContext();
  const history = useHistory();
  const location = useLocation();

  // --- Context & Version Logic ---
  const activePlugin = useActivePlugin();
  let versionUrl = baseUrl;
  const activeVersion = useActiveVersion(
    activePlugin?.pluginId ?? docsPluginIdForPreferredVersion,
  );
  if (activeVersion && !activeVersion.isLast) {
    versionUrl = activeVersion.path + "/";
  }

  const [searchContext, setSearchContext] = useState("");
  useEffect(() => {
    if (!Array.isArray(searchContextByPaths)) return;
    let nextSearchContext = "";
    if (location.pathname.startsWith(versionUrl)) {
      const uri = location.pathname.substring(versionUrl.length);
      const matchedPath = searchContextByPaths.find((_path) => {
        const path = typeof _path === "string" ? _path : _path.path;
        return uri === path || uri.startsWith(`${path}/`);
      });
      if (matchedPath) {
        nextSearchContext =
          typeof matchedPath === "string" ? matchedPath : matchedPath.path;
      }
    }
    setSearchContext(nextSearchContext);
  }, [location.pathname, versionUrl]);

  // --- State ---
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [indexLoaded, setIndexLoaded] = useState(false);

  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // --- Actions ---
  const loadIndex = useCallback(async () => {
    if (indexLoaded) return;
    setIsLoading(true);
    await fetchIndexesByWorker(versionUrl, searchContext);
    setIndexLoaded(true);
    setIsLoading(false);
  }, [versionUrl, searchContext, indexLoaded]);

  const performSearch = useCallback(
    async (screenQuery) => {
      if (!screenQuery) {
        setResults([]);
        return;
      }
      setIsLoading(true);

      try {
        // Dev mock for testing
        if (process.env.NODE_ENV === "development" && screenQuery === "test") {
          setResults([
            {
              document: { t: "Test Title A", u: "/docs/a", b: ["Docs"] },
              page: { t: "Page A" },
              type: SearchDocumentType.Keywords,
            },
            {
              document: { t: "Test Title B", u: "/docs/b", b: ["Docs"] },
              page: { t: "Page B" },
              type: SearchDocumentType.Keywords,
            },
          ]);
          setIsLoading(false);
          return;
        }

        const rawResults = await searchByWorker(
          versionUrl,
          searchContext,
          screenQuery,
          searchResultLimits,
        );
        setResults(rawResults);
        setHighlightedIndex(0); // Reset selection
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [versionUrl, searchContext],
  );

  // --- Inputs Handlers ---
  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setQuery(newVal);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(newVal);
    }, DEBOUNCE_DELAY);
  };

  const navigateToResult = (index) => {
    const result = results[index];
    if (result) {
      let url = result.document.u;

      // Add highlight param if tokens exist (mimicking original logic)
      if (Mark && result.tokens && result.tokens.length > 0) {
        const params = new URLSearchParams();
        for (const token of result.tokens) {
          params.append("_highlight", token);
        }
        url += `?${params.toString()}`;
      }

      if (result.document.h) {
        url += result.document.h;
      }

      history.push(url);
      handleClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation(); // Stops global listener from firing

      // Apple Spotlight behavior: if input exists, clear it first.
      if (query && query.length > 0) {
        setQuery("");
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setResults([]);
      } else {
        handleClose();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(
        (prev) => (prev - 1 + results.length) % Math.max(1, results.length),
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      navigateToResult(highlightedIndex);
    }
  };

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    loadIndex();
    // Blur whatever triggered it
    if (document.activeElement) document.activeElement.blur();
  }, [loadIndex]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
  }, []);

  // --- Effect: Shortcuts ---
  useEffect(() => {
    if (!searchBarShortcut || !searchBarShortcutKeymap) return;
    const parsedKeymap = parseKeymap(searchBarShortcutKeymap);
    const handleShortcut = (event) => {
      if (matchesKeymap(event, parsedKeymap)) {
        event.preventDefault();
        if (isOpen) handleClose();
        else handleOpen();
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [isOpen, handleOpen, handleClose]);

  // --- Effect: Focus ---
  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow animation or React render
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // --- Effect: Global Escape ---
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        // If input is focused, the input's onKeyDown will handle it.
        // We only care if focus is lost or bubbling issues.
        // But to be safe and consistent with "Global" idea:
        if (query.length > 0) {
          setQuery("");
          setResults([]);
        } else {
          handleClose();
        }
      }
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, handleClose, query]);

  // --- Render ---
  const isMac = isBrowser ? isMacPlatform() : false;
  const cmdKey = isMac ? "⌘" : "Ctrl";

  return (
    <div className={styles.searchBarContainer}>
      {/* Navbar Trigger */}
      <button
        className={styles.searchTrigger}
        onClick={handleOpen}
        aria-label="Search"
      >
        <SearchIcon className={styles.searchTriggerIcon} />
        <span className={styles.searchTriggerText}>
          {translate({ id: "theme.SearchBar.label", message: "Search" })}
        </span>
        <div className={styles.searchTriggerKeys}>
          <span className={styles.searchTriggerKey}>{cmdKey}</span>
          <span className={styles.searchTriggerKey}>K</span>
        </div>
      </button>

      {/* Modal - Portaled to body to escape Navbar transforms */}
      {isOpen &&
        isBrowser &&
        ReactDOM.createPortal(
          <div className={styles.overlay} onClick={handleClose}>
            <div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              ref={modalRef}
            >
              <div className={styles.searchHeader}>
                {isLoading ? (
                  <LoadingIcon
                    className={styles.loadingIcon}
                    style={{ width: 24, height: 24, marginRight: 16 }}
                  />
                ) : (
                  <SearchIcon className={styles.searchIcon} />
                )}
                <input
                  ref={inputRef}
                  className={styles.searchInput}
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={translate({
                    id: "theme.SearchBar.label",
                    message: "Search",
                    description:
                      "The ARIA label and placeholder for search button",
                  })}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>

              {/* Only show results container if there is query or results */}
              {(query || results.length > 0) && (
                <div className={styles.resultsContainer}>
                  {results.length === 0 && !isLoading && (
                    <div className={styles.noResults}>
                      {translate(
                        {
                          id: "theme.SearchBar.noResultsFound",
                          message: 'No results found for "{query}"',
                          description:
                            "The message shown when no search results are found",
                        },
                        { query },
                      )}
                    </div>
                  )}

                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={styles.resultItem}
                      data-active={index === highlightedIndex}
                      onClick={() => navigateToResult(index)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <span className={styles.resultIcon}>
                        {result.type === 0 ? <DocIcon /> : <HashIcon />}
                      </span>
                      <div className={styles.resultContent}>
                        <div
                          className={styles.resultTitle}
                          dangerouslySetInnerHTML={{
                            __html: result.document.t || result.page?.t,
                          }}
                        />
                        <div className={styles.resultPath}>
                          {result.document.b
                            ? result.document.b.join(" > ")
                            : result.document.u}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.footer}>
                <div className={styles.shortcutHint}>
                  <kbd className={styles.shortcutKey}>↵</kbd>
                  <span>
                    {translate({
                      id: "theme.SearchBar.shortcut.select",
                      message: "to select",
                      description:
                        "The label for the select shortcut in search modal footer",
                    })}
                  </span>
                </div>
                <div className={styles.shortcutHint}>
                  <kbd className={styles.shortcutKey}>↓</kbd>
                  <kbd className={styles.shortcutKey}>↑</kbd>
                  <span>
                    {translate({
                      id: "theme.SearchBar.shortcut.navigate",
                      message: "to navigate",
                      description:
                        "The label for the navigate shortcut in search modal footer",
                    })}
                  </span>
                </div>
                <div className={styles.shortcutHint}>
                  <kbd className={styles.shortcutKey}>esc</kbd>
                  <span>
                    {translate({
                      id: "theme.SearchBar.shortcut.close",
                      message: "to close",
                      description:
                        "The label for the close shortcut in search modal footer",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

// --- Icons ---

const SearchIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="8" cy="8" r="6" />
    <line x1="18" y1="18" x2="12.35" y2="12.35" />
  </svg>
);

const DocIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const HashIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);

const LoadingIcon = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);
