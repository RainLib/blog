import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { SuggestionTemplate } from "./SuggestionTemplate";
import { EmptyTemplate } from "./EmptyTemplate";
import { SearchDocumentType } from "@easyops-cn/docusaurus-search-local/dist/client/shared/interfaces";
import {
  Mark,
  searchBarShortcut,
  searchBarShortcutHint,
  searchBarShortcutKeymap,
  searchBarPosition,
  docsPluginIdForPreferredVersion,
  searchContextByPaths,
  hideSearchBarWithNoSearchContext,
  useAllContextsWithNoSearchContext,
  askAi,
} from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/proxiedGenerated";
import LoadingRing from "@easyops-cn/docusaurus-search-local/dist/client/client/theme/LoadingRing/LoadingRing";
import { normalizeContextByPath } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/normalizeContextByPath";
import { searchResultLimits } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/proxiedGeneratedConstants";
import {
  parseKeymap,
  matchesKeymap,
  getKeymapHints,
} from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/keymap";
import { isMacPlatform } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/platform";
import styles from "./SearchBar.module.css";
async function fetchAutoCompleteJS() {
  const autoCompleteModule = await import("@easyops-cn/autocomplete.js");
  const autoComplete = autoCompleteModule.default;
  if (autoComplete.noConflict) {
    // For webpack v5 since docusaurus v2.0.0-alpha.75
    autoComplete.noConflict();
  } else if (autoCompleteModule.noConflict) {
    // For webpack v4 before docusaurus v2.0.0-alpha.74
    autoCompleteModule.noConflict();
  }
  return autoComplete;
}
async function fetchOpenAskAI() {
  try {
    const openAskAIModule = await import("open-ask-ai");
    await import("open-ask-ai/styles.css");
    return {
      AskAIWidget: openAskAIModule.AskAIWidget,
    };
  } catch (error) {
    // open-ask-ai is optional, return null if not available
    return null;
  }
}
const SEARCH_PARAM_HIGHLIGHT = "_highlight";

export default function SearchBar({ handleSearchBarToggle }) {
  const isBrowser = useIsBrowser();
  const {
    siteConfig: { baseUrl },
    i18n: { currentLocale },
  } = useDocusaurusContext();
  const activePlugin = useActivePlugin();
  let versionUrl = baseUrl;
  const activeVersion = useActiveVersion(
    activePlugin?.pluginId ?? docsPluginIdForPreferredVersion,
  );
  if (activeVersion && !activeVersion.isLast) {
    versionUrl = activeVersion.path + "/";
  }
  const history = useHistory();
  const location = useLocation();

  // --- New Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchBarRef = useRef(null);
  const indexStateMap = useRef(new Map());
  const focusAfterIndexLoaded = useRef(false);
  const [loading, setLoading] = useState(false);
  const [inputChanged, setInputChanged] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const search = useRef(null);
  const askAIWidgetRef = useRef(null);
  const [AskAIWidgetComponent, setAskAIWidgetComponent] = useState(null);
  const prevSearchContext = useRef("");
  const [searchContext, setSearchContext] = useState("");
  const prevVersionUrl = useRef(baseUrl);

  useEffect(() => {
    if (!Array.isArray(searchContextByPaths)) {
      if (prevVersionUrl.current !== versionUrl) {
        indexStateMap.current.delete("");
        prevVersionUrl.current = versionUrl;
      }
      return;
    }
    let nextSearchContext = "";
    if (location.pathname.startsWith(versionUrl)) {
      const uri = location.pathname.substring(versionUrl.length);
      let matchedPath;
      for (const _path of searchContextByPaths) {
        const path = typeof _path === "string" ? _path : _path.path;
        if (uri === path || uri.startsWith(`${path}/`)) {
          matchedPath = path;
          break;
        }
      }
      if (matchedPath) {
        nextSearchContext = matchedPath;
      }
    }
    if (prevSearchContext.current !== nextSearchContext) {
      indexStateMap.current.delete(nextSearchContext);
      prevSearchContext.current = nextSearchContext;
    }
    setSearchContext(nextSearchContext);
  }, [location.pathname, versionUrl]);

  const hidden =
    !!hideSearchBarWithNoSearchContext &&
    Array.isArray(searchContextByPaths) &&
    searchContext === "";

  const loadIndex = useCallback(async () => {
    if (hidden || indexStateMap.current.get(searchContext) === "done") {
      return;
    }
    // If already loading, don't start again
    if (indexStateMap.current.get(searchContext) === "loading") return;

    indexStateMap.current.set(searchContext, "loading");
    search.current?.autocomplete.destroy();
    setLoading(true);
    const [autoComplete, openAskAIModule] = await Promise.all([
      fetchAutoCompleteJS(),
      askAi ? fetchOpenAskAI() : Promise.resolve(null),
      fetchIndexesByWorker(versionUrl, searchContext),
    ]);
    if (openAskAIModule) {
      setAskAIWidgetComponent(() => openAskAIModule.AskAIWidget);
    }

    const searchFooterLinkElement = ({ query, isEmpty }) => {
      const a = document.createElement("a");
      const params = new URLSearchParams();
      params.set("q", query);
      let linkText;
      if (searchContext) {
        const detailedSearchContext =
          searchContext && Array.isArray(searchContextByPaths)
            ? searchContextByPaths.find((item) =>
                typeof item === "string"
                  ? item === searchContext
                  : item.path === searchContext,
              )
            : searchContext;
        const translatedSearchContext = detailedSearchContext
          ? normalizeContextByPath(detailedSearchContext, currentLocale).label
          : searchContext;
        if (useAllContextsWithNoSearchContext && isEmpty) {
          linkText = translate(
            {
              id: "theme.SearchBar.seeAllOutsideContext",
              message: 'See all results outside "{context}"',
            },
            { context: translatedSearchContext },
          );
        } else {
          linkText = translate(
            {
              id: "theme.SearchBar.searchInContext",
              message: 'See all results within "{context}"',
            },
            { context: translatedSearchContext },
          );
        }
      } else {
        linkText = translate({
          id: "theme.SearchBar.seeAll",
          message: "See all results",
        });
      }
      if (
        searchContext &&
        Array.isArray(searchContextByPaths) &&
        (!useAllContextsWithNoSearchContext || !isEmpty)
      ) {
        params.set("ctx", searchContext);
      }
      if (versionUrl !== baseUrl) {
        params.set("version", versionUrl.substring(baseUrl.length));
      }
      const url = `${baseUrl}search/?${params.toString()}`;
      a.href = url;
      a.textContent = linkText;
      a.addEventListener("click", (e) => {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          search.current?.autocomplete.close();
          setIsModalOpen(false); // Close on click
          history.push(url);
        }
      });
      return a;
    };

    search.current = autoComplete(
      searchBarRef.current,
      {
        hint: false,
        autoselect: true,
        openOnFocus: true,
        cssClasses: {
          root: clsx(styles.searchBar, {
            [styles.searchBarLeft]: searchBarPosition === "left",
          }),
          noPrefix: true,
          dropdownMenu: styles.dropdownMenu,
          input: styles.input,
          hint: styles.hint,
          suggestions: styles.suggestions,
          suggestion: styles.suggestion,
          cursor: styles.cursor,
          dataset: styles.dataset,
          empty: styles.empty,
        },
      },
      [
        {
          source: async (input, callback) => {
            if (process.env.NODE_ENV === "development" && input === "test") {
              // Return mock results for UI testing
              callback([
                {
                  document: {
                    i: 1,
                    t: "Mock Result 1",
                    s: "Mock Result 1",
                    u: "/mock-1",
                    b: ["Docs", "Mock"],
                  },
                  type: SearchDocumentType.Keywords,
                  page: { t: "Mock Page 1", b: ["Home"] },
                  metadata: {},
                  tokens: ["test"],
                },
                {
                  document: {
                    i: 2,
                    t: "Mock Result 2 with a longer title to test wrapping",
                    s: "Mock Result 2 with a longer title to test wrapping",
                    u: "/mock-2",
                    b: ["Blog"],
                  },
                  type: SearchDocumentType.Keywords,
                  page: { t: "Mock Blog", b: ["Archive"] },
                  metadata: {},
                  tokens: ["test"],
                },
              ]);
              return;
            }
            const result = await searchByWorker(
              versionUrl,
              searchContext,
              input,
              searchResultLimits,
            );
            if (input && askAi) {
              callback([
                {
                  document: { i: -1, t: "", u: "" },
                  type: SearchDocumentType.AskAI,
                  page: undefined,
                  metadata: {},
                  tokens: [input],
                },
                ...result,
              ]);
            } else {
              callback(result);
            }
          },
          templates: {
            suggestion: SuggestionTemplate,
            empty: EmptyTemplate,
            footer: ({ query, isEmpty }) => {
              if (
                isEmpty &&
                (!searchContext || !useAllContextsWithNoSearchContext)
              ) {
                return;
              }
              const a = searchFooterLinkElement({ query, isEmpty });
              const div = document.createElement("div");
              div.className = styles.hitFooter;
              div.appendChild(a);
              return div;
            },
          },
        },
      ],
    )
      .on(
        "autocomplete:selected",
        function (event, { document: { u, h }, type, tokens }) {
          searchBarRef.current?.blur();
          setIsModalOpen(false); // Close on select
          if (type === SearchDocumentType.AskAI && askAi) {
            askAIWidgetRef.current?.openWithNewSession(tokens.join(""));
            return;
          }
          let url = u;
          if (Mark && tokens.length > 0) {
            const params = new URLSearchParams();
            for (const token of tokens) {
              params.append(SEARCH_PARAM_HIGHLIGHT, token);
            }
            url += `?${params.toString()}`;
          }
          if (h) {
            url += h;
          }
          history.push(url);
        },
      )
      .on("autocomplete:closed", () => {
        // searchBarRef.current?.blur();
      });
    indexStateMap.current.set(searchContext, "done");
    setLoading(false);
    // Focus the input inside the modal
    if (isModalOpen) {
      searchBarRef.current?.focus();
    }
  }, [hidden, searchContext, versionUrl, baseUrl, history, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      loadIndex();
      document.body.style.overflow = "hidden"; // Prevent scroll
    } else {
      document.body.style.overflow = "";
    }
  }, [isModalOpen, loadIndex]);

  // Handle shortcuts to open modal
  useEffect(() => {
    if (!searchBarShortcut || !searchBarShortcutKeymap) return;
    const parsedKeymap = parseKeymap(searchBarShortcutKeymap);
    const handleShortcut = (event) => {
      if (matchesKeymap(event, parsedKeymap)) {
        event.preventDefault();
        setIsModalOpen(true);
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [searchBarShortcutKeymap]);

  const onInputChange = useCallback((event) => {
    setInputValue(event.target.value);
    if (event.target.value) {
      setInputChanged(true);
    }
  }, []);

  const isMac = isBrowser ? isMacPlatform() : false;
  const shortcutHint = getKeymapHints(searchBarShortcutKeymap, isMac);

  return (
    <div className={styles.searchBarContainer}>
      {/* Trigger Button */}
      <button
        className={styles.searchTrigger}
        onClick={() => setIsModalOpen(true)}
        aria-label="Search"
      >
        <MarkIcon className={styles.hitIcon} />
        <span>
          {translate({ id: "theme.SearchBar.label", message: "Search" })}
        </span>
        <div className={styles.searchTriggerKey}>
          {shortcutHint.map((hint, i) => (
            <kbd key={i}>{hint}</kbd>
          ))}
        </div>
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <MarkIcon
                className={styles.hitIcon}
                style={{ width: 24, height: 24, opacity: 0.6 }}
              />
              <div className={styles.searchBar}>
                <input
                  ref={searchBarRef}
                  className={styles.modalInput}
                  placeholder={translate({
                    id: "theme.SearchBar.label",
                    message: "Search",
                  })}
                  value={inputValue}
                  onChange={onInputChange}
                  autoFocus
                />
              </div>
              {inputValue && (
                <button
                  className={styles.searchClearButton}
                  onClick={() => {
                    setInputValue("");
                    search.current?.autocomplete.setVal("");
                    searchBarRef.current?.focus();
                  }}
                  style={{ position: "static", opacity: 0.5 }}
                >
                  ✕
                </button>
              )}
              {loading && <LoadingRing style={{ width: 24, height: 24 }} />}
            </div>

            {/* The dropdown menu will be injected by autocomplete.js near the input.
                Because we set dropdownMenu to position: static in CSS, it will appear here. */}

            <div className={styles.modalFooter}>
              <span>
                <kbd>↵</kbd> select
              </span>
              <span>
                <kbd>↑↓</kbd> navigate
              </span>
              <span>
                <kbd>esc</kbd> close
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MarkIcon = (props) => (
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
